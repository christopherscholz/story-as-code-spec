# The Lighthouse Keeper's Secret

A minimal but complete world that demonstrates every schema type working as a cohesive whole.

**Synopsis** — Mara, a solitary lighthouse keeper, discovers a hidden sea cave exposed by a storm. Inside she finds a journal from a previous keeper. A mysterious stranger arrives — the daughter of the journal's author — and the lighthouse's past is revealed.

## File structure

```
examples/lighthouse-keepers-secret/
├── story.yaml              # entry point
├── derivation-meta.yaml    # compiled-output contract
├── characters/
│   ├── mara.yaml           # protagonist (lighthouse keeper)
│   ├── finn.yaml           # supporting (fisherman)
│   └── elara.yaml          # catalyst (mysterious stranger)
├── locations/
│   ├── lighthouse.yaml
│   ├── village.yaml
│   └── hidden-cave.yaml
├── objects/
│   └── old-journal.yaml
├── events/
│   ├── the-storm.yaml
│   ├── discovery.yaml
│   └── revelation.yaml
├── lenses/
│   ├── mara-pov.yaml       # 1st-person, character-bound
│   └── omniscient.yaml     # 3rd-person, retrospective
├── arcs/
│   └── main-arc.yaml       # 5 beats
└── formats/
    └── short-story.yaml    # book > chapters > scenes
```

## Entry point

The root `story.yaml` references external node files via `$ref` and defines edges, frames, and constraints inline — showing both composition styles:

```yaml
{% include "../../examples/lighthouse-keepers-secret/story.yaml" %}
```

## Nodes

### Characters with temporal states

Characters define `static` properties (name variants, category) and time-scoped `states`. Mara's state changes across time points and differs between frames:

```yaml
{% include "../../examples/lighthouse-keepers-secret/characters/mara.yaml" %}
```

Elara only exists in the main timeline (her state is scoped to `frame: main-timeline`):

```yaml
{% include "../../examples/lighthouse-keepers-secret/characters/elara.yaml" %}
```

### Locations with frame-dependent states

The hidden cave becomes accessible only after the storm — and only in the main timeline:

```yaml
{% include "../../examples/lighthouse-keepers-secret/locations/hidden-cave.yaml" %}
```

### Events with frame variants

The storm event has different states per frame. In the "what-if" timeline, it never happens:

```yaml
{% include "../../examples/lighthouse-keepers-secret/events/the-storm.yaml" %}
```

## Edges

All edges are defined inline in `story.yaml`. Key patterns demonstrated:

- **Undirected edges** — `cave-adjacent-lighthouse` uses `directed: false` because adjacency is symmetric
- **Unconditional edges** — `finn-at-village` has no `valid_in`, so it applies everywhere
- **Time-scoped edges** — `mara-finds-journal` is valid from Day 4 onward in the main timeline
- **Bounded edges** — `mara-fears-elara` is valid from Day 4 to Day 5 (the fear resolves)
- **Causal chains** — `mara-finds-journal` references `the-storm` as its cause; `mara-gives-journal` references `revelation` as its result

## Frames

Two frames demonstrate branching timelines:

- **`main-timeline`** — the canonical sequence of events
- **`what-if-no-storm`** — branches at Day 3; the storm never happens, Mara never discovers the cave

Nodes and edges use `frame` scoping to express what differs between timelines.

## Constraints

Two constraint severities are shown:

- **`single-location`** (`ERROR`) — characters can only be in one place at a time
- **`journal-possession`** (`WARNING`) — the journal should always have a holder

## Lenses

### Character-bound first person

Mara's POV lens restricts knowledge to what she knows, includes emotional bias, and uses a literary voice with verbal tics:

```yaml
{% include "../../examples/lighthouse-keepers-secret/lenses/mara-pov.yaml" %}
```

### Omniscient retrospective

A third-person narrator looking back from Day 7, with full knowledge and high metaphor density:

```yaml
{% include "../../examples/lighthouse-keepers-secret/lenses/omniscient.yaml" %}
```

## Arc

The main arc selects the nodes and edges that belong to this storyline and structures them into five beats — from isolation to revelation:

```yaml
{% include "../../examples/lighthouse-keepers-secret/arcs/main-arc.yaml" %}
```

## Format

A literary short story format with a recursive structure (book → chapters → scenes) and pacing rules:

```yaml
{% include "../../examples/lighthouse-keepers-secret/formats/short-story.yaml" %}
```

## Derivation meta

The output contract ties a lens and format together and declares which graph elements the compiled output depends on:

```yaml
{% include "../../examples/lighthouse-keepers-secret/derivation-meta.yaml" %}
```
