# World Schema

The world schema defines the **root document** of a Story as Code project. A `world.yaml` serves as the composable entry point — all other schemas are item schemas for the collections defined here.

## Composition

Each collection property (`nodes`, `edges`, `frames`, etc.) accepts an array of items that can be defined **inline** or **referenced via `$ref`** from external files. This is analogous to how OpenAPI documents compose components.

```yaml
# Single-file world (everything inline)
spec_version: "0.1.0"
name: "A Simple Fairy Tale"
default_frame: "main"

nodes:
  - id: hero
    type: CHARACTER
    static: { name_variants: ["The Hero"] }

frames:
  - id: main
    topology: LINEAR
    time_points: [T0, T1, T2]
```

```yaml
# Multi-file world (with $ref)
spec_version: "0.1.0"
name: "An Epic Saga"
default_frame: "main"

nodes:
  - $ref: "./characters/hero.yaml"
  - $ref: "./characters/villain.yaml"
  - id: village              # inline and $ref can be mixed
    type: LOCATION

edges:
  - $ref: "./relationships.yaml"

frames:
  - $ref: "./timeline.yaml"

arcs:
  - $ref: "./arcs/main.yaml"
```

The spec does not prescribe a directory layout — file organization is a tooling concern.

## Schema Definition

```yaml
{% include "../../schemas/world.schema.yaml" %}
```
