# Schemas

The Story as Code specification defines the following YAML schemas (v0.3.0).

## Two-Layer Architecture

A story is structured into two layers:

- **World Layer** — the ground truth of the story universe. Everything that exists — entities, relationships, timelines, rules — is defined here. The world layer is the single source of truth.
- **Narrative Layer** — the storytelling perspective. Defines how the world is told: from which perspective, in which selection, in which output format. The narrative layer **does not define its own truth** — it only selects, filters, and presents content from the world layer.

## Composition Model

A `story.yaml` is the **root document** of a Story as Code project. It contains a `world` object (the graph) and an optional `narrative` object (the storytelling configuration). All item schemas can be **inline** or **`$ref`-referenced** — similar to how OpenAPI components work.

The spec does **not** prescribe a directory layout. A single-file story and a multi-file project with arbitrary directory structure are equally valid, as long as the schemas are satisfied.

## Root Document

| Schema | Description |
|--------|-------------|
| [Story](story.md) | Root `story.yaml` — composable entry point with `world` and `narrative` |

## World Layer (Ground Truth)

| Schema | Property path | Description |
|--------|--------------|-------------|
| [World](world.md) | `world` | World graph structure — the single source of truth |
| [Time System](time-system.md) | `world.time_system` | Defines how time works in this world |
| [Node](node.md) | `world.nodes[]` | Story world entities |
| [Edge](edge.md) | `world.edges[]` | Relationships between nodes |
| [Frame](frame.md) | `world.frames[]` | Alternative timelines and branches |
| [Constraint](constraint.md) | `world.constraints[]` | World rules and validation with scope filters |

## Narrative Layer (Storytelling Perspective)

| Schema | Property path | Description |
|--------|--------------|-------------|
| [Lens](lens.md) | `narrative.lenses[]` | Narrative perspective — filters and interprets world content |
| [Format](format.md) | `narrative.formats[]` | Output format — purely about presentation |
| [Arc](arc.md) | `narrative.arcs[]` | Story arcs — group related world graph elements of a storyline |
| [Variant Meta](variant-meta.md) | `narrative.variants[]` | Parallel world version metadata |

## Supporting Schemas

| Schema | Description |
|--------|-------------|
| [Derivation Meta](derivation-meta.md) | Derivation validation contracts (produced alongside compiled outputs) |
