# Story Schema

The story schema defines the **root document** of a Story as Code project. A `story.yaml` serves as the composable entry point — it separates into two layers: **world** (graph structure) and **narrative** (storytelling configuration).

## Two-Layer Structure

```yaml
spec_version: "0.2.0"
name: "My Story"

world:
  time_system:
    id: earth-time
    type: LINEAR
    epoch: "Year 0"

  nodes:
    - id: hero
      type: CHARACTER
      static: { name_variants: ["The Hero"] }

  edges:
    - id: hero-in-village
      type: SPATIAL
      source: hero
      target: village

  frames: []
  constraints: []

narrative:
  lenses:
    - $ref: "./lenses/omniscient.yaml"
  formats:
    - $ref: "./formats/novel.yaml"
  arcs:
    - $ref: "./arcs/main.yaml"
```

## Composition

Each collection property accepts an array of items that can be defined **inline** or **referenced via `$ref`** from external files. This is analogous to how OpenAPI documents compose components.

```yaml
# Multi-file story (with $ref)
spec_version: "0.2.0"
name: "An Epic Saga"

world:
  time_system:
    $ref: "./time.yaml"
  nodes:
    - $ref: "./characters/hero.yaml"
    - $ref: "./characters/villain.yaml"
    - id: village
      type: LOCATION
  edges:
    - $ref: "./relationships.yaml"
  frames:
    - $ref: "./timelines/alt.yaml"

narrative:
  lenses:
    - $ref: "./lenses/hero-pov.yaml"
  arcs:
    - $ref: "./arcs/main.yaml"
  formats:
    - $ref: "./formats/novel.yaml"
```

The spec does not prescribe a directory layout — file organization is a tooling concern.

## Schema Definition

```yaml
{% include "../../schemas/story.schema.yaml" %}
```
