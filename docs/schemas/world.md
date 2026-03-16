# World Schema

The world schema defines the **world layer** of a Story as Code project. It contains the graph structure: nodes, edges, frames, constraints, and the time system.

The world is a sub-object of the root [Story](story.md) document.

## Implicit Default Frame

A world always has an **implicit default frame** that does not need to be defined. If no `frames` are specified, all temporal data belongs to the default frame. When a node state or edge omits the `frame` field, it applies to **all frames** (including the default).

## Schema Definition

```yaml
{% include "../../schemas/world.schema.yaml" %}
```
