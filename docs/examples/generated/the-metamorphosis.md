# The Metamorphosis

A complete example project for the **Story as Code** specification (v0.4.0), based on Franz Kafka's novella.

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
## Root Files

??? example "`story.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../schemas/story.schema.json
    spec_version: "dev"
    name: "The Metamorphosis"

    settings:
      default_language: en

    definitions:
      $ref: "./definitions/definitions.yaml"

    world:
      $ref: "./world/world.yaml"

    narrative:
      $ref: "./narrative/narrative.yaml"
    ```

??? example "`derivation-meta.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../schemas/derivation-meta.schema.json
    id: novella-gregor-pov
    lens: gregor-pov
    format: novella
    source_version: "0.5.0"

    beat_position:
      beat: final-rejection

    dependencies:
      nodes:
        - id: gregor
          must_exist: true
        - id: grete
          must_exist: true
        - id: father
          must_exist: true
        - id: mother
          must_exist: true
        - id: gregors-room
          must_exist: true
        - id: picture-frame
          must_exist: true

      edges:
        - id: gregor-confined-to-room
          must_exist: true
        - id: grete-cares-for-gregor
          must_exist: true
        - id: grete-rejects-gregor
          must_exist: true

      reveals:
        - node: gregor
          revealed_to: father
          at: "Day 1"
        - node: picture-frame
          revealed_to: gregor
          at: "Month 1"
    ```

## Definitions

??? example "`definitions/definitions.yaml` (excerpt)"

    ```yaml
    # yaml-language-server: $schema=../../../schemas/definitions/definitions.schema.json
    tags:
      - $ref: "./tags/protagonist.yaml"
      - $ref: "./tags/antagonist.yaml"
      # ... 35 tag files total

    types:
      - $ref: "./types/character.yaml"
      - $ref: "./types/spatial.yaml"
      # ... 15 type files total
    ```

??? example "`definitions/tags/protagonist.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/definitions/tag.schema.json
    id: protagonist
    name: Protagonist
    description: "The central character whose inner life drives the narrative."
    ```

??? example "`definitions/types/character.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/definitions/type.schema.json
    id: CHARACTER
    name: Character
    applies_to: NODE
    description: "A sentient being — human or transformed — that acts, speaks, or is acted upon."
    ```

??? example "`definitions/types/spatial.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/definitions/type.schema.json
    id: SPATIAL
    name: Spatial Relationship
    applies_to: EDGE
    description: "A spatial or containment relationship (located-in, part-of, confined-to, embedded-in)."
    ```

## World

??? example "`world/world.yaml` (excerpt)"

    ```yaml
    # yaml-language-server: $schema=../../../schemas/world/world.schema.json
    time_system:
      id: samsa-timeline
      name: "Samsa Household Calendar"
      type: LINEAR
      calendar:
        unit: day
        season: winter

    nodes:
      - $ref: "./characters/gregor.yaml"
      - $ref: "./locations/gregors-room.yaml"
      - $ref: "./objects/picture-frame.yaml"
      - $ref: "./events/transformation.yaml"
      # ... 21 node files total

    edges:
      - $ref: "./edges/gregor-confined-to-room.yaml"
      - $ref: "./edges/grete-cares-for-gregor.yaml"
      # ... 18 edge files total

    constraints:
      - id: single-location
        name: "A character can only be in one place at a time"
        rule: >
          A character can only occupy one location at any given time.
        severity: ERROR
        scope:
          node_types: [CHARACTER]
    ```

### Characters

??? example "`charwoman.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: charwoman
    name: "The Charwoman"
    type: CHARACTER
    description: >
      An elderly cleaning woman hired by the family after their previous cook leaves in
      disgust. Unlike the rest of the household, she is neither horrified nor sentimental
      about Gregor — she addresses him casually as "old dung beetle" and is the only person
      who opens his door without fear. She discovers his body in the morning and announces
      his death to the family with matter-of-fact cheerfulness. She disposes of the remains.
    properties:
      age: 60
    tags: [outsider, pragmatic]
    ```

??? example "`chief-clerk.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: chief-clerk
    name: "The Chief Clerk"
    type: CHARACTER
    description: >
      Gregor's office supervisor who arrives at the apartment when Gregor fails to catch his
      morning train. His visit escalates the crisis: he threatens Gregor's job through the
      locked door, and when Gregor finally emerges in his insect form, the clerk flees without
      a word. He is the outside world's sole witness to the transformation, and his departure
      seals the family's isolation.
    properties:
      name_variants: ["the office manager"]
      role: supervisor
    tags: [outsider, authority]
    ```

??? example "`father.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: father
    name: "Mr. Samsa"
    type: CHARACTER
    description: >
      The Samsa patriarch who had sunk into lethargy after his business failure, relying entirely
      on Gregor's income. The transformation forces him back to work as a bank messenger, and
      with his new uniform comes a renewed sense of authority. He is the most overtly hostile
      family member, twice driving Gregor back into his room by force — the second time
      bombarding him with apples, one of which lodges in his back and never heals.
    properties:
      name_variants: ["the father", "Father"]
      age: 55
    tags: [family, authority]
    ```

??? example "`gregor.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: gregor
    name: "Gregor Samsa"
    type: CHARACTER
    description: >
      A dutiful traveling salesman who has sacrificed his own desires to pay off his parents' debts.
      One morning he wakes transformed into a monstrous insect. Unable to work or communicate,
      he is confined to his room and watches helplessly as his family's initial shock gives way to
      resentment. His mind remains human even as his body and habits become increasingly alien,
      and he dies quietly after accepting that he is no longer wanted.
    properties:
      name_variants: ["Gregor", "the insect", "the vermin"]
      age: 29
      occupation: traveling-salesman
    tags: [protagonist, pov-character, transformed]
    ```

??? example "`grete.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: grete
    name: "Grete Samsa"
    type: CHARACTER
    description: >
      Gregor's seventeen-year-old sister and the only family member willing to enter his room
      after the transformation. She feeds him, cleans his space, and learns his new preferences.
      Over time, the burden of care and the family's financial pressure erode her compassion.
      By the story's end she has stopped using Gregor's name, referring to him only as "it,"
      and delivers the ultimatum that he must go.
    properties:
      name_variants: ["Grete", "Gregor's sister", "the sister"]
      age: 17
    tags: [family, caretaker]
    ```

??? example "`lodgers.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: lodgers
    name: "The Three Lodgers"
    type: CHARACTER
    description: >
      Three bearded gentlemen who rent a room in the Samsa apartment to supplement the
      family's income after Gregor can no longer work. They are fastidious, demanding, and
      authoritative — they effectively take over the living room and dictate household
      standards. When they discover Gregor during Grete's violin recital, they threaten to
      leave without paying and declare the apartment unsanitary. Their presence marks the
      family's final humiliation and triggers Grete's ultimatum.
    tags: [outsider, authority, group]
    ```

??? example "`mother.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: mother
    name: "Mrs. Samsa"
    type: CHARACTER
    description: >
      Gregor's asthmatic mother who is torn between maternal love and visceral horror at his new
      form. She wants to help but faints at the sight of him, and her husband and daughter
      increasingly shield her from contact with Gregor. She represents the family's passive
      grief — neither actively cruel nor able to intervene on Gregor's behalf.
    properties:
      name_variants: ["the mother", "Mother"]
      age: 50
      health: asthmatic
    tags: [family, sympathetic]
    ```

### Locations

??? example "`apartment.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: apartment
    name: "The Samsa Apartment"
    type: LOCATION
    description: >
      The modest Samsa family flat, chosen originally because Gregor's salary could cover the
      rent. The living room, kitchen, and hallway form the family's domain from which Gregor
      is excluded. As the family takes in lodgers for extra income, even this shared space
      contracts — the apartment itself becomes a measure of the family's shrinking world.
    properties:
      name_variants: ["the flat", "the living room"]
    tags: [domestic, family-space]
    ```

??? example "`gregors-room.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: gregors-room
    name: "Gregor's Room"
    type: LOCATION
    description: >
      Gregor's bedroom, originally furnished with a desk, wardrobe, and the picture he
      framed himself. After the transformation it becomes his permanent confinement.
      Grete and Mother remove the furniture to give him crawling space, but the emptying
      also strips away his human markers. By the final months the room is used as a
      dumping ground for household junk, mirroring Gregor's own decline into irrelevance.
    properties:
      name_variants: ["the room", "his room"]
    tags: [domestic, confinement]
    ```

### Objects

??? example "`apple.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: apple
    name: "The Embedded Apple"
    type: OBJECT
    description: >
      An apple thrown by Father that lodges in Gregor's back during the attack. It is never
      removed and rots in place over the following weeks, becoming a festering wound that
      accelerates Gregor's physical decline. The family eventually grows so accustomed to it
      that they forget it is there. It serves as a permanent, visible marker of the family's
      violence — a wound carried by the victim while the perpetrators move on.
    properties:
      is_unique: true
    tags: [symbol, violence, decay]
    ```

??? example "`picture-frame.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: picture-frame
    name: "The Framed Picture"
    type: OBJECT
    description: >
      A magazine clipping of a woman in furs that Gregor laboriously cut out and placed in a
      gilded frame. When Grete and Mother begin removing the furniture from his room, Gregor
      throws himself onto the picture to prevent its removal — the one object he fights to
      keep. It functions as the last tangible link to his human identity and desires.
    properties:
      name_variants: ["the picture", "the magazine clipping"]
      is_unique: true
    tags: [symbol, humanity]
    ```

??? example "`violin.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: violin
    name: "Grete's Violin"
    type: OBJECT
    description: >
      Grete's violin, which she plays with increasing skill over the course of the story.
      Gregor had secretly planned to announce at Christmas that he would fund her
      conservatory studies — a plan destroyed by the transformation. In the final part,
      Grete plays for the lodgers; Gregor, drawn by the music, crawls out of his room.
      This moment — where music briefly reconnects him to his human longings — directly
      triggers the lodgers' discovery and Grete's ultimatum that ends Gregor's life.
    properties:
      is_unique: true
    tags: [symbol, humanity, catalyst]
    ```

### Edges

??? example "`gregor-confined-to-room.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/edge.schema.json
    id: gregor-confined-to-room
    type: SPATIAL
    name: confined-to
    source: gregor
    target: gregors-room
    ```

??? example "`grete-cares-for-gregor.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/edge.schema.json
    id: grete-cares-for-gregor
    type: RELATIONSHIP
    name: caretakes
    source: grete
    target: gregor
    valid_in:
      - to: "Month 3"
    weight: 0.8
    properties:
      motivation: guilt-and-duty
    ```

??? example "`apple-embedded-in-gregor.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/edge.schema.json
    id: apple-embedded-in-gregor
    type: SPATIAL
    name: embedded-in
    source: apple
    target: gregor
    description: "The apple lodges in Gregor's back and rots in place, never removed"
    valid_in:
      - from: "Month 1"
    ```

??? example "`family-knows-transformation.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/edge.schema.json
    id: family-knows-transformation
    type: KNOWLEDGE
    name: knows-about
    source: father
    target: gregor
    description: "All family members and the chief clerk know about Gregor's insect form"
    ```

### Events

??? example "`apple-attack.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: apple-attack
    name: "The Apple Attack"
    type: EVENT
    description: >
      After Gregor escapes his room during the furniture removal and frightens his mother into
      fainting, Father bombards him with apples from the fruit bowl. One apple lodges in
      Gregor's back and is never removed — it rots in place over the following weeks, becoming
      a festering wound. The attack marks the turning point from uneasy coexistence to active
      physical decline, and the embedded apple serves as a permanent reminder of the family's
      violence.
    properties:
      name_variants: ["the bombardment"]
      severity: 0.8
      participants: [gregor, father]
      location: apartment
    tags: [violence, turning-point]
    ```

??? example "`chief-clerk-visit.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: chief-clerk-visit
    name: "The Chief Clerk's Visit"
    type: EVENT
    description: >
      The chief clerk arrives at the Samsa apartment to investigate why Gregor has not reported
      for work. The family pleads through the locked door while Gregor struggles to operate the
      lock with his mandibles. When he finally opens the door, the clerk retreats in horror and
      flees the building. Father forces Gregor back into his room with a walking stick. This is
      the moment the transformation becomes a collective family crisis rather than Gregor's
      private problem.
    properties:
      name_variants: ["the confrontation at the door"]
      severity: 0.7
      participants: [gregor, chief-clerk, father, mother, grete]
      location: apartment
    tags: [escalation, exposure]
    ```

??? example "`furniture-removal.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: furniture-removal
    name: "The Furniture Removal"
    type: EVENT
    description: >
      Grete and Mother begin emptying Gregor's room to give him more crawling space.
      Gregor initially welcomes the freedom but panics when he realizes his last human
      possessions are being taken. He throws himself onto the framed picture to prevent
      its removal — the one object he fights to keep. Mother sees him clinging to the
      wall and faints, which triggers Father's apple attack. The scene crystallizes the
      tension between Gregor's insect needs and his human attachments.
    properties:
      participants: [gregor, grete, mother]
      location: gregors-room
    tags: [turning-point, identity]
    ```

??? example "`gregors-death.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: gregors-death
    name: "Gregor's Death"
    type: EVENT
    description: >
      Gregor dies alone in his room in the early morning hours, his body dried out and flat.
      The night before, Grete declared to the family that the creature is no longer Gregor and
      must be removed. Gregor, having overheard, retreats to his room and thinks of his family
      with tenderness before quietly expiring. The charwoman discovers his body and disposes
      of it. The family, relieved, takes the day off and rides the tram into the countryside,
      planning a smaller apartment and a fresh start.
    properties:
      name_variants: ["the end"]
      severity: 1.0
      participants: [gregor]
      location: gregors-room
    tags: [climax, resolution]
    ```

??? example "`transformation.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: transformation
    name: "The Transformation"
    type: EVENT
    description: >
      Gregor Samsa wakes from uneasy dreams to find himself transformed into a monstrous insect.
      The event is presented without explanation or buildup — it simply is. The transformation
      is irreversible and sets every subsequent conflict in motion: loss of income, family shame,
      confinement, and the slow erosion of Gregor's place in the household.
    properties:
      name_variants: ["the metamorphosis"]
      severity: 1.0
      participants: [gregor]
      location: gregors-room
    tags: [inciting-incident, supernatural]
    ```

??? example "`violin-recital.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/world/node.schema.json
    id: violin-recital
    name: "The Violin Recital"
    type: EVENT
    description: >
      In the final part, Grete plays violin for the lodgers in the living room. The lodgers
      quickly lose interest, but Gregor — drawn irresistibly by the music — crawls out of
      his room into the living space. He fantasizes about telling Grete he would have sent
      her to the conservatory, a plan the transformation destroyed. The lodgers notice him,
      recoil in disgust, and threaten to leave without paying. This scene triggers Grete's
      declaration that the creature must go, leading directly to Gregor's death.
    properties:
      participants: [gregor, grete, lodgers]
      location: apartment
    tags: [climax, catalyst]
    ```

## Narrative

??? example "`narrative/narrative.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../schemas/narrative/narrative.schema.json
    lenses:
      - $ref: "./lenses/gregor-pov.yaml"
      - $ref: "./lenses/detached-observer.yaml"

    beats:
      - $ref: "./beats/main-storyline.yaml"
      - $ref: "./beats/awakening.yaml"
      - $ref: "./beats/failed-emergence.yaml"
      - $ref: "./beats/uneasy-coexistence.yaml"
      - $ref: "./beats/the-attack.yaml"
      - $ref: "./beats/the-decline.yaml"
      - $ref: "./beats/final-rejection.yaml"

    devices:
      - $ref: "./devices/picture-setup-payoff.yaml"
      - $ref: "./devices/apple-chekhov.yaml"
      - $ref: "./devices/violin-setup-payoff.yaml"

    threads:
      - $ref: "./threads/dehumanization.yaml"
      - $ref: "./threads/role-reversal.yaml"
      - $ref: "./threads/doors-and-barriers.yaml"

    formats:
      - $ref: "./formats/novella.yaml"

    variants:
      - type: CANON
        description: "The canonical story — Gregor transforms, declines, and dies; the family is liberated"
    ```

### Lenses

??? example "`detached-observer.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/lens.schema.json
    id: detached-observer
    type: SIMPLE
    perspective:
      type: OBJECTIVE
      person: THIRD

    knowledge:
      mode: PUBLIC_ONLY

    temporal_position:
      type: IN_MOMENT

    voice:
      vocabulary_level: FORMAL
      sentence_tendency: SHORT_STACCATO
      inner_monologue: false
      metaphor_density: NONE

    reliability:
      level: RELIABLE
    ```

??? example "`gregor-pov.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/lens.schema.json
    id: gregor-pov
    type: SIMPLE
    perspective:
      type: CHARACTER_BOUND
      anchor: gregor
      person: THIRD

    knowledge:
      mode: CHARACTER_KNOWLEDGE
      include_subconscious: true
      include_wrong_beliefs: true

    temporal_position:
      type: IN_MOMENT

    emotional:
      source: CHARACTER_STATE
      bias:
        toward: [grete, father]
        bias_strength: 0.7

    voice:
      vocabulary_level: FORMAL
      sentence_tendency: COMPLEX_NESTED
      inner_monologue: true
      metaphor_density: LOW
      verbal_tics: ["he thought", "it occurred to him"]

    reliability:
      level: SELECTIVE
      omits: []
      distorts:
        - node: father
          direction: NEGATIVE
        - node: grete
          direction: POSITIVE
    ```

### Beats

??? example "`awakening.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/beat.schema.json
    id: awakening
    name: "Unquiet Dreams"
    description: "Gregor wakes transformed into an insect and struggles to comprehend his new body while worrying about missing his train."
    parent: main-storyline
    order: 1

    node_ids: [gregor, gregors-room, transformation]
    edge_ids: [gregor-confined-to-room]

    function: HOOK
    tension: 0.4
    emotional_target: -0.3
    transition:
      type: CONTINUATION
    ```

??? example "`failed-emergence.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/beat.schema.json
    id: failed-emergence
    name: "The Door Opens"
    description: "The chief clerk arrives; Gregor manages to open his door and is seen by his family and the clerk, who flees. Father forces Gregor back into his room."
    parent: main-storyline
    order: 2

    node_ids: [gregor, chief-clerk, father, mother, grete, apartment]
    edge_ids: [family-knows-transformation, father-hostile-to-gregor]

    function: INCITING_INCIDENT
    tension: 0.6
    emotional_target: -0.5

    reveals:
      - target: gregor
        degree: FULL
      - target: family-knows-transformation
        degree: FULL

    transition:
      type: TIME_SKIP
    ```

??? example "`final-rejection.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/beat.schema.json
    id: final-rejection
    name: "It Has to Go"
    description: "Months later, lodgers discover Gregor. Grete declares 'it has to go.' Gregor retreats to his room and dies in the early morning. The family, relieved, takes a spring outing."
    parent: main-storyline
    order: 5

    node_ids: [gregor, grete, father, mother, lodgers, charwoman, violin, violin-recital, gregors-death]
    edge_ids: [grete-rejects-gregor, lodgers-dominate-apartment, gregor-attached-to-violin]

    function: CLIMAX
    tension: 0.9
    emotional_target: -0.8

    reveals:
      - target: grete-rejects-gregor
        degree: FULL
      - target: gregors-death
        degree: FULL

    transition:
      type: FADE
    ```

??? example "`main-storyline.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/beat.schema.json
    # Top-level beat acting as the storyline container.
    # Node and edge references are inherited from child beats.
    id: main-storyline
    name: "Gregor Samsa's Transformation"
    description: "A traveling salesman wakes as an insect and watches his family's love erode into revulsion, ending in his quiet death and their liberation."

    tags: [main-plot]
    ```

??? example "`the-attack.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/beat.schema.json
    id: the-attack
    name: "The Apple"
    description: "Gregor escapes his room during the furniture removal, terrifying his mother. Father bombards him with apples; one lodges in his back, a wound that will never heal."
    parent: main-storyline
    order: 4

    node_ids: [gregor, father, mother, apple, apple-attack, apartment]
    edge_ids: [father-hostile-to-gregor]

    function: CRISIS
    tension: 0.8
    emotional_target: -0.6

    reveals:
      - target: apple-attack
        degree: FULL

    transition:
      type: TIME_SKIP
    ```

??? example "`uneasy-coexistence.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/beat.schema.json
    id: uneasy-coexistence
    name: "The New Routine"
    description: "Grete assumes the role of caretaker. The family adjusts uneasily. When Grete and Mother begin removing furniture, Gregor clings to the picture frame — his last vestige of humanity."
    parent: main-storyline
    order: 3

    node_ids: [gregor, grete, mother, gregors-room, picture-frame, furniture-removal]
    edge_ids: [grete-cares-for-gregor, mother-pity-for-gregor]

    function: RISING_ACTION
    tension: 0.5
    emotional_target: -0.2

    reveals:
      - target: picture-frame
        degree: FULL
      - target: grete-cares-for-gregor
        degree: FULL

    transition:
      type: CLIFFHANGER
    ```

### Devices

??? example "`apple-chekhov.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/device.schema.json
    id: apple-chekhov
    type: CHEKHOV_GUN
    description: "Father's growing hostility culminates in the apple bombardment. The apple lodged in Gregor's back rots over months, a physical marker of the family's violence that accelerates his decline toward death."
    setup:
      - failed-emergence
    payoff:
      - the-attack
    ```

??? example "`picture-setup-payoff.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/device.schema.json
    id: picture-setup-payoff
    type: SETUP_PAYOFF
    description: "The framed picture of the woman in furs is introduced as part of Gregor's room. When the furniture is removed, Gregor clings to it — revealing it as the last symbol of his human identity."
    setup:
      - awakening
    payoff:
      - uneasy-coexistence
    ```

??? example "`violin-setup-payoff.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/device.schema.json
    id: violin-setup-payoff
    type: SETUP_PAYOFF
    description: >
      Gregor's secret plan to fund Grete's conservatory studies is mentioned early,
      establishing the violin as a symbol of his human aspirations for his sister.
      The payoff comes in the final part when Grete plays for the lodgers and Gregor,
      drawn by the music, crawls out — the last flicker of his humanity directly
      causing his exposure and death sentence.
    setup:
      - awakening
    payoff:
      - final-rejection
    ```

### Threads

??? example "`dehumanization.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/thread.schema.json
    id: dehumanization
    type: THEME
    name: "Dehumanization and Alienation"
    description: >
      The progressive erasure of Gregor's humanity — first physical, then social, then psychological —
      mirrors the family's gradual shift from horror to indifference to active rejection.

    appearances:
      - beat_id: awakening
        description: "Gregor's body is alien but his mind remains human — he worries about work and his family's debts"
      - beat_id: failed-emergence
        description: "The family sees only the insect; the clerk flees — Gregor's social identity is destroyed"
      - beat_id: uneasy-coexistence
        description: "Gregor clings to the picture as his last human attachment while the room is stripped bare"
      - beat_id: the-attack
        description: "Father treats Gregor as vermin to be driven back — violence replaces any remaining paternal bond"
      - beat_id: final-rejection
        description: "Grete stops using his name — 'it has to go' — completing the dehumanization. Gregor accepts and dies."
    ```

??? example "`role-reversal.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/thread.schema.json
    id: role-reversal
    type: THEME
    name: "Family Role Reversal"
    description: >
      Before the transformation, Gregor was the sole breadwinner while his father had
      given up and his sister was a carefree teenager. The transformation forces the
      family to reverse roles: Father puts on a uniform and goes to work, Mother takes
      in sewing, Grete gets a sales job. As the family regains agency, Gregor loses his —
      the provider becomes the burden, the dependent becomes the decision-maker.

    appearances:
      - beat_id: awakening
        description: "Gregor worries about work and debts — his identity is defined by providing for the family"
      - beat_id: failed-emergence
        description: "The chief clerk's visit underscores that Gregor's value to the household was his income"
      - beat_id: uneasy-coexistence
        description: "Grete assumes the caretaker role; Father begins working again in his bank messenger uniform"
      - beat_id: the-attack
        description: "Father's new authority manifests physically — he attacks Gregor rather than retreating"
      - beat_id: final-rejection
        description: "Grete — now the family's strongest voice — decides Gregor's fate. The former child becomes the executioner"
    ```

### Formats

??? example "`novella.yaml`"

    ```yaml
    # yaml-language-server: $schema=../../../../schemas/narrative/format.schema.json
    id: novella
    name: "Novella"
    type: NOVEL
    structure:
      type: book
      constraints:
        count: 1
        target_words: "20000-25000"
      children:
        type: part
        constraints:
          count: 3
          target_words: "6000-9000"
        children:
          type: scene
          constraints:
            count: "3-5"
            target_words: "1500-2500"

    settings:
      pacing:
        part:
          tension_shape: MINI_ARC
          end_hook: USUALLY
        scene:
          tension_shape: RISE_CLIMAX_RESOLVE
          cliffhanger_at_end: false
    ```
