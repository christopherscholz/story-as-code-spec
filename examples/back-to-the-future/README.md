# Back to the Future

A complete example project for the **Story as Code** specification, based on Robert Zemeckis's 1985 film *Back to the Future* (written by Robert Zemeckis and Bob Gale, produced by Steven Spielberg). All story elements, characters, and plot points are the intellectual property of their respective creators. This example is provided solely to demonstrate the spec.

## Synopsis

Teenager Marty McFly is accidentally sent thirty years into the past in a time-traveling DeLorean built by his eccentric friend Dr. Emmett Brown. Stranded in 1955 without fuel, Marty disrupts his parents' first meeting and must engineer their romance at the Enchantment Under the Sea dance — or he will cease to exist. With the help of the younger Doc Brown, he harnesses a lightning strike to power the DeLorean and returns to a 1985 transformed by his father's newfound courage.

## What this example demonstrates

This example highlights the following spec features:

| Spec feature | What's special here |
| --- | --- |
| **Frames (branching timelines)** | Three frames forming a branch topology: `Original 1985` → `1955 Adventure` (branches at 1985-10-26) → `Improved 1985` (branches at 1955-11-12). Shows `parent`, `branches_at`, and `relations` with `BRANCHES_INTO` |
| **Frame-scoped edges** | Lorraine's infatuation with Marty is scoped to the `1955-timeline` frame with an `and` expression combining frame selector and time range — demonstrating compound boolean scope expressions |
| **Time-range scoped edges** | Biff's bullying ends at the dance (`range.to: 1955-11-12`), George's marriage starts in 1958 (`range.from: 1958`) — showing open-ended ranges with `null` boundaries |
| **KINSHIP edge type** | Family relationships (son-of, married-to) as typed edges — the spec supports kinship alongside spatial, conflict, and relationship types |
| **CONFLICT edge type** | Biff's antagonism modeled as directed conflict edges (bullies, pursues) — distinct from relationship edges, with temporal scopes showing when conflicts are active |
| **Dramatic irony device** | The Darth Vader scene uses `DRAMATIC_IRONY` — the audience recognises the Star Wars reference but 1955 George cannot. Shows a device type beyond setup/payoff and Chekhov's gun |
| **Multiple device types** | Four devices across three types: `CHEKHOV_GUN` (fading photo), `SETUP_PAYOFF` (clock tower flyer, bulletproof vest), `DRAMATIC_IRONY` (Darth Vader) — demonstrating the spec's device variety |
| **Screenplay format** | Recursive structure `film → act → sequence → scene` with runtime constraints — demonstrating the format system for film rather than prose |
| **Colloquial lens voice** | Marty's POV lens uses `COLLOQUIAL` vocabulary, `SHORT_STACCATO` sentences, and verbal tics ("this is heavy", "what the hell") — showing how voice configuration shapes tone |
| **Constraint as narrative rule** | The paradox constraint ("Marty must ensure his parents meet") is scoped to the `marty` node — using constraints to express narrative-level rules, not just world physics |
