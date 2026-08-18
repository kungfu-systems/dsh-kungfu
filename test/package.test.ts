import { readFile } from 'node:fs/promises'

import { describe, expect, it } from 'vitest'

interface PackageManifest {
  dsh?: { bundle?: { patch?: string } }
  files?: string[]
  scripts?: Record<string, string>
}

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as PackageManifest

describe('published package contract', () => {
  it('declares an installable DSH bundle and ships its patch', async () => {
    expect(manifest.dsh?.bundle?.patch).toBe('./cordis.patch.yml')
    expect(manifest.files).toContain('dist/')
    expect(manifest.files).toContain('cordis.patch.yml')

    const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
    expect(patch).toContain("name: '@kungfu-tech/dsh-kungfu'")
  })

  it('does not execute install lifecycle scripts', () => {
    expect(manifest.scripts?.preinstall).toBeUndefined()
    expect(manifest.scripts?.install).toBeUndefined()
    expect(manifest.scripts?.postinstall).toBeUndefined()
    expect(manifest.scripts?.prepare).toBeUndefined()
  })
})
