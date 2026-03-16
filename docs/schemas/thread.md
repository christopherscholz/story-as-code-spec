# Thread Schema

A thread represents a **thematic connection running across the beat hierarchy** — the horizontal counterpart to the vertical parent/child beat structure.

While `parent` groups beats within a single storyline (vertical chaining), threads connect beats from **different storylines** through shared thematic meaning (horizontal chaining).

Threads are part of the narrative layer and **define no own truth**.

## Thread Types

| Type | Description |
|------|-------------|
| `THEME` | An abstract idea (e.g. "love conquers death", "choice vs. destiny") |
| `MOTIF` | A recurring symbolic element (e.g. "mirror imagery", "the number three") |

## Example

```yaml
id: isolation-and-connection
type: THEME
name: "Isolation vs. Connection"
description: "The tension between solitude and the need for human connection."

appearances:
  - beat_id: isolation
    description: "Mara's daily solitude — isolation as comfort"
  - beat_id: stranger-arrives
    description: "Elara's arrival — connection as threat"
  - beat_id: truth-revealed
    description: "Trust replaces fear — connection as resolution"
```

## Schema Definition

```yaml
{% include "../../schemas/thread.schema.yaml" %}
```
