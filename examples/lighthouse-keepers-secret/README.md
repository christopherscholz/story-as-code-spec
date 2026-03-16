# The Lighthouse Keeper's Secret

A complete example project for the **Story as Code** specification (v0.4.0).

## Synopsis

Mara, a solitary lighthouse keeper, discovers a hidden sea cave exposed by a violent storm. Inside she finds a water-damaged journal from a previous keeper describing strange lights. A mysterious stranger named Elara arrives — the daughter of the journal's author — and the truth of the lighthouse's past is finally revealed.

## What this example demonstrates

| Spec concept       | Files                                                   |
| ------------------ | ------------------------------------------------------- |
| Entry point        | `story.yaml`                                            |
| Time system        | Linear day-based calendar (in `story.yaml`)             |
| Nodes – Characters | `characters/mara.yaml`, `finn.yaml`, `elara.yaml`      |
| Nodes – Locations  | `locations/lighthouse.yaml`, `village.yaml`, `hidden-cave.yaml` |
| Nodes – Objects    | `objects/old-journal.yaml`                              |
| Nodes – Events     | `events/the-storm.yaml`, `discovery.yaml`, `revelation.yaml` |
| Edges              | Inline in `story.yaml` — spatial, relationships, actions, knowledge |
| Frames             | Two frames: canonical timeline + "what-if" branch       |
| Constraints        | Single-location rule, journal-possession rule           |
| Lenses             | `lenses/mara-pov.yaml` (1st-person), `lenses/omniscient.yaml` (3rd-person) |
| Beats              | `beats/` — hierarchical storyline with dramaturgical functions |
| Devices            | `devices/` — setup/payoff, red herring                  |
| Threads            | `threads/` — "Isolation vs. Connection" theme           |
| Format             | `formats/short-story.yaml` — literary short story structure |
| Variants           | CANON + SPECULATIVE variant metadata                    |
| Derivation meta    | `derivation-meta.yaml` — compiled-output contract       |

## File tree

```
lighthouse-keepers-secret/
├── story.yaml                 # entry point
├── derivation-meta.yaml       # output contract
├── characters/
│   ├── mara.yaml
│   ├── finn.yaml
│   └── elara.yaml
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
│   ├── mara-pov.yaml
│   └── omniscient.yaml
├── beats/
│   ├── main-storyline.yaml
│   ├── isolation.yaml
│   ├── storm-hits.yaml
│   ├── cave-found.yaml
│   ├── stranger-arrives.yaml
│   └── truth-revealed.yaml
├── devices/
│   ├── journal-setup-payoff.yaml
│   └── elara-red-herring.yaml
├── threads/
│   └── isolation-and-connection.yaml
└── formats/
    └── short-story.yaml
```
