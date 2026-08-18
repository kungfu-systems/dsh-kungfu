import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import {
  createKungfuRunner,
  KungfuCommandError,
  type KungfuCommandErrorCode,
} from '../src/runner.js'

const fakeBinary = fileURLToPath(new URL('./fixtures/fake-kungfu.mjs', import.meta.url))

async function expectCommandError(
  promise: Promise<unknown>,
  code: KungfuCommandErrorCode,
): Promise<KungfuCommandError> {
  try {
    await promise
  } catch (error) {
    expect(error).toBeInstanceOf(KungfuCommandError)
    expect(error).toMatchObject({ code })
    return error as KungfuCommandError
  }
  throw new Error(`Expected KungfuCommandError with code ${code}`)
}

describe('createKungfuRunner', () => {
  it('uses the configured binary and preserves exact argv without a shell', async () => {
    const runner = createKungfuRunner({ binary: fakeBinary })
    const value = await runner.runJson(['project', 'works', 'path with spaces; echo unsafe'])

    expect(value).toEqual({ args: ['project', 'works', 'path with spaces; echo unsafe'] })
  })

  it('parses a successful JSON value', async () => {
    const runner = createKungfuRunner({ binary: fakeBinary })
    await expect(runner.runJson(['ok'])).resolves.toEqual({ args: ['ok'] })
  })

  it('reports a missing binary', async () => {
    const runner = createKungfuRunner({ binary: `${fakeBinary}-missing` })
    await expectCommandError(runner.runJson(['ok']), 'NOT_FOUND')
  })

  it('reports a non-zero exit with its code and bounded stderr', async () => {
    const runner = createKungfuRunner({ binary: fakeBinary })
    const error = await expectCommandError(runner.runJson(['exit']), 'EXIT')

    expect(error.exitCode).toBe(7)
    expect(error.message).toContain('deliberate failure')
  })

  it('rejects malformed JSON', async () => {
    const runner = createKungfuRunner({ binary: fakeBinary })
    await expectCommandError(runner.runJson(['malformed']), 'INVALID_JSON')
  })

  it('kills output that exceeds the configured byte limit', async () => {
    const runner = createKungfuRunner({ binary: fakeBinary, maxOutputBytes: 128 })
    await expectCommandError(runner.runJson(['large']), 'OUTPUT_LIMIT')
  })

  it('kills a command after the configured timeout', async () => {
    const runner = createKungfuRunner({ binary: fakeBinary, timeoutMs: 25 })
    await expectCommandError(runner.runJson(['sleep']), 'TIMEOUT')
  })

  it('honors cancellation before spawning', async () => {
    const controller = new AbortController()
    controller.abort()
    const runner = createKungfuRunner({ binary: fakeBinary })

    await expectCommandError(runner.runJson(['ok'], controller.signal), 'CANCELLED')
  })

  it('kills an in-flight command when cancelled', async () => {
    const controller = new AbortController()
    const runner = createKungfuRunner({ binary: fakeBinary })
    const run = runner.runJson(['sleep'], controller.signal)
    setTimeout(() => controller.abort(), 25)

    await expectCommandError(run, 'CANCELLED')
  })

  it('rejects invalid limits before spawning', () => {
    expect(() => createKungfuRunner({ timeoutMs: 0 })).toThrow(TypeError)
    expect(() => createKungfuRunner({ maxOutputBytes: -1 })).toThrow(TypeError)
    expect(() => createKungfuRunner({ binary: '   ' })).toThrow(TypeError)
  })
})
