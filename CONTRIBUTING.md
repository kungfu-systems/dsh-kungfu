# Contributing

Thank you for improving dsh-kungfu.

## Development

Use Node.js 22 or newer and the public npm registry:

```bash
npm ci --registry=https://registry.npmjs.org/
npm run check
```

Keep changes focused. Adapter behavior belongs in `src/`, tests belong in
`test/`, and user documentation belongs in `docs/`. Preserve the fixed command
allowlist and the read-only boundary.

## Commits and pull requests

Use English Conventional Commit titles and sign every commit under the
Developer Certificate of Origin:

```bash
git commit -s -m "feat(plugin): describe the change"
```

Create work on a classified branch such as `feature/*`, `fix/*`, `chore/*`,
`docs/*`, `ci/*`, or `refactor/*`. Pull requests should explain behavior,
tests, compatibility impact, and residual risk. Never include credentials,
tokens, private logs, private paths, or production data.
