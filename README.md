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

A minimal world consists of a `world.yaml` and node files:

```yaml
# world.yaml
id: "world_fairy_tale"
name: "A Simple Fairy Tale"
version: "0.1.0"
default_frame: "frame_main"
schemas:
  - schema_core
```

```yaml
# graph/nodes/character/hero.yaml
id: "char_hero"
type: CHARACTER
name: "The Hero"
states:
  - frame: "frame_main"
    at: "T:0"
    properties:
      age: 18
      location: "loc_village"
      trait_courage: 0.8
```

```yaml
# graph/edges/quest_begins.yaml
id: "edge_quest"
type: ACTION
subtype: INITIATES
source: "char_hero"
target: "evt_quest_start"
frame: "frame_main"
at: "T:1"
```

## Repository Structure

```
world.yaml                    # Root metadata
graph/
  nodes/{type}/              # One YAML file per entity
  edges/                     # Relationships between entities
  frames/                    # Temporal frame definitions
schemas/                     # Type definitions and constraints
  schema_core.yaml           # Built-in types
constraints/                 # World rules
lenses/                      # Narrative perspective configs
arcs/                        # Story arc definitions
formats/                     # Output format definitions
derivations/                 # Generated output content
```

## Status

This specification is in **Draft v0.1.0**. The core concepts are defined but subject to change. Feedback and contributions are welcome.
<!-- content-end -->

## Documentation

Read the full documentation at **[christopherscholz.github.io/story-as-code-spec](https://christopherscholz.github.io/story-as-code-spec/)**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to participate in the development of this specification.

## License

Apache License 2.0 — see [LICENSE](LICENSE).
