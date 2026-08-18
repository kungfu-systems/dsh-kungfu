# Security policy

Please do not open public issues for suspected vulnerabilities that could place
users at risk. Use GitHub private vulnerability reporting for this repository.

Supported security work currently covers the latest release and the latest
commit on the default branch. Reports should include the affected revision,
impact, reproduction, and suggested containment. Do not include live
credentials or private user data.

The plugin is intentionally local and read-only. A change that introduces
shell evaluation, arbitrary commands, network transport, credential access, or
Kungfu state mutation requires explicit security review.
