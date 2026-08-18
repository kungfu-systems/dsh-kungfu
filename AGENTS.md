# Agent entry point

dsh-kungfu is a standalone DeepSeek Harness plugin that exposes a narrow,
read-only view of an installed Kungfu CLI. Product use, implementation, and
claim boundaries are mapped in `docs/MAP.md`.

To build or change the repository, follow `CONTRIBUTING.md`. The primary checks
are `npm test`, `npm run typecheck`, and `npm run build`.

Keep the adapter read-only. Do not add arbitrary command execution, shell
evaluation, credential handling, network calls, or writes to Kungfu state.
