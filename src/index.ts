import type { Context } from '@deepseek-ai/cordis'

import { createKungfuRunner } from './runner.js'
import { workspaceInspectTool } from './tools/workspace-inspect.js'

export const name = 'dsh-kungfu'
export const inject = ['tools']

export interface Config {
  binary?: string
  timeoutMs?: number
  maxOutputBytes?: number
}

export function apply(ctx: Context, config: Config = {}): void {
  const runner = createKungfuRunner(config)
  ctx.tools.register(workspaceInspectTool(runner))
}
