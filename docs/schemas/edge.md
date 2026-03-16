# Edge Schema

Defines the structure of edge files (relationships between nodes).

## Directionality

By default, edges are **directed** — they go from `source` to `target`. Set `directed: false` for symmetric relationships where direction is meaningless (adjacency, friendship, kinship, mutual knowledge):

```yaml
edges:
  - id: cave-adjacent-lighthouse
    type: SPATIAL
    subtype: ADJACENT_TO
    source: hidden-cave
    target: lighthouse
    directed: false  # symmetric — traversable in both directions
```

When `directed` is omitted or `true`, the edge is one-way from `source` to `target`. Tooling treats undirected edges as bidirectional during graph traversal — a single edge replaces what would otherwise require two mirrored directed edges.

## Temporal Validity

The `valid_in` field is optional. When omitted, the edge is valid everywhere (all frames, all times). Within each temporal scope entry:

- **No `frame`** — applies to all frames
- **No `from`/`to`** — applies from the beginning / ongoing

```yaml
edges:
  - id: hero-loves-companion
    type: RELATIONSHIP
    subtype: LOVES
    source: hero
    target: companion
    # no valid_in → always valid, all frames

  - id: hero-visits-dungeon
    type: SPATIAL
    source: hero
    target: dungeon
    valid_in:
      - from: "T10"
        to: "T15"            # valid T10-T15 in all frames

  - id: hero-has-sword
    type: SPATIAL
    source: hero
    target: magic-sword
    valid_in:
      - frame: alt-timeline
        from: "T5"           # only in alt-timeline from T5 onwards
```

## Schema Definition

```yaml
{% include "../../schemas/edge.schema.yaml" %}
```
