# The Metamorphosis

A complete example project for the **Story as Code** specification, based on Franz Kafka's 1915 novella *Die Verwandlung* (*The Metamorphosis*). All story elements and characters originate from Kafka's work. This example is provided solely to demonstrate the spec.

## Synopsis

Gregor Samsa, a traveling salesman, wakes one morning to find himself transformed into a monstrous insect. As his family grapples with his condition — first with reluctant care, then growing resentment — Gregor's humanity erodes alongside his body. After months of confinement, his sister Grete declares "it has to go." Gregor dies alone in the night, and the family, relieved, takes a spring outing to plan their future.

## What this example demonstrates

This example highlights the following spec features:

| Spec feature | What's special here |
| --- | --- |
| **Abstract time system** | Time uses `LINEAR` type with abstract labels (`Day 1`, `Month 1`, `Month 2`, `Month 3`) instead of calendar dates — showing that the spec's time model is independent of real-world calendars |
| **Temporal edge scopes** | Relationships evolve over time: Grete's care for Gregor ends at `Month 3`, the apple is embedded from `Month 1` onward, lodgers arrive at `Month 2` — each scoped with `range` expressions |
| **Multiple lenses** | Two contrasting narrative perspectives on the same world: `gregor-pov` (CHARACTER_BOUND, inner monologue, selective reliability, emotional distortions) vs. `detached-observer` (OBJECTIVE, no inner monologue, fully reliable) |
| **Lens reliability & distortion** | The Gregor lens distorts perception — views Father negatively and Grete positively — demonstrating the `reliability.distorts` field with directional bias |
| **Rich edge type variety** | Seven edge types in a single example: SPATIAL, OWNERSHIP, SOCIAL, RELATIONSHIP, KNOWLEDGE, PARTICIPATION, OCCURRENCE — showing the spec's type extensibility |
| **Constraint with scope** | A world rule ("a character can only be in one place at a time") scoped to `node_type: CHARACTER` — demonstrating constraints with selector-based scopes |
| **Beat reveals** | Beats use `reveals` to model information disclosure: the transformation is revealed FULL in beat 2, the picture's significance emerges in beat 3 — showing how the spec tracks what the reader learns and when |
| **Thread types** | Both `THEME` (dehumanization, role reversal) and `MOTIF` (doors and barriers) threads, each with per-beat appearance descriptions — showing the distinction between abstract ideas and recurring symbols |
| **Novella format** | Recursive structure `book → part → scene` with word count constraints at each level and pacing settings — demonstrating the format system for prose output |
