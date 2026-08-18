# dsh-kungfu

`dsh-kungfu` is a standalone DeepSeek Harness plugin for inspecting installed
Kungfu Projects and durable Work state through typed, read-only tools.

The first release targets Kungfu `4.0.0-alpha.2` and does not require changes
to Kungfu itself. The plugin invokes a fixed allowlist of local Kungfu CLI
commands without a shell, applies time and output limits, and returns structured
results to the Harness.

## Status

Version 0.1 targets DeepSeek Harness `0.1.0-rc.x` and an installed Kungfu
`4.0.0-alpha.2`. It was tested against the public DSH plugin interfaces and the
four exact read-only commands exposed by Kungfu alpha.2.

## Requirements

- Node.js 22 or newer;
- DeepSeek Harness with `@deepseek-ai/dsh-tools` in the supported peer range;
- `kungfu` `4.0.0-alpha.2` available on `PATH`, or an explicit `KUNGFU_BIN`.

## Install

Install the prebuilt npm package into a Harness profile:

```bash
dsh plugin --profile default add @kungfu-tech/dsh-kungfu
```

Until the npm package is available, use the prebuilt tarball attached to the
GitHub release:

```bash
dsh plugin --profile default add \
  https://github.com/kungfu-systems/dsh-kungfu/releases/latest/download/kungfu-tech-dsh-kungfu-0.1.0.tgz
```

Restart that profile after installation. The bundle patch registers the plugin
with these defaults:

```yaml
binary: kungfu
timeoutMs: 15000
maxOutputBytes: 1048576
```

Set `KUNGFU_BIN` before starting the Harness when the executable is not named
`kungfu` or is outside `PATH`.

## Tools

| Tool | Purpose | Installed Kungfu command |
| --- | --- | --- |
| `kungfu_workspace_inspect` | Inspect one workspace candidate. | `kungfu workspace inspect PATH --json` |
| `kungfu_projects` | List remembered local Projects. | `kungfu project list` |
| `kungfu_project_works` | List retained Work for one Project. | `kungfu project works PATH` |
| `kungfu_work_status` | Read one exact Initiative/Assignment status. | `kungfu work status --workspace ... --initiative-id ... --assignment-id ...` |

See [`docs/tools.md`](docs/tools.md) for inputs, outputs, and error behavior.

## Scope

- local, read-only inspection only;
- no arbitrary command or shell execution;
- no credential collection or network transport;
- no mutation of Kungfu Projects, Work, or configuration.

The plugin launches only the fixed argument vectors above with `shell: false`.
It applies cancellation, timeout, and combined-output limits before parsing a
JSON object. Results can contain local paths and Work metadata already visible
to the invoking user, so treat Harness transcripts as potentially sensitive.

## Project map

- [`docs/MAP.md`](docs/MAP.md) routes users, contributors, and reviewers.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) covers development and DCO.
- [`SECURITY.md`](SECURITY.md) describes private vulnerability reporting.

## License

Apache-2.0. See [`LICENSE`](LICENSE). Project names and marks are addressed in
[`TRADEMARK.md`](TRADEMARK.md).
