---
hide:
  - toc
  - edit
---

# Interactive Story Graph

Click any element to see its details and highlight related elements across all views.

<div id="story-graph" data-src="../../assets/data/the-metamorphosis.story.json">

  <div class="graph-row graph-row-2">
    <div class="graph-section" data-view="world">
      <h2>World Graph</h2>
      <div class="section-content"></div>
    </div>

    <div class="graph-section" data-view="timeline">
      <h2>Timeline &amp; Frames</h2>
      <div class="section-content"></div>
    </div>
  </div>

  <div class="graph-section graph-full" data-view="narrative">
    <h2>Narrative Flow</h2>
    <div class="section-content"></div>
  </div>

  <div class="graph-row">
    <div class="graph-section" data-view="lenses">
      <h2>Lenses</h2>
      <div class="section-content"></div>
    </div>

    <div class="graph-section" data-view="formats">
      <h2>Formats</h2>
      <div class="section-content"></div>
    </div>

    <div class="graph-section" data-view="constraints">
      <h2>Constraints</h2>
      <div class="section-content"></div>
    </div>
  </div>

  <div id="detail-panel"></div>

</div>

<script src="https://unpkg.com/cytoscape@3.30.4/dist/cytoscape.min.js"></script>
<script src="https://unpkg.com/dagre@0.8.5/dist/dagre.min.js"></script>
<script src="https://unpkg.com/cytoscape-dagre@2.5.0/cytoscape-dagre.js"></script>
