import { defineTool } from '@deepseek-ai/dsh-tools'

import type { KungfuRunner } from '../runner.js'
import { objectOutputSchema, renderObject, requireObject, requireText } from './shared.js'

export function workStatusTool(runner: KungfuRunner) {
  return defineTool({
    name: 'kungfu_work_status',
    description:
      'Read the proof-bound orchestration status for one exact Kungfu Initiative and Assignment.',
    parameters: {
      workspace: {
        type: 'string',
        required: true,
        description: 'Absolute or relative path to the owning Kungfu workspace.',
      },
      initiativeId: {
        type: 'string',
        required: true,
        description: 'Exact Kungfu Initiative identifier.',
      },
      assignmentId: {
        type: 'string',
        required: true,
        description: 'Exact Kungfu Assignment identifier.',
      },
    },
    output: {
      schema: objectOutputSchema,
      render: (_args, value) => renderObject(value),
    },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const workspace = requireText(args.workspace, 'workspace')
      const initiativeId = requireText(args.initiativeId, 'initiativeId')
      const assignmentId = requireText(args.assignmentId, 'assignmentId')
      const value = await runner.runJson(
        [
          'work',
          'status',
          '--workspace',
          workspace,
          '--initiative-id',
          initiativeId,
          '--assignment-id',
          assignmentId,
        ],
        exec.signal,
      )
      return requireObject(value)
    },
  })
}
