# Releasing

Releases are built from an exact reviewed tag. The npm workflow uses npm
trusted publishing and GitHub OIDC; it does not accept a long-lived npm token.

## One-time setup

The npm package must exist before its trusted publisher can be configured. An
owner performs the minimal first-package bootstrap through the official npm
registry, then configures this publisher:

- repository: `kungfu-systems/dsh-kungfu`
- workflow: `publish.yml`
- environment: none

The bootstrap version must not become a production release. The first real
workflow publication replaces the `latest` dist-tag with the reviewed version.

## Publish a reviewed tag

1. Verify the pull request is merged and CI is green.
2. Create the `v`-prefixed release tag at that reviewed source.
3. Dispatch **Publish npm** with the exact tag, such as `v0.1.0`.
4. Verify the npm version, provenance, package contents, and Git tag agree.

The workflow checks that the selected ref is a tag, that checkout `HEAD` is the
tag target, and that the tag and `package.json` versions match. It installs from
the public registry, reruns the complete check suite, previews the tarball, and
then publishes through OIDC with npm provenance.

Never publish from an unreviewed branch, reuse a released version, paste an npm
token into an issue or workflow input, or move an existing release tag.
