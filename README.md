# Story as Code Spec

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Spec Version](https://img.shields.io/badge/Spec-dev-orange.svg)](docs/spec.md)
[![GitHub Pages](https://img.shields.io/badge/Docs-GitHub_Pages-brightgreen.svg)](https://christopherscholz.github.io/story-as-code-spec/)

<!-- content-start -->
> Declarative JSON-LD specification for defining worlds as temporal graphs and deriving outputs from them.

## What is Story as Code?

Story as Code treats worlds as **source code** — structured, versioned, and compilable. Instead of writing stories directly, you declare a world graph of characters, locations, events, and their relationships. Outputs are then **derived** from this graph through lenses, arcs, and output formats — e.g. tweets, short stories, comic panels, books, screenplays, and more.

Think of it like a compiler: the world graph is your source, the output is your compiled result.

The spec is grounded in the **Semantic Web stack** — an OWL ontology defines the vocabulary, SHACL shapes enforce structural constraints, and all story data is expressed as JSON-LD, making every world graph a valid RDF dataset.

### Core Principles

- **Declarative** — The graph declares what exists and when; outputs are derived, never primary
- **Temporally rich** — Time is graph topology, supporting branches, loops, and retrocausality
- **Schema-flexible** — The type system is extensible for custom world rules
- **Format-agnostic** — Same world can produce tweets, prose, screenplays, comics, audio, or interactive experiences
- **Semantically grounded** — Built on OWL/RDFS, queryable with SPARQL, validated with SHACL

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

## Development Environment

The repository includes a [Dev Container](https://containers.dev/) configuration. Open the project in VS Code (or any Dev Container-compatible editor) and reopen in the container — all tooling is pre-installed. The only external dependency is **Docker**.

Validate all examples with:

```bash
python scripts/validate.py
```

## Quick Start

A minimal story is a `story.jsonld` with an inline world:

```jsonld
{
  "@context": "./context/sac.context.jsonld",
  "type": "Story",
  "id": "fairy-tale",
  "specVersion": "dev",
  "name": "A Simple Fairy Tale",
  "world": {
    "type": "World",
    "id": "world-layer",
    "nodes": [
      {
        "type": "Node",
        "id": "hero",
        "name": "The Hero",
        "nodeType": "CHARACTER",
        "properties": { "age": 18, "trait_courage": 0.8 },
        "hasTag": ["protagonist"]
      },
      {
        "type": "Node",
        "id": "village",
        "name": "The Village",
        "nodeType": "LOCATION"
      }
    ],
    "edges": [
      {
        "type": "Edge",
        "id": "hero-in-village",
        "edgeType": "SPATIAL",
        "source": "hero",
        "target": "village"
      }
    ],
    "frames": [
      {
        "type": "Frame",
        "id": "main",
        "name": "Main Timeline"
      }
    ]
  }
}
```

As projects grow, split nodes and edges into separate files and reference them by `@id`:

```jsonld
// story.jsonld
{
  "@context": "./context/sac.context.jsonld",
  "type": "Story",
  "id": "fairy-tale",
  "specVersion": "dev",
  "name": "A Simple Fairy Tale",
  "world": "world-layer"
}
```

```jsonld
// world/world.jsonld
{
  "@context": "../context/sac.context.jsonld",
  "type": "World",
  "id": "world-layer",
  "nodes": [
    { "@id": "hero" },
    { "@id": "village" }
  ],
  "edges": [
    { "@id": "hero-in-village" }
  ]
}
```

```jsonld
// world/characters/hero.jsonld
{
  "@context": "../../context/sac.context.jsonld",
  "type": "Node",
  "id": "hero",
  "name": "The Hero",
  "nodeType": "CHARACTER",
  "properties": { "age": 18 },
  "hasTag": ["protagonist"]
}
```

The spec does not prescribe a directory layout — inline definitions and `@id` references can be mixed freely, and file organisation is up to you and your tooling.

## Ontology & Validation

The spec ships three layers of machine-readable definitions:

| Layer | Format | Purpose |
|-------|--------|---------|
| **Context** (`context/`) | JSON-LD | Maps compact property names to semantic URIs |
| **Ontology** (`ontology/`) | OWL/RDFS Turtle | Declares classes and properties |
| **Shapes** (`shapes/`) | SHACL Turtle | Enforces structural constraints |

## Status

This specification is in **active development**. The core concepts are defined but subject to change. Feedback and contributions are welcome.
<!-- content-end -->

## Documentation

Read the full documentation at **[christopherscholz.github.io/story-as-code-spec](https://christopherscholz.github.io/story-as-code-spec/)**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to participate in the development of this specification.

## License

Apache License 2.0 — see [LICENSE](LICENSE).
