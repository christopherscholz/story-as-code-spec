# Frame Schema

Defines alternative timelines and branches within a world. Frames form a **frame graph** via `parent` references and `relations`.

## Key Concepts

- An **implicit default frame** always exists and does not need to be defined.
- If no `frame` is specified on a node state or edge, it applies to **all frames**.
- Frames can relate to each other via `parent` (branching hierarchy) and `relations` (arbitrary graph edges like `BRANCHES_INTO`, `MERGES_WITH`, `LOOPS_BACK`).
- Custom metadata (e.g., `loop_count`, `observer`) can be stored in `properties`.

## Example

```yaml
frames:
  - id: main
    name: "Main Timeline"

  - id: alt-timeline
    name: "What if the hero refused?"
    parent: main
    branches_at: "T42"
    relations:
      - target: main
        type: BRANCHES_INTO
        at: "T42"
        description: "Hero refuses the call"

  - id: time-loop
    name: "Groundhog Day Loop"
    parent: main
    relations:
      - target: main
        type: LOOPS_BACK
        at: "T100"
    properties:
      loop_count: 3
      observer: char-hero
```

## Schema Definition

```yaml
{% include "../../schemas/frame.schema.yaml" %}
```
