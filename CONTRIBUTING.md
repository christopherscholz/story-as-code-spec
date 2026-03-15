# Contributing to Story as Code Spec

<!-- contributing-start -->
Thank you for your interest in contributing to the Story as Code specification! This document explains how to participate.

## How to Contribute

### Discussions

For questions, ideas, and general feedback, use [GitHub Discussions](https://github.com/christopherscholz/story-as-code-spec/discussions). This is the best place to start before opening an issue or pull request.

### Issues

- **Spec changes** — Propose modifications to the specification
- **Bug reports** — Report schema errors or inconsistencies
- **Feature requests** — Suggest new concepts or schema extensions

### Pull Requests

1. Fork the repository
2. Create a branch from `main`
3. Make your changes
4. Ensure YAML files pass validation (`yamllint`)
5. Submit a pull request

## Commit Conventions

This project uses semantic commit messages with the following scopes:

| Scope | Description |
|-------|-------------|
| `graph` | Node, edge, or frame changes |
| `schema` | Schema definitions and type changes |
| `constraint` | World rule changes |
| `lens` | Narrative perspective changes |
| `arc` | Story arc changes |
| `format` | Output format changes |
| `derive` | Derivation-related changes |
| `meta` | Repository metadata, CI, docs |

Example: `feat(schema): add magic system node types`

## Schema Extension Process

To propose a new schema extension:

1. Open an issue describing the use case
2. Draft the schema YAML following the existing patterns in `schemas/`
3. Include example node/edge definitions that use your schema
4. Submit a pull request for review

## Spec Change Process

Changes to the core specification (`docs/spec.md`) require:

1. An issue describing the motivation and proposed change
2. Discussion in the issue or in Discussions
3. A pull request with the spec change and any affected schema updates
4. Review and approval

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.
<!-- contributing-end -->
