import { defineTool } from '@deepseek-ai/dsh-tools'

import type { KungfuRunner } from '../runner.js'
import { objectOutputSchema, renderObject, requireObject, requireText } from './shared.js'

export function workspaceInspectTool(runner: KungfuRunner) {
  return defineTool({
    name: 'kungfu_workspace_inspect',
    description:
      'Inspect a local workspace candidate through installed Kungfu without creating or changing it.',
    parameters: {
      path: {
        type: 'string',
        required: true,
        description: 'Absolute or relative workspace path to inspect.',
      },
    },
    output: {
      schema: objectOutputSchema,
      render: (_args, value) => renderObject(value),
    },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const path = requireText(args.path, 'path')
      const value = await runner.runJson(['workspace', 'inspect', path, '--json'], exec.signal)
      return requireObject(value)
    },
  })
}
