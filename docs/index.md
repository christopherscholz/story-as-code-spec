# Story as Code

> Declarative YAML specification for defining fictional worlds as temporal graphs and deriving narratives from them.

## What is Story as Code?

Story as Code treats fictional worlds as **source code** — structured, versioned, and compilable. Instead of writing narratives directly, you declare a world graph of characters, locations, events, and their relationships. Narratives are then **derived** from this graph through lenses, arcs, and formats.

Think of it like a compiler: the world graph is your source, the narrative is your compiled output.

### Core Principles

- **Git-native** — Worlds are Git repositories with semantic commit conventions
- **Declarative** — The graph declares what exists and when; narratives are derived, never primary
- **Temporally rich** — Time is graph topology, supporting branches, loops, and retrocausality
- **Schema-flexible** — The type system is extensible for custom world rules
- **Format-agnostic** — Same world can produce prose, screenplays, comics, audio, or interactive narratives

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Nodes** | Entities in the world — characters, locations, objects, events, concepts |
| **Edges** | Relationships and connections between nodes |
| **Frames** | Temporal contexts with different topologies (linear, branching, cyclical) |
| **Lenses** | Narrative perspective configurations — who tells the story, how, and what they know |
| **Arcs** | Dramatic structure definitions with milestones and conditions |
| **Formats** | Output structure (novel, screenplay, comic) with pacing rules |
| **Derivations** | Compiled narrative outputs linked back to the graph |

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
```

## Status

This specification is in **Draft v0.1.0**. Read the full [Specification](spec.md) for details.

## Contributing

See [Contributing](contributing.md) for how to participate in the development of this specification.
