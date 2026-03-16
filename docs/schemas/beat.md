# Beat Schema

A story beat is the **fundamental narrative building block**. Beats select world graph elements and add dramaturgical structure. They replace the former "arc" concept by being hierarchical: a top-level beat (without `parent`) acts as a storyline container, while child beats represent individual story moments.

Beats are part of the narrative layer and **define no own truth**. They only reference elements from the world layer.

## Vertical vs. Horizontal Chaining

- **Vertical chaining** via `parent` — groups beats within a storyline hierarchy (main plot > subplots > scenes)
- **Horizontal chaining** via [threads](thread.md) — connects beats from different storylines through shared thematic meaning

## Dramaturgical Properties

Beats can carry dramaturgical metadata that describes **how** the story is told:

- **`function`** — the beat's role in the dramatic structure (HOOK, INCITING_INCIDENT, CLIMAX, etc.)
- **`reveals`** — what information is disclosed to the reader at this point
- **`tension`** — position on the tension curve (0.0–1.0)
- **`emotional_target`** — target emotional valence (-1.0–1.0)
- **`transition`** — how this beat connects to the next (CUT, CLIFFHANGER, TIME_SKIP, etc.)

All dramaturgical properties are optional. A beat with only `id`, `name`, and world references is valid.

## Example

```yaml
# Top-level beat (storyline container)
id: main-storyline
name: "The Hero's Journey"
node_ids: [hero, mentor, villain, kingdom]
edge_ids: [hero-meets-mentor, hero-defeats-villain]

# Child beat
id: the-call
name: "The Call to Adventure"
parent: main-storyline
order: 1
node_ids: [hero, mentor]
edge_ids: [hero-meets-mentor]
function: INCITING_INCIDENT
tension: 0.4
reveals:
  - target: mentor
    degree: PARTIAL
transition:
  type: CLIFFHANGER
```

## Schema Definition

```yaml
{% include "../../schemas/beat.schema.yaml" %}
```
