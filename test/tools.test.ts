import { describe, expect, it, vi } from 'vitest'

vi.mock('@deepseek-ai/dsh-tools', () => ({
  defineTool: (options: unknown) => options,
}))

import type { JsonValue, KungfuRunner } from '../src/runner.js'
import { projectWorksTool } from '../src/tools/project-works.js'
import { projectsTool } from '../src/tools/projects.js'
import { workStatusTool } from '../src/tools/work-status.js'
import { workspaceInspectTool } from '../src/tools/workspace-inspect.js'

const signal = new AbortController().signal
const execution = { signal } as never

function recordingRunner(response: JsonValue = { schema: 'fixture/v1' }) {
  const calls: Array<{ args: readonly string[]; signal: AbortSignal | undefined }> = []
  const runner: KungfuRunner = {
    async runJson(args, runSignal) {
      calls.push({ args, signal: runSignal })
      return response
    },
  }
  return { calls, runner }
}

describe('Kungfu tool argv', () => {
  it('maps workspace inspection to the read-only JSON command', async () => {
    const fixture = recordingRunner()
    const tool = workspaceInspectTool(fixture.runner)

    await tool.execute({ path: '/work/project' }, execution)

    expect(fixture.calls).toEqual([
      { args: ['workspace', 'inspect', '/work/project', '--json'], signal },
    ])
  })

  it('maps the Project catalog to its fixed command', async () => {
    const fixture = recordingRunner()
    const tool = projectsTool(fixture.runner)

    await tool.execute({}, execution)

    expect(fixture.calls).toEqual([{ args: ['project', 'list'], signal }])
  })

  it('maps Project Work inventory to its fixed path argument', async () => {
    const fixture = recordingRunner()
    const tool = projectWorksTool(fixture.runner)

    await tool.execute({ path: '/work/project' }, execution)

    expect(fixture.calls).toEqual([{ args: ['project', 'works', '/work/project'], signal }])
  })

  it('maps exact Work status identifiers without accepting extra argv', async () => {
    const fixture = recordingRunner()
    const tool = workStatusTool(fixture.runner)

    await tool.execute(
      {
        workspace: '/work/project',
        initiativeId: 'initiative-1',
        assignmentId: 'assignment-1',
      },
      execution,
    )

    expect(fixture.calls).toEqual([
      {
        args: [
          'work',
          'status',
          '--workspace',
          '/work/project',
          '--initiative-id',
          'initiative-1',
          '--assignment-id',
          'assignment-1',
        ],
        signal,
      },
    ])
  })

  it('rejects blank required identifiers before invoking Kungfu', async () => {
    const fixture = recordingRunner()
    const tool = workStatusTool(fixture.runner)

    await expect(
      tool.execute(
        { workspace: ' ', initiativeId: 'initiative-1', assignmentId: 'assignment-1' },
        execution,
      ),
    ).rejects.toThrow('workspace must not be empty')
    expect(fixture.calls).toEqual([])
  })

  it('rejects a non-object JSON root from the installed CLI', async () => {
    const fixture = recordingRunner([])
    const tool = projectsTool(fixture.runner)

    await expect(tool.execute({}, execution)).rejects.toThrow(
      'Kungfu returned JSON with a non-object root',
    )
  })
})
