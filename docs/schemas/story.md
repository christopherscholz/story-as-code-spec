# Story Schema

The story schema defines the **root document** of a Story as Code project. A `story.yaml` serves as the composable entry point — it separates into two layers:

- **World** — the ground truth: what exists (entities, relationships, timelines, rules)
- **Narrative** — the storytelling perspective: how the world is told (perspective, selection, dramaturgical structure, output format)

The narrative layer **does not define its own truth**. All facts live in the world layer. Narrative schemas only select, filter, and arrange world content for storytelling.

## Two-Layer Structure

```yaml
spec_version: "0.4.0"
name: "My Story"

# Ground truth — what exists
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

# Storytelling perspective — how the world is told (defines no own truth)
narrative:
  lenses:
    - $ref: "./lenses/omniscient.yaml"
  formats:
    - $ref: "./formats/novel.yaml"
  beats:
    - $ref: "./beats/main-storyline.yaml"
    - $ref: "./beats/the-call.yaml"
  devices:
    - $ref: "./devices/foreshadowing.yaml"
  threads:
    - $ref: "./threads/courage.yaml"
```

## Composition

Each collection property accepts an array of items that can be defined **inline** or **referenced via `$ref`** from external files. This is analogous to how OpenAPI documents compose components.

```yaml
# Multi-file story (with $ref)
spec_version: "0.4.0"
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
  beats:
    - $ref: "./beats/main-storyline.yaml"
  formats:
    - $ref: "./formats/novel.yaml"
```

The spec does not prescribe a directory layout — file organization is a tooling concern.

## Schema Reference

{%
  include-markdown "./generated/story.md"
%}
