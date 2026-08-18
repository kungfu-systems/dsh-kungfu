# Documentation map

## Use the plugin

- `README.md` — installation, tool summary, compatibility, and scope.
- `docs/tools.md` — tool inputs, outputs, and examples.

## Understand the implementation

- `src/index.ts` — plugin registration entry point.
- `src/runner.ts` — fixed-argument Kungfu process boundary.
- `src/tools/` — typed read-only tool implementations.
- `test/` — executable behavior and safety evidence.

## Build and review

- `CONTRIBUTING.md` — development, DCO, and pull-request guidance.
- `package.json` — package entry points and DeepSeek Harness bundle metadata.
- `.github/workflows/ci.yml` — source, test, build, and package checks.
- `SECURITY.md` — security reporting and review boundary.

## Claim boundary

The project provides a local adapter over the installed Kungfu CLI. It does not
certify a workspace, operate a hosted service, mutate Kungfu state, or grant
access beyond the invoking user's local permissions.
