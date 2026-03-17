# Story as Code Spec

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Spec Version](https://img.shields.io/badge/Spec-v0.1.0_Draft-orange.svg)](docs/spec.md)
[![GitHub Pages](https://img.shields.io/badge/Docs-GitHub_Pages-brightgreen.svg)](https://christopherscholz.github.io/story-as-code-spec/)

<!-- content-start -->
> Declarative YAML specification for defining worlds as temporal graphs and deriving outputs from them.

## What is Story as Code?

Story as Code treats worlds as **source code** — structured, versioned, and compilable. Instead of writing stories directly, you declare a world graph of characters, locations, events, and their relationships. Outputs are then **derived** from this graph through lenses, arcs, and output formats — e.g. tweets, short stories, comic panels, books, screenplays, and more.

Think of it like a compiler: the world graph is your source, the output is your compiled result.

### Core Principles

- **Declarative** — The graph declares what exists and when; outputs are derived, never primary
- **Temporally rich** — Time is graph topology, supporting branches, loops, and retrocausality
- **Schema-flexible** — The type system is extensible for custom world rules
- **Format-agnostic** — Same world can produce tweets, prose, screenplays, comics, audio, or interactive experiences

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Nodes** | Entities in the world — characters, locations, objects, events, concepts |
| **Edges** | Relationships and connections between nodes |
| **Frames** | Temporal contexts with different topologies (linear, branching, cyclical) |
| **Lenses** | Narrative perspective configurations — who tells the story, how, and what they know |
| **Arcs** | Dramatic structure definitions with milestones and conditions |
| **Formats** | Output format definitions (tweet, short story, comic panel, book, screenplay, ...) with pacing rules |
| **Derivations** | Compiled outputs linked back to the graph |

## Quick Start

A minimal world is a single `world.yaml`:

```yaml
# world.yaml — everything in one file
spec_version: "0.1.0"
name: "A Simple Fairy Tale"
default_frame: "main"

nodes:
  - id: hero
    type: CHARACTER
    category: protagonist
    properties:
      age: 18
      trait_courage: 0.8

  - id: village
    type: LOCATION

edges:
  - id: quest_begins
    type: ACTION
    subtype: INITIATES
    source: hero
    target: quest_start
    valid_in:
      - frame: main
        from: T1

frames:
  - id: main
    topology: LINEAR
    time_points: [T0, T1, T2]
```

As projects grow, split items into separate files and reference them:

```yaml
# world.yaml — with $ref
spec_version: "0.1.0"
name: "A Simple Fairy Tale"
default_frame: "main"

nodes:
  - $ref: "./characters/hero.yaml"
  - $ref: "./locations.yaml"

edges:
  - $ref: "./relationships.yaml"

frames:
  - $ref: "./timeline.yaml"
```

The spec does not prescribe a directory layout — inline definitions and `$ref` references can be mixed freely, and file organization is up to you and your tooling.

## Status

This specification is in **Draft v0.1.0**. The core concepts are defined but subject to change. Feedback and contributions are welcome.
<!-- content-end -->

## Documentation

Read the full documentation at **[christopherscholz.github.io/story-as-code-spec](https://christopherscholz.github.io/story-as-code-spec/)**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to participate in the development of this specification.

## License

Apache License 2.0 — see [LICENSE](LICENSE).
