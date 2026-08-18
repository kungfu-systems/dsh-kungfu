## Summary

Describe the behavior and why it belongs in dsh-kungfu.

## Validation

- [ ] `npm test`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm pack --dry-run`
- [ ] Commits are signed off (DCO)

## Safety and provider governance

- [ ] The fixed command allowlist and read-only boundary remain intact
- [ ] No arbitrary shell or command execution was introduced
- [ ] No credentials, tokens, secrets, private logs, paths, or production data
- [ ] Network, telemetry, billing, quota, and provider usage are unchanged or explained
- [ ] Compatibility and residual risks are documented
