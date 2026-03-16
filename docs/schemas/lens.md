# Lens Schema

A lens defines the **narrative perspective** — it controls who tells the story, what they know, how they speak, and how reliable they are. Lenses filter and interpret world content but **define no own truth**. All facts remain in the world layer.

## Composition Rules

Composite lenses (`type: COMPOSITE`) combine multiple sub-lenses via **layering** or **alternation**. The `composition` block controls how conflicts between sub-lenses are resolved.

| Dimension | Options | Default |
|---|---|---|
| `knowledge` | `UNION`, `INTERSECTION`, `PRIORITY_WINS` | `PRIORITY_WINS` |
| `emotion` | `BLEND`, `PRIORITY_WINS`, `DOMINANT` | `BLEND` |
| `voice` | `PRIORITY_WINS`, `ALTERNATING` | `PRIORITY_WINS` |
| `reliability` | `LEAST_RELIABLE`, `MOST_RELIABLE`, `PRIORITY_WINS` | `PRIORITY_WINS` |

Each layer can declare a `priority` (higher wins). When `PRIORITY_WINS` is selected for a dimension, the sub-lens with the highest priority value determines the outcome for that dimension.

## Schema Reference

{%
  include-markdown "./generated/lens.md"
%}
