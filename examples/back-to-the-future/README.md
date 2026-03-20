# Back to the Future

A complete example project for the **Story as Code** specification, based on Robert Zemeckis's 1985 film *Back to the Future* (written by Robert Zemeckis and Bob Gale, produced by Steven Spielberg). All story elements, characters, and plot points are the intellectual property of their respective creators. This example is provided solely to demonstrate the spec.

## Synopsis

Teenager Marty McFly is accidentally sent thirty years into the past in a time-traveling DeLorean built by his eccentric friend Dr. Emmett Brown. Stranded in 1955 without fuel, Marty disrupts his parents' first meeting and must engineer their romance at the Enchantment Under the Sea dance — or he will cease to exist. With the help of the younger Doc Brown, he harnesses a lightning strike to power the DeLorean and returns to a 1985 transformed by his father's newfound courage.

## What this example demonstrates

| Spec concept       | Files                                                   |
| ------------------ | ------------------------------------------------------- |
| Entry point        | `story.yaml`                                            |
| Definitions        | `definitions/` — tags and types as individual files     |
| Time system        | Linear earth calendar (in `world/world.yaml`)           |
| **Frames**         | **3 timelines: Original 1985, 1955 Adventure, Improved 1985** — branching topology with `branches_at` |
| Nodes – Characters | `world/characters/` — Marty, Doc Brown, George, Lorraine, Biff, Jennifer |
| Nodes – Locations  | `world/locations/` — Hill Valley (1985 & 1955), Twin Pines Mall, Doc's Lab, High School, Clock Tower |
| Nodes – Objects    | `world/objects/` — DeLorean, Flux Capacitor, Family Photo, Clock Tower Flyer, Guitar |
| Nodes – Events     | `world/events/` — time machine test, Libyan attack, arrival in 1955, dance, George punches Biff, lightning strike, return |
| Edges              | `world/edges/` — kinship, relationships, conflict, spatial, participation, occurrence |
| **Temporal scopes** | Edges with frame and time scopes (e.g., Lorraine's infatuation scoped to 1955 frame) |
| Constraints        | Paradox prevention rule (in `world/world.yaml`)         |
| Lenses             | `narrative/lenses/` — Marty POV (3rd-person limited, colloquial voice) |
| Beats              | `narrative/beats/` — 7-beat three-act structure with dramaturgical functions |
| Devices            | `narrative/devices/` — photo fading (Chekhov's gun), clock tower flyer (setup/payoff), bulletproof vest (setup/payoff), Darth Vader scene (dramatic irony) |
| Threads            | `narrative/threads/` — temporal paradox, courage & destiny, clocks motif |
| Format             | `narrative/formats/screenplay.yaml` — three-act screenplay structure |
| Variants           | CANON variant metadata                                  |
| Derivation meta    | `derivation-meta.yaml` — source attribution             |

## File tree

```
back-to-the-future/
├── story.yaml                 # entry point
├── derivation-meta.yaml       # source attribution
├── definitions/
│   ├── definitions.yaml       # tag & type index
│   ├── tags/                  # 15 tag files
│   └── types/                 # 17 type files
├── world/
│   ├── world.yaml             # time system, frames, constraints
│   ├── characters/
│   │   ├── marty.yaml
│   │   ├── doc-brown.yaml
│   │   ├── george.yaml
│   │   ├── lorraine.yaml
│   │   ├── biff.yaml
│   │   └── jennifer.yaml
│   ├── locations/
│   │   ├── hill-valley-1985.yaml
│   │   ├── hill-valley-1955.yaml
│   │   ├── twin-pines-mall.yaml
│   │   ├── docs-lab.yaml
│   │   ├── hill-valley-high.yaml
│   │   └── clock-tower.yaml
│   ├── objects/
│   │   ├── delorean.yaml
│   │   ├── flux-capacitor.yaml
│   │   ├── photo.yaml
│   │   ├── clock-tower-flyer.yaml
│   │   └── guitar.yaml
│   ├── events/
│   │   ├── time-machine-test.yaml
│   │   ├── libyan-attack.yaml
│   │   ├── arrival-1955.yaml
│   │   ├── marty-hit-by-car.yaml
│   │   ├── marty-meets-doc-1955.yaml
│   │   ├── skateboard-chase.yaml
│   │   ├── enchantment-dance.yaml
│   │   ├── george-punches-biff.yaml
│   │   ├── lightning-strike.yaml
│   │   └── return-to-1985.yaml
│   └── edges/                 # 48 edge files
└── narrative/
    ├── narrative.yaml
    ├── lenses/
    │   └── marty-pov.yaml
    ├── beats/
    │   ├── main-storyline.yaml
    │   ├── setup-1985.yaml
    │   ├── the-test.yaml
    │   ├── stranded-in-1955.yaml
    │   ├── the-plan.yaml
    │   ├── matchmaking.yaml
    │   ├── the-dance.yaml
    │   └── the-return.yaml
    ├── devices/
    │   ├── photo-fading.yaml
    │   ├── clock-tower-flyer-device.yaml
    │   ├── bulletproof-vest.yaml
    │   └── marty-as-darth-vader.yaml
    ├── threads/
    │   ├── temporal-paradox.yaml
    │   ├── courage-and-destiny.yaml
    │   └── clock-motif.yaml
    └── formats/
        └── screenplay.yaml
```
