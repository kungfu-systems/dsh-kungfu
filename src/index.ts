import type { Context } from '@deepseek-ai/cordis'

import { createKungfuRunner } from './runner.js'
import { projectWorksTool } from './tools/project-works.js'
import { projectsTool } from './tools/projects.js'
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
  ctx.tools.register(projectsTool(runner))
  ctx.tools.register(projectWorksTool(runner))
}
