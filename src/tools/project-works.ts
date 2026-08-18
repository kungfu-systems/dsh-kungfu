import { defineTool } from '@deepseek-ai/dsh-tools'

import type { KungfuRunner } from '../runner.js'
import { objectOutputSchema, renderObject, requireObject, requireText } from './shared.js'

export function projectWorksTool(runner: KungfuRunner) {
  return defineTool({
    name: 'kungfu_project_works',
    description:
      'List retained durable Work captured in one local Kungfu Project without changing its active Work.',
    parameters: {
      path: {
        type: 'string',
        required: true,
        description: 'Absolute or relative path to the Kungfu Project.',
      },
    },
    output: {
      schema: objectOutputSchema,
      render: (_args, value) => renderObject(value),
    },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const path = requireText(args.path, 'path')
      const value = await runner.runJson(['project', 'works', path], exec.signal)
      return requireObject(value)
    },
  })
}
