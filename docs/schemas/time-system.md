# Time System Schema

Defines how time works in a world. The time system is a world-level concept that governs the meaning of time points used throughout nodes, edges, and frames.

## Three Time Concepts

1. **Time System** — the general concept of how time works (linear, cyclical, branching, etc.)
2. **Time Points** — concrete identifiers for moments in time, attached to nodes and edges. Their format depends on the time system (e.g., `"T0"`, `"2024-03-15"`, `"Cycle-3:Phase-2"`)
3. **Frames** — alternative timelines or branches. Different frames can have different nodes, edges, and constraints valid at the same time point.

## Time System Types

- **LINEAR** — time points have a natural order. "Earlier" and "later" are defined. Suitable for real-world calendars, ISO timestamps, ordinal T-values.
- **ABSTRACT** — time points are labels without inherent ordering. Relationships between moments are defined through the graph (edges, frame relations). Useful for worlds where time is not a meaningful linear concept.

Cyclical time and branching timelines are expressed through **frames** (loops via `LOOPS_BACK` relations, branches via `parent` + `branches_at`), not through the time system type.

## Examples

```yaml
# Simple linear time
time_system:
  id: linear
  type: LINEAR
  epoch: "Year 0"

# Calendar-based time
time_system:
  id: earth-calendar
  type: LINEAR
  epoch: "2024-01-01"
  calendar:
    months: 12
    days_per_year: 365

# Abstract time — moments are just labels
time_system:
  id: dreamworld
  type: ABSTRACT
  properties:
    note: "Time has no direction here; connections define sequence"
```

## Schema Reference

{%
  include-markdown "./generated/time-system.md"
%}
