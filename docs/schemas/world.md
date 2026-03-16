# World Schema

The world schema defines the **ground truth** of a Story as Code project. Everything that exists — entities (nodes), relationships (edges), timelines (frames), rules (constraints), and the time system — is defined here.

The world layer is the **single source of truth**. The narrative layer references world content but never defines its own truth.

The world is a sub-object of the root [Story](story.md) document.

## Implicit Default Frame

A world always has an **implicit default frame** that does not need to be defined. If no `frames` are specified, all temporal data belongs to the default frame. When a node state or edge omits the `frame` field, it applies to **all frames** (including the default).

## Schema Reference

{%
  include-markdown "./generated/world.md"
%}
