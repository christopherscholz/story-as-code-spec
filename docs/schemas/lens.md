# Lens Schema

Defines the structure of lens (narrative perspective) files.

## Composition Rules

Composite lenses (`type: COMPOSITE`) combine multiple sub-lenses via **layering** or **alternation**. The `composition` block controls how conflicts between sub-lenses are resolved.

| Dimension | Options | Default |
|---|---|---|
| `knowledge` | `UNION`, `INTERSECTION`, `PRIORITY_WINS` | `PRIORITY_WINS` |
| `emotion` | `BLEND`, `PRIORITY_WINS`, `DOMINANT` | `BLEND` |
| `voice` | `PRIORITY_WINS`, `ALTERNATING` | `PRIORITY_WINS` |
| `reliability` | `LEAST_RELIABLE`, `MOST_RELIABLE`, `PRIORITY_WINS` | `PRIORITY_WINS` |

Each layer can declare a `priority` (higher wins). When `PRIORITY_WINS` is selected for a dimension, the sub-lens with the highest priority value determines the outcome for that dimension.

## Schema Definition

```yaml
{% include "../../schemas/lens.schema.yaml" %}
```
