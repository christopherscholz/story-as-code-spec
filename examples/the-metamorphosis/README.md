# The Metamorphosis

A complete example project for the **Story as Code** specification (v0.4.0), based on Franz Kafka's novella.

## Synopsis

Gregor Samsa, a traveling salesman, wakes one morning to find himself transformed into a monstrous insect. As his family grapples with his condition — first with reluctant care, then growing resentment — Gregor's humanity erodes alongside his body. After months of confinement, his sister Grete declares "it has to go." Gregor dies alone in the night, and the family, relieved, takes a spring outing to plan their future.

## What this example demonstrates

| Spec concept       | Files                                                   |
| ------------------ | ------------------------------------------------------- |
| Entry point        | `story.yaml`                                            |
| Time system        | Linear day-based calendar (in `story.yaml`)             |
| Nodes – Characters | `characters/gregor.yaml`, `grete.yaml`, `father.yaml`, `mother.yaml`, `chief-clerk.yaml` |
| Nodes – Locations  | `locations/gregors-room.yaml`, `apartment.yaml`         |
| Nodes – Objects    | `objects/picture-frame.yaml`                            |
| Nodes – Events     | `events/transformation.yaml`, `chief-clerk-visit.yaml`, `apple-attack.yaml`, `gregors-death.yaml` |
| Edges              | Inline in `story.yaml` — spatial, relationships, actions, knowledge |
| Frames             | Single canonical timeline                               |
| Constraints        | Gregor-confinement rule, single-location rule            |
| Lenses             | `lenses/gregor-pov.yaml` (3rd-person limited), `lenses/detached-observer.yaml` (3rd-person objective) |
| Beats              | `beats/` — hierarchical storyline with dramaturgical functions |
| Devices            | `devices/` — picture setup/payoff, apple as Chekhov's gun |
| Threads            | `threads/` — "Dehumanization and Alienation" theme      |
| Format             | `formats/novella.yaml` — novella structure (3 parts)    |
| Variants           | CANON variant metadata                                  |
| Derivation meta    | `derivation-meta.yaml` — compiled-output contract       |

## File tree

```
the-metamorphosis/
├── story.yaml                 # entry point
├── derivation-meta.yaml       # output contract
├── characters/
│   ├── gregor.yaml
│   ├── grete.yaml
│   ├── father.yaml
│   ├── mother.yaml
│   └── chief-clerk.yaml
├── locations/
│   ├── gregors-room.yaml
│   └── apartment.yaml
├── objects/
│   └── picture-frame.yaml
├── events/
│   ├── transformation.yaml
│   ├── chief-clerk-visit.yaml
│   ├── apple-attack.yaml
│   └── gregors-death.yaml
├── lenses/
│   ├── gregor-pov.yaml
│   └── detached-observer.yaml
├── beats/
│   ├── main-storyline.yaml
│   ├── awakening.yaml
│   ├── failed-emergence.yaml
│   ├── uneasy-coexistence.yaml
│   ├── the-attack.yaml
│   └── final-rejection.yaml
├── devices/
│   ├── picture-setup-payoff.yaml
│   └── apple-chekhov.yaml
├── threads/
│   └── dehumanization.yaml
└── formats/
    └── novella.yaml
```
