# Node Schema

Defines the structure of node files. The `type` field is free-form; type-specific constraints are applied by tooling via type masks.

## Temporal States

Node states are optional and express how a node changes over time and across frames:

- **No `frame` or `at`** — the state applies everywhere (all frames, all times)
- **Only `at`** — applies at that time point in all frames
- **`frame` + `at`** — applies only in the specified frame at that time point

```yaml
nodes:
  - id: hero
    type: CHARACTER
    static: { name_variants: ["Aria"] }
    states:
      - properties: { mood: happy }                          # always, everywhere
      - at: "T5"
        properties: { mood: determined }                     # at T5, all frames
      - frame: alt-timeline
        at: "T5"
        properties: { mood: fearful }                        # at T5, only in alt-timeline
```

## Schema Definition

```yaml
{% include "../../schemas/node.schema.yaml" %}
```
