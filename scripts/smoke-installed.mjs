#!/usr/bin/env node

import { spawn } from 'node:child_process'

const binary = process.env.KUNGFU_BIN ?? 'kungfu'
const workspace = process.argv[2] ?? process.cwd()

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, {
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })
    const stdout = []
    const stderr = []

    child.stdout.on('data', (chunk) => stdout.push(chunk))
    child.stderr.on('data', (chunk) => stderr.push(chunk))
    child.once('error', reject)
    child.once('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${binary} exited with code ${code}: ${Buffer.concat(stderr).toString('utf8').trim()}`))
        return
      }
      resolve(Buffer.concat(stdout).toString('utf8').trim())
    })
  })
}

function rootSchema(text, label) {
  const value = JSON.parse(text)
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new TypeError(`${label} returned a non-object JSON root`)
  }
  return typeof value.schema === 'string' ? value.schema : '(no schema field)'
}

const versionOutput = await run(['--version'])
const version = versionOutput.split(/\r?\n/, 1)[0]
if (version !== '4.0.0-alpha.2') {
  throw new Error(`Expected Kungfu 4.0.0-alpha.2, received ${version}`)
}

const checks = [
  ['workspace inspect', ['workspace', 'inspect', workspace, '--json']],
  ['project list', ['project', 'list']],
  ['project works', ['project', 'works', workspace]],
]

console.log(`Kungfu ${version}`)
for (const [label, args] of checks) {
  const schema = rootSchema(await run(args), label)
  console.log(`${label}: ok (${schema})`)
}
