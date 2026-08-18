import type { Context } from '@deepseek-ai/cordis'

export const name = 'dsh-kungfu'
export const inject = ['tools']

export interface Config {
  binary?: string
  timeoutMs?: number
  maxOutputBytes?: number
}

export function apply(ctx: Context, config: Config = {}): void {
  void ctx
  void config
}
