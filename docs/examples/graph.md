---
hide:
  - toc
---

# Interactive Story Graph

Explore the world and narrative structure of a Story as Code example as an interactive visualization.
Each tab shows a different aspect of the story — click any element to see its details and cross-references.

<div id="story-graph" data-src="../../assets/data/the-metamorphosis.story.json">
  <nav class="graph-tabs"></nav>
  <div class="graph-viewport">
    <div class="graph-view" data-view="world"></div>
    <div class="graph-view" data-view="narrative"></div>
    <div class="graph-view" data-view="timeline"></div>
    <div class="graph-view" data-view="lenses"></div>
    <div class="graph-view" data-view="formats"></div>
    <div class="graph-view" data-view="constraints"></div>
  </div>
  <div class="graph-info-panel"></div>
  <div class="graph-crossref"></div>
</div>

<script src="https://unpkg.com/cytoscape@3.30.4/dist/cytoscape.min.js"></script>
<script src="https://unpkg.com/dagre@0.8.5/dist/dagre.min.js"></script>
<script src="https://unpkg.com/cytoscape-dagre@2.5.0/cytoscape-dagre.js"></script>
