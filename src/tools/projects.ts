import { defineTool } from '@deepseek-ai/dsh-tools'

import type { KungfuRunner } from '../runner.js'
import { objectOutputSchema, renderObject, requireObject } from './shared.js'

export function projectsTool(runner: KungfuRunner) {
  return defineTool({
    name: 'kungfu_projects',
    description:
      'List the local Projects remembered by installed Kungfu, including availability and retained Work counts.',
    parameters: {},
    output: {
      schema: objectOutputSchema,
      render: (_args, value) => renderObject(value),
    },
    isConcurrencySafe: () => true,
    async execute(_args, exec) {
      const value = await runner.runJson(['project', 'list'], exec.signal)
      return requireObject(value)
    },
  })
}
