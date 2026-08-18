# dsh-kungfu

`dsh-kungfu` is a standalone DeepSeek Harness plugin for inspecting installed
Kungfu Projects and durable Work state through typed, read-only tools.

The first release targets Kungfu `4.0.0-alpha.2` and does not require changes
to Kungfu itself. The plugin invokes a fixed allowlist of local Kungfu CLI
commands without a shell, applies time and output limits, and returns structured
results to the Harness.

## Status

The repository is being bootstrapped for v0.1. Installation and tool reference
will be added with the first reviewed release.

## Scope

- local, read-only inspection only;
- no arbitrary command or shell execution;
- no credential collection or network transport;
- no mutation of Kungfu Projects, Work, or configuration.

## Project map

- [`docs/MAP.md`](docs/MAP.md) routes users, contributors, and reviewers.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) covers development and DCO.
- [`SECURITY.md`](SECURITY.md) describes private vulnerability reporting.

## License

Apache-2.0. See [`LICENSE`](LICENSE). Project names and marks are addressed in
[`TRADEMARK.md`](TRADEMARK.md).
