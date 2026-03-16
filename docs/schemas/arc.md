# Arc Schema

A story arc groups **related world graph elements (nodes and edges) of a storyline**. Arcs define which parts of the world belong together for a particular storyline — an episode, a quest, a subplot.

Arcs are part of the narrative layer and **define no own truth**. They only reference elements from the world layer. Pacing, tension, and emotional targets are not part of the arc — those are concerns of the output tooling.

**Beats** are an optional ordered sequence within an arc. Array position determines order. Each beat can narrow down which nodes and edges are in focus at that point in the storyline.

**Parent arcs** allow storyline hierarchy (main plot containing subplots). This is purely about the storyline itself, independent of output format.

```yaml
{% include "../../schemas/arc.schema.yaml" %}
```
