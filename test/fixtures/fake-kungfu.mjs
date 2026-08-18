#!/usr/bin/env node

import process from 'node:process'
import { setTimeout } from 'node:timers'

const args = process.argv.slice(2)
const mode = args[0]

switch (mode) {
  case 'exit':
    process.stderr.write('deliberate failure')
    process.exitCode = 7
    break
  case 'large':
    process.stdout.write('x'.repeat(4096))
    break
  case 'malformed':
    process.stdout.write('{not-json')
    break
  case 'sleep':
    setTimeout(() => process.stdout.write('{"late":true}'), 10_000)
    break
  default:
    process.stdout.write(JSON.stringify({ args }))
}
