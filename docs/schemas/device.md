# Device Schema

A narrative device describes a **rhetorical technique connecting beats to each other**. Devices model how the author arranges information for effect — foreshadowing, red herrings, setup/payoff, dramatic irony, and more.

Devices are part of the narrative layer and **define no own truth**. They reference only beat IDs — node and edge references live on the beats themselves (no redundancy).

## Device Types

| Type | Description |
|------|-------------|
| `FORESHADOWING` | Early hint at a later event |
| `RED_HERRING` | Deliberate misdirection |
| `SETUP_PAYOFF` | Something planted early that pays off later |
| `DRAMATIC_IRONY` | Reader knows something the character doesn't |
| `ECHO` | A scene that mirrors an earlier one |
| `CONTRAST` | Deliberate juxtaposition of two beats |
| `PARALLEL` | Two storylines that run in parallel |
| `CALLBACK` | Reference back to an earlier moment |
| `CHEKHOV_GUN` | Element introduced early that must be used later |
| `CUSTOM` | Any other narrative technique |

## Example

```yaml
id: journal-setup-payoff
type: SETUP_PAYOFF
description: "The journal found in the cave pays off when used to confront Elara."
setup:
  - cave-found
payoff:
  - truth-revealed
```

## Schema Reference

{%
  include-markdown "./generated/device.md"
%}
