# The Metamorphosis

A complete example project for the **Story as Code** specification, based on Franz Kafka's 1915 novella *Die Verwandlung* (*The Metamorphosis*). All story elements and characters originate from Kafka's work. This example is provided solely to demonstrate the spec.

## Synopsis

Gregor Samsa, a traveling salesman, wakes one morning to find himself transformed into a monstrous insect. As his family grapples with his condition — first with reluctant care, then growing resentment — Gregor's humanity erodes alongside his body. After months of confinement, his sister Grete declares "it has to go." Gregor dies alone in the night, and the family, relieved, takes a spring outing to plan their future.

## What this example demonstrates

| Spec concept       | Files                                                   |
| ------------------ | ------------------------------------------------------- |
| Entry point        | `story.yaml`                                            |
| Definitions        | `definitions/` — tags and types as individual files     |
| Time system        | Linear day-based calendar (in `world/world.yaml`)       |
| Nodes – Characters | `world/characters/` — Gregor, Grete, Father, Mother, Chief Clerk, Charwoman, Lodgers |
| Nodes – Locations  | `world/locations/` — Gregor's room, the apartment       |
| Nodes – Objects    | `world/objects/` — picture frame, violin, embedded apple |
| Nodes – Events     | `world/events/` — transformation, clerk visit, furniture removal, apple attack, violin recital, death |
| Edges              | `world/edges/` — spatial, relationships, knowledge      |
| Constraints        | Single-location rule (in `world/world.yaml`)            |
| Lenses             | `narrative/lenses/` — gregor-pov (3rd-person limited), detached-observer (3rd-person objective) |
| Beats              | `narrative/beats/` — hierarchical storyline with dramaturgical functions |
| Devices            | `narrative/devices/` — picture setup/payoff, apple Chekhov's gun, violin setup/payoff |
| Threads            | `narrative/threads/` — dehumanization, family role reversal |
| Format             | `narrative/formats/novella.yaml` — novella structure (3 parts) |
| Variants           | CANON variant metadata                                  |
| Derivation meta    | `derivation-meta.yaml` — compiled-output contract       |

## File tree

```
the-metamorphosis/
├── story.yaml                 # entry point
├── derivation-meta.yaml       # output contract
├── definitions/
│   ├── definitions.yaml       # tag & type index
│   ├── tags/
│   │   ├── protagonist.yaml
│   │   ├── antagonist.yaml
│   │   ├── supporting.yaml
│   │   ├── ...                # 35 tag files total
│   │   └── resolution.yaml
│   └── types/
│       ├── character.yaml
│       ├── location.yaml
│       ├── ...                # 15 type files total
│       └── motif.yaml
├── world/
│   ├── world.yaml             # time system, node/edge refs, constraints
│   ├── characters/
│   │   ├── gregor.yaml
│   │   ├── grete.yaml
│   │   ├── father.yaml
│   │   ├── mother.yaml
│   │   ├── chief-clerk.yaml
│   │   ├── charwoman.yaml
│   │   └── lodgers.yaml
│   ├── locations/
│   │   ├── gregors-room.yaml
│   │   ├── apartment.yaml
│   │   └── living-room.yaml
│   ├── objects/
│   │   ├── picture-frame.yaml
│   │   ├── violin.yaml
│   │   ├── apple.yaml
│   │   └── fathers-uniform.yaml
│   ├── events/
│   │   ├── transformation.yaml
│   │   ├── chief-clerk-visit.yaml
│   │   ├── furniture-removal.yaml
│   │   ├── apple-attack.yaml
│   │   ├── violin-recital.yaml
│   │   ├── gretes-ultimatum.yaml
│   │   └── gregors-death.yaml
│   └── edges/
│       ├── gregor-confined-to-room.yaml
│       ├── grete-cares-for-gregor.yaml
│       ├── ...                # 18 edge files total
│       └── family-knows-transformation.yaml
└── narrative/
    ├── narrative.yaml          # lens/beat/device/thread/format refs, variants
    ├── lenses/
    │   ├── gregor-pov.yaml
    │   └── detached-observer.yaml
    ├── beats/
    │   ├── main-storyline.yaml
    │   ├── awakening.yaml
    │   ├── failed-emergence.yaml
    │   ├── uneasy-coexistence.yaml
    │   ├── the-attack.yaml
    │   ├── the-decline.yaml
    │   └── final-rejection.yaml
    ├── devices/
    │   ├── picture-setup-payoff.yaml
    │   ├── apple-chekhov.yaml
    │   └── violin-setup-payoff.yaml
    ├── threads/
    │   ├── dehumanization.yaml
    │   ├── role-reversal.yaml
    │   └── doors-and-barriers.yaml
    └── formats/
        └── novella.yaml
```
