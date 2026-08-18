import { spawn } from 'node:child_process'

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

export type KungfuCommandErrorCode =
  | 'CANCELLED'
  | 'EXIT'
  | 'INVALID_JSON'
  | 'NOT_FOUND'
  | 'OUTPUT_LIMIT'
  | 'SPAWN'
  | 'TIMEOUT'

export class KungfuCommandError extends Error {
  readonly code: KungfuCommandErrorCode
  readonly exitCode: number | undefined

  constructor(code: KungfuCommandErrorCode, message: string, exitCode?: number) {
    super(message)
    this.name = 'KungfuCommandError'
    this.code = code
    this.exitCode = exitCode
  }
}

export interface KungfuRunnerOptions {
  binary?: string
  timeoutMs?: number
  maxOutputBytes?: number
}

export interface KungfuRunner {
  runJson(args: readonly string[], signal?: AbortSignal): Promise<JsonValue>
}

const DEFAULT_TIMEOUT_MS = 15_000
const DEFAULT_MAX_OUTPUT_BYTES = 1_048_576

function positiveInteger(value: number, label: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`${label} must be a positive safe integer`)
  }
  return value
}

function nonEmpty(value: string, label: string): string {
  if (value.trim().length === 0) {
    throw new TypeError(`${label} must not be empty`)
  }
  return value
}

export function createKungfuRunner(options: KungfuRunnerOptions = {}): KungfuRunner {
  const binary = nonEmpty(options.binary ?? 'kungfu', 'binary')
  const timeoutMs = positiveInteger(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, 'timeoutMs')
  const maxOutputBytes = positiveInteger(
    options.maxOutputBytes ?? DEFAULT_MAX_OUTPUT_BYTES,
    'maxOutputBytes',
  )

  return {
    runJson(args, signal) {
      return runJson(binary, args, timeoutMs, maxOutputBytes, signal)
    },
  }
}

function runJson(
  binary: string,
  args: readonly string[],
  timeoutMs: number,
  maxOutputBytes: number,
  signal?: AbortSignal,
): Promise<JsonValue> {
  if (signal?.aborted) {
    return Promise.reject(new KungfuCommandError('CANCELLED', 'Kungfu command was cancelled'))
  }

  return new Promise((resolve, reject) => {
    const child = spawn(binary, [...args], {
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    let outputBytes = 0
    let settled = false

    const cleanup = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    }

    const fail = (error: KungfuCommandError) => {
      if (settled) return
      settled = true
      cleanup()
      child.kill()
      reject(error)
    }

    const collect = (target: Buffer[], chunk: Buffer | string) => {
      if (settled) return
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      outputBytes += buffer.byteLength
      if (outputBytes > maxOutputBytes) {
        fail(
          new KungfuCommandError(
            'OUTPUT_LIMIT',
            `Kungfu output exceeded ${maxOutputBytes} bytes`,
          ),
        )
        return
      }
      target.push(buffer)
    }

    const onAbort = () => {
      fail(new KungfuCommandError('CANCELLED', 'Kungfu command was cancelled'))
    }

    const timer = setTimeout(() => {
      fail(new KungfuCommandError('TIMEOUT', `Kungfu command timed out after ${timeoutMs}ms`))
    }, timeoutMs)
    timer.unref()

    signal?.addEventListener('abort', onAbort, { once: true })
    child.stdout.on('data', (chunk: Buffer | string) => collect(stdout, chunk))
    child.stderr.on('data', (chunk: Buffer | string) => collect(stderr, chunk))

    child.once('error', (error: NodeJS.ErrnoException) => {
      const code = error.code === 'ENOENT' ? 'NOT_FOUND' : 'SPAWN'
      fail(new KungfuCommandError(code, `Unable to start Kungfu: ${error.message}`))
    })

    child.once('close', (code, closeSignal) => {
      if (settled) return
      settled = true
      cleanup()

      const stderrText = Buffer.concat(stderr).toString('utf8').trim()
      if (code !== 0) {
        const detail = stderrText || (closeSignal ? `signal ${closeSignal}` : 'no error output')
        reject(
          new KungfuCommandError(
            'EXIT',
            `Kungfu exited with code ${code ?? 'unknown'}: ${detail}`,
            code ?? undefined,
          ),
        )
        return
      }

      const output = Buffer.concat(stdout).toString('utf8').trim()
      try {
        resolve(JSON.parse(output) as JsonValue)
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        reject(new KungfuCommandError('INVALID_JSON', `Kungfu returned invalid JSON: ${detail}`))
      }
    })
  })
}
