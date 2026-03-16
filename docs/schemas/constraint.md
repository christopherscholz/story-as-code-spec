# Constraint Schema

Defines world rules and validation constraints.

## Scope + Rule

A constraint has two parts:

- **`scope`** — *what* the rule applies to (filter by types, tags, frames, time range)
- **`rule`** — the **assertion** that must hold for every matched element

Without a `scope`, the rule applies globally to all elements.

```yaml
constraints:
  # Global — all characters must have at least one relationship
  - id: no-orphan-characters
    name: "Characters must have at least one relationship"
    rule: "COUNT(edges) >= 1"
    severity: WARNING
    scope:
      node_types: [CHARACTER]

  # Nur magic-getaggte Nodes im main-Frame
  - id: magic-limit
    name: "Magic users can hold at most 3 spells"
    rule: "COUNT(edges(type='POSSESSES', target.type='SPELL')) <= 3"
    severity: ERROR
    scope:
      tags: [magic]
      frames: [main]

  # Zeitlich begrenzte Regel
  - id: no-undead-before-war
    name: "Undead cannot exist before the Great War"
    rule: "properties.race != 'undead'"
    severity: ERROR
    scope:
      node_types: [CHARACTER]
      time_range:
        to: "T50"
```

## Schema Reference

{%
  include-markdown "./generated/constraint.md"
%}
