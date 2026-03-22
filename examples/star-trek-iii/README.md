# Star Trek III: The Search for Spock

A complete example project for the **Story as Code** specification, based on Leonard Nimoy's 1984 film *Star Trek III: The Search for Spock* (written by Harve Bennett). All story elements, characters, and plot points are the intellectual property of their respective creators. This example is provided solely to demonstrate the spec.

## Synopsis

Admiral Kirk defies Starfleet to recover Spock's regenerating body from the unstable Genesis Planet, while Klingon Commander Kruge races to seize Genesis as a weapon. After David's death and the self-destruction of the Enterprise, Kirk defeats Kruge on the collapsing planet and brings Spock's body to Mount Seleya, where the fal-tor-pan ceremony reunites Spock's katra with his restored body.

## What this example demonstrates

This example highlights the following spec features, with a focus on **linguistic worldbuilding**:

| Spec feature | What's special here |
| --- | --- |
| **Languages** | Three fully defined languages — Federation Standard (SVO), Klingon/tlhIngan Hol (OVS, agglutinative with 13 verb prefixes and 9 suffix types), and Vulcan (SOV, ceremonial vocabulary) — each with phonology, morphology, syntax, and writing system properties |
| **Language registers** | Three sociolinguistic registers of Klingon: `ta' Hol` (formal/ceremonial with honorific suffixes), `Battle Commands` (terse imperatives, maximum brevity), and `Clipped Klingon` (colloquial, prefix-dropping) — showing that languages vary by social context |
| **Lexicon entries** | Five Klingon vocabulary items — `bat'leth`, `Qapla'`, `Heghlu'meH QaQ jajvam`, `petaQ`, `toH` — each with etymology, morphological analysis, cultural notes, and register scope |
| **Language in lenses** | The Kruge POV lens uses `KLINGON_ROMANIZED` language rendering with `WARRIOR_TERSE` vocabulary and `CLIPPED_SPEECH` sentence tendency — deriving character voice from linguistic definitions |
| **SPEAKS edges** | Characters connect to languages via typed edges with `fluency` and `primaryRegister` properties — Kirk speaks Federation Standard, Kruge speaks Klingon with `battle-commands` as primary register |
| **HAS_REGISTER / HAS_TERM edges** | Klingon links to its registers via `HAS_REGISTER` edges and to lexicon entries via `HAS_TERM` edges — modeling language as a graph of related entities, not flat metadata |
| **Dual POV lenses** | Kirk (formal vocabulary, inner monologue, emotional bias toward Spock and David) vs. Kruge (warrior-terse, no inner monologue, Genesis obsession) — same events, radically different voice |
| **Narrative devices** | Chekhov's Gun (McCoy carries katra) and Setup/Payoff (Genesis instability → ticking clock) — connecting beats across the storyline |
| **Thematic threads** | "The Needs of the Few" (inverting Spock's famous quote) and "Death and Rebirth" (Spock, Enterprise, David, Genesis) as threads with per-beat appearances |
| **Screenplay format** | Feature film structure `film → act → sequence → scene` with THREE_ACT pacing and 105-minute runtime target |
