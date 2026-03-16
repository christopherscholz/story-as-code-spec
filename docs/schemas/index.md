# Schemas

The Story as Code specification defines the following YAML schemas (v0.1.0).

## Composition Model

A `world.yaml` is the **root document** of a Story as Code project. All other schemas (except Derivation Meta) are **item schemas** for collections defined on the world document — similar to how OpenAPI components can be inline or `$ref`-referenced.

Items in each collection can be:

- **Inline** — defined directly inside `world.yaml`
- **Referenced** — pointed to via `$ref` from any file location

The spec does **not** prescribe a directory layout. A single-file world and a multi-file project with arbitrary directory structure are equally valid, as long as the schemas are satisfied.

## Root Document

| Schema | Description |
|--------|-------------|
| [World](world.md) | Root `world.yaml` — composable entry point with collection properties |

## Item Schemas (sub-schemas of World)

| Schema | World property | Description |
|--------|---------------|-------------|
| [Node](node.md) | `nodes[]` | Story world entities (types defined by schemas) |
| [Edge](edge.md) | `edges[]` | Relationships between nodes |
| [Frame](frame.md) | `frames[]` | Temporal frames and time topologies |
| [Lens](lens.md) | `lenses[]` | Narrative perspective and filters |
| [Format](format.md) | `formats[]` | Output format definitions |
| [Arc](arc.md) | `arcs[]` | Story arcs with milestones |
| [Constraint](constraint.md) | `constraints[]` | World rules and validation |
| [Schema](schema.md) | `schemas[]` | User/community schema definitions |
| [Variant Meta](variant-meta.md) | `variants[]` | Parallel world version metadata |

## Supporting Schemas

| Schema | Description |
|--------|-------------|
| [Derivation Meta](derivation-meta.md) | Derivation validation contracts (produced alongside compiled outputs) |
