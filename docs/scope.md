# Scope & Boundaries

This page clarifies what the Story as Code specification covers — and what it intentionally leaves to other layers.

## What the Spec Defines

The specification defines a **declarative schema language** for describing worlds as temporal graphs. Concretely, it covers:

- **Graph structure** — Node and edge types, properties, and temporal states
- **Temporal model** — Frames with topologies (linear, branching, cyclical, retrocausal, subjective, entropic)
- **Narrative configuration** — Lenses (perspective, knowledge, voice, reliability)
- **Dramatic structure** — Arcs with milestones and graph conditions
- **Output formats** — Format definitions with structural hierarchy and pacing rules
- **Type system** — Extensible schemas for custom node/edge types and properties
- **World rules** — Constraints as declarative assertions with severity levels
- **Derivation contracts** — Metadata linking compiled outputs back to graph state
- **Variant model** — Canon, speculative, retcon, fork, and collab variants

## What the Spec Does Not Define

The following concerns are **intentionally out of scope**. They belong to tooling, implementations, or ecosystem layers built on top of the specification.

### File System Layout

The spec defines **what** is valid (schemas), not **where** files are stored. A conforming world can be a single `world.yaml` with everything inline, or a multi-file project with `$ref` references pointing to any directory structure. How files are organized on disk is a tooling and user-preference concern — the spec is layout-agnostic.

### Storage & Persistence

The spec does not prescribe how or where files are stored. Git is a natural fit — YAML files version well, diffs are readable, and branching maps to world variants — but the spec is storage-agnostic. A conforming implementation could use a database, an object store, or any other backend.

### Error Analysis & Story Validation

The spec provides the **building blocks** for validation — the [Constraint](schemas/constraint.md) schema defines declarative rules with severity levels, and the [Derivation Meta](schemas/derivation-meta.md) schema tracks dependency contracts. However, the spec does not define:

- **How** constraints are evaluated (graph traversal algorithms, query engines)
- **Which** semantic story problems to detect (plot holes, dead characters with later edges, orphaned subplots, causal chain gaps, unreachable subgraphs)
- **When** validation runs (on save, on commit, in CI, on demand)

These are concerns of a **story linter** or **world analyzer** — tooling that reads the graph and applies rules, both user-defined constraints and built-in heuristics. The spec gives such tools a stable schema to work against, but the analysis logic itself is out of scope.

### Derivation & Compilation

The spec defines **what** a derivation is ([Derivation Meta](schemas/derivation-meta.md)) and **what** it requires (lens + arc + format + graph state), but not **how** the derivation is produced. The compilation process — selecting nodes, resolving knowledge filters, applying pacing rules, generating prose or panels or audio — is a tooling concern.

Different implementations may use LLMs, template engines, procedural generation, or manual authoring to produce derivations. The spec only requires that the result is accompanied by valid derivation metadata linking it back to its source graph.

### Tooling & Developer Experience

The spec does not define CLI commands, editor integrations, visualization tools, or any other developer-facing tooling. Examples of tooling that implementations may provide:

- **CLI** — `story init`, `story validate`, `story derive`, `story diff`
- **Editor support** — Schema-aware autocompletion, graph visualization, timeline views
- **CI/CD integration** — Constraint checks as commit hooks or pipeline steps
- **Collaboration** — Merge conflict resolution for graph files, variant management workflows

The spec aims to be a stable foundation that tooling can build on without being coupled to any specific tool's design decisions.
