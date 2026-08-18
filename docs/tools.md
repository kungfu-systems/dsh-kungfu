# Tool reference

All tools are local and read-only. They call the installed Kungfu executable
with a fixed argument vector, require a JSON object at the output root, and
return that object unchanged. Exact fields remain owned and versioned by the
installed Kungfu CLI.

## `kungfu_workspace_inspect`

Inspect whether `path` is a Kungfu workspace candidate.

```json
{ "path": "/absolute/or/relative/path" }
```

Runs `kungfu workspace inspect PATH --json`.

## `kungfu_projects`

List Projects remembered by the installed Kungfu runtime, including the
availability and retained Work information provided by that runtime.

```json
{}
```

Runs `kungfu project list`.

## `kungfu_project_works`

List retained durable Work for one local Project.

```json
{ "path": "/absolute/or/relative/project" }
```

Runs `kungfu project works PATH`.

## `kungfu_work_status`

Read the proof-bound orchestration status for one exact Initiative and
Assignment.

```json
{
  "workspace": "/absolute/or/relative/project",
  "initiativeId": "initiative-id",
  "assignmentId": "assignment-id"
}
```

Runs:

```text
kungfu work status --workspace WORKSPACE --initiative-id ID --assignment-id ID
```

## Failures and limits

The plugin reports bounded errors for an unavailable binary, process spawn
failure, non-zero exit, invalid JSON, timeout, cancellation, and output beyond
the configured byte limit. It does not retry, discover credentials, contact a
network service, or reinterpret user input as command options.

Paths and identifiers are passed as individual process arguments. They are not
evaluated by a shell. The configured executable itself is an operator setting;
tool calls cannot replace it or add arbitrary arguments.
