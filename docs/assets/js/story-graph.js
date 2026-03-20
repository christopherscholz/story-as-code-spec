(function () {
  'use strict';

  const root = document.getElementById('story-graph');
  if (!root) return;

  /* ── colour palette ────────────────────────────────────────────── */
  const COLORS = {
    CHARACTER:    { light: '#7E57C2', dark: '#B39DDB' },
    LOCATION:     { light: '#26A69A', dark: '#80CBC4' },
    OBJECT:       { light: '#FFB300', dark: '#FFD54F' },
    EVENT:        { light: '#EF5350', dark: '#EF9A9A' },
    CONCEPT:      { light: '#78909C', dark: '#B0BEC5' },
    SPATIAL:      { light: '#26A69A', dark: '#80CBC4' },
    RELATIONSHIP: { light: '#7E57C2', dark: '#B39DDB' },
    OWNERSHIP:    { light: '#FFB300', dark: '#FFD54F' },
    SOCIAL:       { light: '#78909C', dark: '#B0BEC5' },
    KNOWLEDGE:    { light: '#5C6BC0', dark: '#9FA8DA' },
    KINSHIP:      { light: '#EC407A', dark: '#F48FB1' },
    CONFLICT:     { light: '#EF5350', dark: '#EF9A9A' },
  };
  const PALETTE = ['#8D6E63','#66BB6A','#42A5F5','#AB47BC','#FFA726','#26C6DA','#D4E157','#EC407A'];
  let _pi = 0;
  function colorFor(type) {
    if (COLORS[type]) return COLORS[type];
    COLORS[type] = { light: PALETTE[_pi % PALETTE.length], dark: PALETTE[_pi % PALETTE.length] };
    _pi++;
    return COLORS[type];
  }

  const SHAPES = {
    CHARACTER: 'ellipse', LOCATION: 'round-rectangle', OBJECT: 'diamond',
    EVENT: 'hexagon', CONCEPT: 'octagon',
  };

  const FUNC_COLORS = {
    HOOK: '#42A5F5', INCITING_INCIDENT: '#66BB6A', RISING_ACTION: '#FFB300',
    FIRST_THRESHOLD: '#FFA726', PINCH_POINT: '#FF7043', MIDPOINT: '#AB47BC',
    CRISIS: '#EF5350', CLIMAX: '#D32F2F', RESOLUTION: '#26A69A',
    DENOUEMENT: '#78909C', CUSTOM: '#BDBDBD',
  };

  /* ── state ─────────────────────────────────────────────────────── */
  let story = null;
  let selected = null;
  const listeners = [];
  function select(sel) {
    // toggle off if clicking same element
    if (selected && sel && selected.kind === sel.kind && selected.id === sel.id) { selected = null; }
    else { selected = sel; }
    listeners.forEach(fn => fn(selected));
  }
  function onSelect(fn) { listeners.push(fn); }

  function isDark() { return document.body.getAttribute('data-md-color-scheme') === 'slate'; }
  function c(type) { const cl = colorFor(type); return isDark() ? cl.dark : cl.light; }

  /* ── data loading ──────────────────────────────────────────────── */
  const src = root.getAttribute('data-src');
  if (!src) { root.innerHTML = '<p>No data-src attribute.</p>'; return; }

  fetch(src).then(r => r.json()).then(data => { story = data; init(); })
    .catch(e => { root.innerHTML = '<p>Failed to load story: ' + e.message + '</p>'; });

  /* ── init ───────────────────────────────────────────────────────── */
  function init() {
    renderAllSections();

    new MutationObserver(() => {
      renderAllSections();
    }).observe(document.body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
  }

  let cy = null;

  function renderAllSections() {
    const sections = root.querySelectorAll('.graph-section');
    sections.forEach(sec => {
      const view = sec.dataset.view;
      const content = sec.querySelector('.section-content');
      const detail = sec.querySelector('.section-detail');
      content.innerHTML = '';
      if (detail) detail.innerHTML = '';
      switch (view) {
        case 'world': renderWorld(content, detail); break;
        case 'narrative': renderNarrative(content, detail); break;
        case 'timeline': renderTimeline(content); break;
        case 'lenses': renderLenses(content); break;
        case 'formats': renderFormats(content); break;
        case 'constraints': renderConstraints(content); break;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 1: WORLD GRAPH
     ═══════════════════════════════════════════════════════════════════ */
  function renderWorld(container, detail) {
    const w = story.world || {};
    const nodes = w.nodes || [];
    const edges = w.edges || [];

    // filter bar
    const filterBar = document.createElement('div');
    filterBar.className = 'world-filters';
    const nodeTypes = [...new Set(nodes.map(n => n.type))];
    const edgeTypes = [...new Set(edges.map(e => e.type))];
    filterBar.innerHTML = '<span class="filter-label">Nodes:</span>' +
      nodeTypes.map(t => `<label class="filter-chip" style="--chip-color:${c(t)}"><input type="checkbox" checked data-filter="node-${t}"> ${t}</label>`).join('') +
      '<span class="filter-label">Edges:</span>' +
      edgeTypes.map(t => `<label class="filter-chip" style="--chip-color:${c(t)}"><input type="checkbox" checked data-filter="edge-${t}"> ${t}</label>`).join('');
    container.appendChild(filterBar);

    // cytoscape container
    const cyDiv = document.createElement('div');
    cyDiv.className = 'cy-container';
    container.appendChild(cyDiv);

    // legend
    const legend = document.createElement('div');
    legend.className = 'graph-legend';
    legend.innerHTML = nodeTypes.map(t =>
      `<span class="legend-item"><span class="legend-shape" style="background:${c(t)};border-radius:${t === 'CHARACTER' ? '50%' : t === 'EVENT' ? '2px' : '4px'}">&nbsp;</span>${t}</span>`
    ).join('');
    container.appendChild(legend);

    // build elements
    const elements = [];
    nodes.forEach(n => {
      elements.push({ group: 'nodes', data: { id: n.id, label: n.name || n.id, type: n.type }, classes: n.type });
    });
    edges.forEach(e => {
      elements.push({ group: 'edges', data: { id: e.id, source: e.source, target: e.target, label: e.name || '', type: e.type, hasScope: !!e.scope }, classes: e.type });
    });

    const dk = isDark();
    const bg = dk ? '#1e1e1e' : '#fafafa';
    const textCol = dk ? '#e0e0e0' : '#333';

    cy = cytoscape({
      container: cyDiv,
      elements: elements,
      style: buildCyStyle(dk, bg, textCol),
      layout: { name: 'cose', animate: false, nodeRepulsion: function(){ return 12000; }, idealEdgeLength: function(){ return 120; }, padding: 40 },
      minZoom: 0.3, maxZoom: 3,
    });

    cy.on('tap', 'node', e => select({ kind: 'node', id: e.target.id() }));
    cy.on('tap', 'edge', e => select({ kind: 'edge', id: e.target.id() }));
    cy.on('tap', e => { if (e.target === cy) select(null); });

    cy.on('mouseover', 'node', e => {
      const neighbourhood = e.target.closedNeighborhood();
      cy.elements().not(neighbourhood).addClass('dimmed');
      neighbourhood.addClass('highlighted');
    });
    cy.on('mouseout', 'node', () => cy.elements().removeClass('dimmed highlighted'));
    cy.on('mouseover', 'edge', e => {
      const connected = e.target.connectedNodes().union(e.target);
      cy.elements().not(connected).addClass('dimmed');
      connected.addClass('highlighted');
    });
    cy.on('mouseout', 'edge', () => cy.elements().removeClass('dimmed highlighted'));

    // cross-highlighting from selection
    onSelect(sel => {
      if (!cy) return;
      cy.elements().removeClass('cross-highlighted');
      if (!sel) { detail.innerHTML = ''; return; }

      if (sel.kind === 'node') {
        cy.$('#' + sel.id).addClass('cross-highlighted');
        const node = nodes.find(n => n.id === sel.id);
        if (node) detail.innerHTML = nodeDetailHTML(node);
      } else if (sel.kind === 'edge') {
        cy.$('#' + sel.id).addClass('cross-highlighted');
        const edge = edges.find(e => e.id === sel.id);
        if (edge) detail.innerHTML = edgeDetailHTML(edge);
      } else if (sel.kind === 'beat') {
        const beat = ((story.narrative || {}).beats || []).find(b => b.id === sel.id);
        if (beat) {
          (beat.node_ids || []).forEach(id => cy.$('#' + id).addClass('cross-highlighted'));
          (beat.edge_ids || []).forEach(id => cy.$('#' + id).addClass('cross-highlighted'));
        }
        detail.innerHTML = '';
      } else if (sel.kind === 'thread') {
        const thread = ((story.narrative || {}).threads || []).find(t => t.id === sel.id);
        if (thread) {
          const beatIds = (thread.appearances || []).map(a => a.beat_id);
          const allNodeIds = new Set();
          ((story.narrative || {}).beats || []).filter(b => beatIds.includes(b.id)).forEach(b => {
            (b.node_ids || []).forEach(id => allNodeIds.add(id));
          });
          allNodeIds.forEach(id => cy.$('#' + id).addClass('cross-highlighted'));
        }
        detail.innerHTML = '';
      } else if (sel.kind === 'device') {
        const dev = ((story.narrative || {}).devices || []).find(d => d.id === sel.id);
        if (dev) {
          const beatIds = [...(dev.setup || []), ...(dev.payoff || [])];
          const allNodeIds = new Set();
          ((story.narrative || {}).beats || []).filter(b => beatIds.includes(b.id)).forEach(b => {
            (b.node_ids || []).forEach(id => allNodeIds.add(id));
          });
          allNodeIds.forEach(id => cy.$('#' + id).addClass('cross-highlighted'));
        }
        detail.innerHTML = '';
      } else if (sel.kind === 'lens') {
        const lens = ((story.narrative || {}).lenses || []).find(l => l.id === sel.id);
        if (lens) {
          if (lens.perspective && lens.perspective.anchor) cy.$('#' + lens.perspective.anchor).addClass('cross-highlighted');
          if (lens.emotional && lens.emotional.bias) (lens.emotional.bias.toward || []).forEach(id => cy.$('#' + id).addClass('cross-highlighted'));
          if (lens.reliability && lens.reliability.distorts) lens.reliability.distorts.forEach(d => cy.$('#' + d.node).addClass('cross-highlighted'));
        }
        detail.innerHTML = '';
      } else {
        detail.innerHTML = '';
      }
    });

    // filter handling
    filterBar.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', () => {
        const [kind, type] = cb.dataset.filter.split('-');
        if (kind === 'node') cy.nodes('.' + type).toggleClass('filtered-out', !cb.checked);
        else cy.edges('.' + type).toggleClass('filtered-out', !cb.checked);
      });
    });
  }

  function buildCyStyle(dk, bg, textCol) {
    const styles = [
      { selector: 'node', style: {
        'label': 'data(label)', 'font-size': 11, 'color': textCol,
        'text-valign': 'bottom', 'text-margin-y': 6,
        'width': 36, 'height': 36, 'border-width': 2, 'border-color': '#555',
        'text-wrap': 'ellipsis', 'text-max-width': 100,
      }},
      { selector: 'edge', style: {
        'width': 2, 'curve-style': 'bezier', 'target-arrow-shape': 'triangle',
        'target-arrow-color': '#999', 'line-color': '#999', 'font-size': 9,
        'label': 'data(label)', 'text-rotation': 'autorotate', 'color': textCol,
        'text-background-color': bg, 'text-background-opacity': 0.8, 'text-background-padding': '2px',
      }},
      { selector: 'edge[?hasScope]', style: { 'line-style': 'dashed', 'line-dash-pattern': [6, 3] }},
      { selector: '.dimmed', style: { 'opacity': 0.15 }},
      { selector: '.highlighted', style: { 'opacity': 1 }},
      { selector: '.cross-highlighted', style: { 'border-width': 4, 'border-color': '#FFD600', 'z-index': 999 }},
      { selector: 'edge.cross-highlighted', style: { 'width': 4, 'line-color': '#FFD600', 'target-arrow-color': '#FFD600', 'z-index': 999 }},
      { selector: '.filtered-out', style: { 'display': 'none' }},
    ];
    Object.keys(SHAPES).forEach(type => {
      styles.push({ selector: 'node.' + type, style: { 'background-color': c(type), 'shape': SHAPES[type] }});
    });
    Object.keys(COLORS).forEach(type => {
      styles.push({ selector: 'edge.' + type, style: { 'line-color': c(type), 'target-arrow-color': c(type) }});
    });
    return styles;
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 2: NARRATIVE FLOW
     ═══════════════════════════════════════════════════════════════════ */
  function renderNarrative(container, detail) {
    const n = story.narrative || {};
    const beats = (n.beats || []).filter(b => b.order != null).sort((a, b) => a.order - b.order);
    const threads = n.threads || [];
    const devices = n.devices || [];
    if (!beats.length) { container.innerHTML = '<p class="empty-msg">No beats with order defined.</p>'; return; }

    // beat stepper
    const stepper = document.createElement('div');
    stepper.className = 'beat-stepper';
    let stepIdx = -1;
    stepper.innerHTML = '<button class="step-btn step-prev">&larr; Prev</button><span class="step-label">All beats</span><button class="step-btn step-next">Next &rarr;</button>';
    container.appendChild(stepper);

    const CARD_W = 160, CARD_H = 120, GAP = 24, PAD = 60;
    const totalW = beats.length * (CARD_W + GAP) - GAP + PAD * 2;
    const threadH = 28;
    const deviceArcH = 60;
    const tensionH = 80;
    const totalH = deviceArcH + tensionH + CARD_H + 20 + threads.length * threadH + PAD * 2;

    const wrapper = document.createElement('div');
    wrapper.className = 'narrative-scroll';
    container.appendChild(wrapper);

    const svg = createSVG(totalW, totalH);
    wrapper.appendChild(svg);

    const beatX = i => PAD + i * (CARD_W + GAP) + CARD_W / 2;
    const tensionBaseline = deviceArcH + tensionH;

    // ── tension curve
    const tensionG = svgEl('g', { class: 'tension-group' });
    svg.appendChild(tensionG);
    let tensionPath = '';
    beats.forEach((b, i) => {
      const x = beatX(i);
      const y = tensionBaseline - (b.tension || 0) * (tensionH - 10);
      tensionPath += (i === 0 ? 'M' : 'L') + `${x},${y}`;
      const dot = svgEl('circle', { cx: x, cy: y, r: 4, fill: FUNC_COLORS[b.function] || '#999', class: 'tension-dot' });
      dot.innerHTML = `<title>${b.name}: tension ${b.tension}</title>`;
      tensionG.appendChild(dot);
    });
    tensionG.appendChild(svgEl('path', { d: tensionPath, fill: 'none', stroke: isDark() ? '#B39DDB' : '#7E57C2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
    tensionG.appendChild(svgEl('line', { x1: PAD, y1: tensionBaseline, x2: totalW - PAD, y2: tensionBaseline, stroke: isDark() ? '#555' : '#ddd', 'stroke-width': 1 }));
    const tensionLabel = svgEl('text', { x: 12, y: tensionBaseline - tensionH / 2, fill: isDark() ? '#888' : '#aaa', 'font-size': 10, 'writing-mode': 'tb', 'text-anchor': 'middle' });
    tensionLabel.textContent = 'Tension';
    tensionG.appendChild(tensionLabel);

    // ── device arcs
    const deviceG = svgEl('g', { class: 'device-group' });
    svg.appendChild(deviceG);
    const DEVICE_COLORS = { FORESHADOWING: '#42A5F5', RED_HERRING: '#EF5350', SETUP_PAYOFF: '#FFA726', CHEKHOV_GUN: '#66BB6A', DRAMATIC_IRONY: '#AB47BC', ECHO: '#78909C', CONTRAST: '#EC407A', PARALLEL: '#26C6DA', CALLBACK: '#8D6E63', CUSTOM: '#BDBDBD' };
    devices.forEach((dev, di) => {
      const setupIdxs = (dev.setup || []).map(id => beats.findIndex(b => b.id === id)).filter(i => i >= 0);
      const payoffIdxs = (dev.payoff || []).map(id => beats.findIndex(b => b.id === id)).filter(i => i >= 0);
      const col = DEVICE_COLORS[dev.type] || '#999';
      setupIdxs.forEach(si => {
        payoffIdxs.forEach(pi => {
          const x1 = beatX(si), x2 = beatX(pi);
          const midX = (x1 + x2) / 2;
          const arcY = deviceArcH - 10 - di * 16;
          const d = `M${x1},${tensionBaseline - tensionH} Q${midX},${arcY} ${x2},${tensionBaseline - tensionH}`;
          const arc = svgEl('path', { d, fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-dasharray': dev.type === 'CHEKHOV_GUN' ? '8,4' : 'none', class: 'device-arc', 'data-device': dev.id });
          arc.innerHTML = `<title>${dev.type}: ${dev.id}</title>`;
          arc.addEventListener('click', () => select({ kind: 'device', id: dev.id }));
          deviceG.appendChild(arc);
          const label = svgEl('text', { x: midX, y: arcY - 4, fill: col, 'font-size': 9, 'text-anchor': 'middle', class: 'device-label' });
          label.textContent = dev.type.replace(/_/g, ' ');
          deviceG.appendChild(label);
        });
      });
    });

    // ── beat cards
    const beatsG = svgEl('g', { class: 'beats-group' });
    svg.appendChild(beatsG);
    beats.forEach((b, i) => {
      const x = PAD + i * (CARD_W + GAP);
      const y = deviceArcH + tensionH;
      const emColor = b.emotional_target != null ?
        (b.emotional_target < 0 ? `rgba(66,165,245,${Math.abs(b.emotional_target) * 0.25})` : `rgba(255,167,38,${b.emotional_target * 0.25})`) : 'transparent';
      const funcColor = FUNC_COLORS[b.function] || '#999';

      const g = svgEl('g', { class: 'beat-card', 'data-beat': b.id, cursor: 'pointer' });
      g.addEventListener('click', () => select({ kind: 'beat', id: b.id }));

      g.appendChild(svgEl('rect', { x, y, width: CARD_W, height: CARD_H, rx: 8, fill: isDark() ? '#2a2a2a' : '#fff', stroke: funcColor, 'stroke-width': 2 }));
      g.appendChild(svgEl('rect', { x: x + 1, y: y + 1, width: CARD_W - 2, height: CARD_H - 2, rx: 7, fill: emColor }));
      g.appendChild(svgEl('rect', { x: x + 4, y: y + 4, width: CARD_W - 8, height: 20, rx: 4, fill: funcColor }));
      const funcText = svgEl('text', { x: x + CARD_W / 2, y: y + 17, fill: '#fff', 'font-size': 9, 'text-anchor': 'middle', 'font-weight': 'bold' });
      funcText.textContent = (b.function || '').replace(/_/g, ' ');
      g.appendChild(funcText);

      const nameText = svgEl('text', { x: x + CARD_W / 2, y: y + 42, fill: isDark() ? '#e0e0e0' : '#333', 'font-size': 12, 'text-anchor': 'middle', 'font-weight': '600' });
      nameText.textContent = truncate(b.name || b.id, 18);
      g.appendChild(nameText);

      const orderText = svgEl('text', { x: x + CARD_W / 2, y: y + 58, fill: isDark() ? '#888' : '#999', 'font-size': 10, 'text-anchor': 'middle' });
      orderText.textContent = `#${b.order}`;
      g.appendChild(orderText);

      const barW = (CARD_W - 16) * (b.tension || 0);
      g.appendChild(svgEl('rect', { x: x + 8, y: y + CARD_H - 24, width: CARD_W - 16, height: 6, rx: 3, fill: isDark() ? '#444' : '#eee' }));
      g.appendChild(svgEl('rect', { x: x + 8, y: y + CARD_H - 24, width: barW, height: 6, rx: 3, fill: funcColor }));

      if (b.reveals && b.reveals.length) {
        const revText = svgEl('text', { x: x + CARD_W - 10, y: y + CARD_H - 10, fill: isDark() ? '#FFD54F' : '#FF8F00', 'font-size': 9, 'text-anchor': 'end' });
        revText.textContent = `${b.reveals.length} reveal${b.reveals.length > 1 ? 's' : ''}`;
        g.appendChild(revText);
      }

      beatsG.appendChild(g);

      // transition arrow
      if (i < beats.length - 1) {
        const ax = x + CARD_W + 2, ay = y + CARD_H / 2;
        const arrowG = svgEl('g', { class: 'transition-arrow' });
        arrowG.appendChild(svgEl('line', { x1: ax, y1: ay, x2: ax + GAP - 4, y2: ay, stroke: isDark() ? '#666' : '#ccc', 'stroke-width': 1.5 }));
        arrowG.appendChild(svgEl('polygon', { points: `${ax + GAP - 4},${ay - 3} ${ax + GAP},${ay} ${ax + GAP - 4},${ay + 3}`, fill: isDark() ? '#666' : '#ccc' }));
        if (b.transition) {
          const tLabel = svgEl('text', { x: ax + GAP / 2, y: ay - 6, fill: isDark() ? '#888' : '#aaa', 'font-size': 8, 'text-anchor': 'middle' });
          tLabel.textContent = b.transition.type;
          arrowG.appendChild(tLabel);
        }
        beatsG.appendChild(arrowG);
      }
    });

    // ── thread swim lanes
    const threadG = svgEl('g', { class: 'threads-group' });
    svg.appendChild(threadG);
    const threadBaseY = deviceArcH + tensionH + CARD_H + 20;
    const THREAD_COLORS = [
      isDark() ? '#F48FB1' : '#EC407A', isDark() ? '#90CAF9' : '#42A5F5',
      isDark() ? '#A5D6A7' : '#66BB6A', isDark() ? '#FFE082' : '#FFB300',
      isDark() ? '#CE93D8' : '#AB47BC',
    ];

    threads.forEach((thread, ti) => {
      const y = threadBaseY + ti * threadH;
      const col = THREAD_COLORS[ti % THREAD_COLORS.length];

      const labelEl = svgEl('text', { x: PAD - 8, y: y + threadH / 2 + 4, fill: col, 'font-size': 10, 'text-anchor': 'end', 'font-weight': '500', cursor: 'pointer' });
      labelEl.textContent = truncate(thread.name, 20);
      labelEl.addEventListener('click', () => select({ kind: 'thread', id: thread.id }));
      threadG.appendChild(labelEl);

      threadG.appendChild(svgEl('line', { x1: PAD, y1: y + threadH / 2, x2: totalW - PAD, y2: y + threadH / 2, stroke: col, 'stroke-width': 1, opacity: 0.3 }));

      const typeBadge = svgEl('text', { x: PAD - 8, y: y + threadH / 2 + 14, fill: isDark() ? '#666' : '#bbb', 'font-size': 8, 'text-anchor': 'end' });
      typeBadge.textContent = thread.type;
      threadG.appendChild(typeBadge);

      const appearances = (thread.appearances || [])
        .map(a => ({ ...a, idx: beats.findIndex(b => b.id === a.beat_id) }))
        .filter(a => a.idx >= 0).sort((a, b) => a.idx - b.idx);

      let linePath = '';
      appearances.forEach((a, ai) => {
        const cx = beatX(a.idx), cy = y + threadH / 2;
        linePath += (ai === 0 ? 'M' : 'L') + `${cx},${cy}`;
        const dot = svgEl('circle', { cx, cy, r: 6, fill: col, cursor: 'pointer', class: 'thread-dot', 'data-thread': thread.id });
        dot.innerHTML = `<title>${esc(a.description || a.beat_id)}</title>`;
        dot.addEventListener('click', ev => { ev.stopPropagation(); select({ kind: 'thread', id: thread.id }); });
        threadG.appendChild(dot);
      });
      if (linePath) threadG.insertBefore(svgEl('path', { d: linePath, fill: 'none', stroke: col, 'stroke-width': 2, opacity: 0.5 }), threadG.firstChild);
    });

    // beat stepper logic
    const stepTo = (idx) => {
      stepIdx = Math.max(-1, Math.min(idx, beats.length - 1));
      stepper.querySelector('.step-label').textContent = stepIdx >= 0 ? `${beats[stepIdx].name} (${stepIdx + 1}/${beats.length})` : 'All beats';
      if (stepIdx >= 0) select({ kind: 'beat', id: beats[stepIdx].id }); else select(null);
    };
    stepper.querySelector('.step-prev').addEventListener('click', () => stepTo(stepIdx - 1));
    stepper.querySelector('.step-next').addEventListener('click', () => stepTo(stepIdx + 1));

    // selection highlighting
    onSelect(sel => {
      svg.querySelectorAll('.beat-card').forEach(g => g.classList.remove('sel-highlight'));
      svg.querySelectorAll('.device-arc').forEach(a => a.classList.remove('sel-highlight'));
      svg.querySelectorAll('.thread-dot').forEach(d => d.classList.remove('sel-highlight'));
      if (!sel) { detail.innerHTML = ''; return; }

      if (sel.kind === 'beat') {
        svg.querySelector(`.beat-card[data-beat="${sel.id}"]`)?.classList.add('sel-highlight');
        const beat = beats.find(b => b.id === sel.id);
        if (beat) detail.innerHTML = beatDetailHTML(beat);
      } else if (sel.kind === 'device') {
        svg.querySelectorAll(`.device-arc[data-device="${sel.id}"]`).forEach(a => a.classList.add('sel-highlight'));
        const dev = devices.find(d => d.id === sel.id);
        if (dev) detail.innerHTML = deviceDetailHTML(dev);
      } else if (sel.kind === 'thread') {
        svg.querySelectorAll(`.thread-dot[data-thread="${sel.id}"]`).forEach(d => d.classList.add('sel-highlight'));
        const thread = threads.find(t => t.id === sel.id);
        if (thread) detail.innerHTML = threadDetailHTML(thread);
      } else if (sel.kind === 'node') {
        // highlight beats containing this node
        beats.forEach(b => { if ((b.node_ids || []).includes(sel.id)) svg.querySelector(`.beat-card[data-beat="${b.id}"]`)?.classList.add('sel-highlight'); });
        detail.innerHTML = '';
      } else if (sel.kind === 'edge') {
        beats.forEach(b => { if ((b.edge_ids || []).includes(sel.id)) svg.querySelector(`.beat-card[data-beat="${b.id}"]`)?.classList.add('sel-highlight'); });
        detail.innerHTML = '';
      } else {
        detail.innerHTML = '';
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 3: TIMELINE & FRAMES
     ═══════════════════════════════════════════════════════════════════ */
  function renderTimeline(container) {
    const w = story.world || {};
    const ts = w.time_system;
    const frames = w.frames || [];
    const edges = (w.edges || []).filter(e => e.scope);

    if (!ts && !edges.length && !frames.length) { container.innerHTML = '<p class="empty-msg">No time system, frames, or temporal scopes defined.</p>'; return; }

    const timePoints = new Set();
    edges.forEach(e => collectTimePoints(e.scope, timePoints));
    frames.forEach(f => { if (f.branches_at) timePoints.add(f.branches_at); (f.relations || []).forEach(r => { if (r.at) timePoints.add(r.at); }); });
    const sorted = [...timePoints].sort();

    const PAD = 60, BAR_H = 24, LANE_GAP = 8;
    const axisY = 80;
    const barStartY = axisY + 40;
    const WIDTH = Math.max(800, sorted.length * 140 + PAD * 2);
    const frameLaneY = barStartY + edges.length * (BAR_H + LANE_GAP) + 40;
    const totalH = frameLaneY + (frames.length + 1) * (BAR_H + LANE_GAP) + PAD;

    const wrapper = document.createElement('div');
    wrapper.className = 'timeline-scroll';
    container.appendChild(wrapper);

    const svg = createSVG(WIDTH, totalH);
    wrapper.appendChild(svg);

    const tpX = tp => {
      const idx = sorted.indexOf(tp);
      return idx >= 0 ? PAD + (idx + 0.5) * ((WIDTH - PAD * 2) / sorted.length) : PAD;
    };

    // time system header
    if (ts) {
      const title = svgEl('text', { x: PAD, y: 30, fill: isDark() ? '#e0e0e0' : '#333', 'font-size': 16, 'font-weight': 'bold' });
      title.textContent = ts.name || 'Timeline';
      svg.appendChild(title);
      const sub = svgEl('text', { x: PAD, y: 48, fill: isDark() ? '#888' : '#999', 'font-size': 12 });
      sub.textContent = `Type: ${ts.type}` + (ts.calendar ? ` | Unit: ${ts.calendar.unit || ''}` + (ts.calendar.season ? ` | Season: ${ts.calendar.season}` : '') : '');
      svg.appendChild(sub);
    }

    // axis
    const axisG = svgEl('g');
    axisG.appendChild(svgEl('line', { x1: PAD, y1: axisY, x2: WIDTH - PAD, y2: axisY, stroke: isDark() ? '#555' : '#ccc', 'stroke-width': 2 }));
    sorted.forEach(tp => {
      const x = tpX(tp);
      axisG.appendChild(svgEl('line', { x1: x, y1: axisY - 6, x2: x, y2: axisY + 6, stroke: isDark() ? '#888' : '#999', 'stroke-width': 1.5 }));
      const label = svgEl('text', { x, y: axisY + 20, fill: isDark() ? '#aaa' : '#666', 'font-size': 10, 'text-anchor': 'middle' });
      label.textContent = tp;
      axisG.appendChild(label);
    });
    svg.appendChild(axisG);

    // defs
    const defs = svgEl('defs');
    defs.innerHTML = `<linearGradient id="fadeLeft"><stop offset="0%" stop-color="${isDark() ? '#1e1e1e' : '#fff'}" stop-opacity="0.8"/><stop offset="100%" stop-color="${isDark() ? '#1e1e1e' : '#fff'}" stop-opacity="0"/></linearGradient>` +
      `<linearGradient id="fadeRight"><stop offset="0%" stop-color="${isDark() ? '#1e1e1e' : '#fff'}" stop-opacity="0"/><stop offset="100%" stop-color="${isDark() ? '#1e1e1e' : '#fff'}" stop-opacity="0.8"/></linearGradient>`;
    svg.insertBefore(defs, svg.firstChild);

    // scope bars
    if (edges.length) {
      const scopeLabel = svgEl('text', { x: PAD - 8, y: barStartY - 8, fill: isDark() ? '#aaa' : '#666', 'font-size': 11, 'font-weight': '600' });
      scopeLabel.textContent = 'Edge Scopes';
      svg.appendChild(scopeLabel);
    }
    edges.forEach((edge, i) => {
      const y = barStartY + i * (BAR_H + LANE_GAP);
      const range = extractRange(edge.scope);
      if (!range) return;
      const x1 = range.from ? tpX(range.from) : PAD;
      const x2 = range.to ? tpX(range.to) : WIDTH - PAD;
      const col = c(edge.type);

      const barG = svgEl('g', { class: 'scope-bar', cursor: 'pointer', 'data-edge': edge.id });
      barG.addEventListener('click', () => select({ kind: 'edge', id: edge.id }));

      barG.appendChild(svgEl('rect', { x: x1, y, width: Math.max(x2 - x1, 8), height: BAR_H, rx: 4, fill: col, opacity: 0.3 }));
      barG.appendChild(svgEl('rect', { x: x1, y, width: Math.max(x2 - x1, 8), height: BAR_H, rx: 4, fill: 'none', stroke: col, 'stroke-width': 1.5 }));
      if (!range.from) barG.appendChild(svgEl('rect', { x: x1, y, width: 20, height: BAR_H, rx: 4, fill: 'url(#fadeLeft)', opacity: 0.6 }));
      if (!range.to) barG.appendChild(svgEl('rect', { x: x2 - 20, y, width: 20, height: BAR_H, rx: 4, fill: 'url(#fadeRight)', opacity: 0.6 }));

      const label = svgEl('text', { x: x1 + 6, y: y + BAR_H / 2 + 4, fill: isDark() ? '#e0e0e0' : '#333', 'font-size': 10, 'font-weight': '500' });
      label.textContent = `${edge.name} (${edge.source} → ${edge.target})`;
      barG.appendChild(label);
      svg.appendChild(barG);
    });

    // frames
    if (frames.length) {
      const frameLabel = svgEl('text', { x: PAD - 8, y: frameLaneY - 8, fill: isDark() ? '#aaa' : '#666', 'font-size': 11, 'font-weight': '600' });
      frameLabel.textContent = 'Frames';
      svg.appendChild(frameLabel);

      frames.forEach((frame, fi) => {
        const y = frameLaneY + fi * (BAR_H + LANE_GAP);
        const col = isDark() ? '#A5D6A7' : '#388E3C';
        const g = svgEl('g');
        g.appendChild(svgEl('rect', { x: PAD, y, width: WIDTH - PAD * 2, height: BAR_H, rx: 4, fill: col, opacity: 0.1, stroke: col, 'stroke-width': 1, 'stroke-dasharray': '6,3' }));
        const label = svgEl('text', { x: PAD + 8, y: y + BAR_H / 2 + 4, fill: col, 'font-size': 11, 'font-weight': '500' });
        label.textContent = frame.name || frame.id;
        g.appendChild(label);
        if (frame.branches_at && sorted.includes(frame.branches_at)) {
          const bx = tpX(frame.branches_at);
          g.appendChild(svgEl('circle', { cx: bx, cy: y + BAR_H / 2, r: 6, fill: col }));
          const bLabel = svgEl('text', { x: bx + 10, y: y + BAR_H / 2 + 4, fill: col, 'font-size': 9 });
          bLabel.textContent = 'branches at ' + frame.branches_at;
          g.appendChild(bLabel);
        }
        (frame.relations || []).forEach(rel => {
          if (rel.at && sorted.includes(rel.at)) {
            const rx = tpX(rel.at);
            g.appendChild(svgEl('rect', { x: rx - 2, y: y - 2, width: 4, height: BAR_H + 4, fill: col, opacity: 0.6 }));
            const rLabel = svgEl('text', { x: rx + 8, y: y - 4, fill: col, 'font-size': 8 });
            rLabel.textContent = `${rel.type} → ${rel.target}`;
            g.appendChild(rLabel);
          }
        });
        svg.appendChild(g);
      });
    }

    // cross-highlighting for timeline scope bars
    onSelect(sel => {
      svg.querySelectorAll('.scope-bar').forEach(b => b.classList.remove('sel-highlight'));
      if (sel && sel.kind === 'edge') svg.querySelector(`.scope-bar[data-edge="${sel.id}"]`)?.classList.add('sel-highlight');
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 4: LENSES
     ═══════════════════════════════════════════════════════════════════ */
  function renderLenses(container) {
    const lenses = (story.narrative || {}).lenses || [];
    if (!lenses.length) { container.innerHTML = '<p class="empty-msg">No lenses defined.</p>'; return; }

    const grid = document.createElement('div');
    grid.className = 'lens-grid';
    container.appendChild(grid);

    lenses.forEach(lens => {
      const card = document.createElement('div');
      card.className = 'lens-card';
      card.dataset.lens = lens.id;
      card.addEventListener('click', () => select({ kind: 'lens', id: lens.id }));
      card.innerHTML = lensCardHTML(lens);
      grid.appendChild(card);
    });

    onSelect(sel => {
      grid.querySelectorAll('.lens-card').forEach(c => c.classList.remove('sel-highlight'));
      if (sel && sel.kind === 'lens') grid.querySelector(`.lens-card[data-lens="${sel.id}"]`)?.classList.add('sel-highlight');
      if (sel && sel.kind === 'node') {
        lenses.forEach(l => {
          if (l.perspective?.anchor === sel.id ||
              (l.emotional?.bias?.toward || []).includes(sel.id) ||
              (l.reliability?.distorts || []).some(d => d.node === sel.id)) {
            grid.querySelector(`.lens-card[data-lens="${l.id}"]`)?.classList.add('sel-highlight');
          }
        });
      }
    });
  }

  function lensCardHTML(lens) {
    let h = `<h3>${esc(lens.id)}</h3>`;
    const p = lens.perspective || {};
    h += `<div class="lens-row"><strong>Perspective:</strong> <span class="info-badge">${p.type || '?'}</span>`;
    if (p.person) h += ` <span class="info-badge">${p.person} person</span>`;
    h += '</div>';
    if (p.anchor) h += `<div class="lens-row"><strong>Anchor:</strong> <a class="info-link" data-kind="node" data-id="${p.anchor}">${p.anchor}</a></div>`;
    const k = lens.knowledge || {};
    if (k.mode) {
      h += `<div class="lens-row"><strong>Knowledge:</strong> ${k.mode}`;
      if (k.include_subconscious) h += ' <span class="lens-flag">+subconscious</span>';
      if (k.include_wrong_beliefs) h += ' <span class="lens-flag">+wrong beliefs</span>';
      h += '</div>';
    }
    const tp = lens.temporal_position || {};
    if (tp.type) h += `<div class="lens-row"><strong>Temporal:</strong> ${tp.type}</div>`;
    const em = lens.emotional || {};
    if (em.bias) {
      h += `<div class="lens-row"><strong>Bias toward:</strong> ${(em.bias.toward || []).map(id => `<a class="info-link" data-kind="node" data-id="${id}">${id}</a>`).join(', ')}`;
      if (em.bias.bias_strength != null) h += ` (strength: ${em.bias.bias_strength})`;
      h += '</div>';
    }
    const v = lens.voice || {};
    if (v.vocabulary_level || v.sentence_tendency) {
      h += '<div class="lens-row"><strong>Voice:</strong> ';
      const parts = [];
      if (v.vocabulary_level) parts.push(v.vocabulary_level);
      if (v.sentence_tendency) parts.push(v.sentence_tendency);
      if (v.metaphor_density) parts.push('metaphor: ' + v.metaphor_density);
      if (v.inner_monologue) parts.push('inner monologue');
      h += parts.join(', ');
      if (v.verbal_tics && v.verbal_tics.length) h += `<br><em>Tics: "${v.verbal_tics.join('", "')}"</em>`;
      h += '</div>';
    }
    const r = lens.reliability || {};
    if (r.level) {
      const relColors = { RELIABLE: '#66BB6A', SELECTIVE: '#FFB300', UNRELIABLE: '#FFA726', LYING: '#EF5350' };
      h += `<div class="lens-row"><strong>Reliability:</strong> <span class="info-badge" style="background:${relColors[r.level] || '#999'}">${r.level}</span>`;
      if (r.omits && r.omits.length) h += `<br>Omits: ${r.omits.map(id => `<span class="lens-omit">${id}</span>`).join(', ')}`;
      if (r.distorts && r.distorts.length) h += `<br>Distorts: ${r.distorts.map(d => `<span class="lens-distort ${d.direction.toLowerCase()}">${d.node} ${d.direction === 'POSITIVE' ? '↑' : '↓'}</span>`).join(', ')}`;
      h += '</div>';
    }
    return h;
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 5: FORMATS
     ═══════════════════════════════════════════════════════════════════ */
  function renderFormats(container) {
    const formats = (story.narrative || {}).formats || [];
    if (!formats.length) { container.innerHTML = '<p class="empty-msg">No formats defined.</p>'; return; }
    formats.forEach(fmt => {
      const card = document.createElement('div');
      card.className = 'format-card';
      card.innerHTML = formatDetailHTML(fmt);
      container.appendChild(card);
    });
  }

  function formatDetailHTML(fmt) {
    let h = `<h3>${esc(fmt.name || fmt.id)}</h3><span class="info-badge">${fmt.type}</span>`;
    h += '<div class="format-tree">' + renderStructureLevel(fmt.structure, 0) + '</div>';
    if (fmt.settings) h += '<div class="format-settings"><strong>Settings:</strong><pre>' + esc(JSON.stringify(fmt.settings, null, 2)) + '</pre></div>';
    return h;
  }

  function renderStructureLevel(s, depth) {
    if (!s) return '';
    const indent = depth * 20;
    let h = `<div class="structure-level" style="margin-left:${indent}px"><span class="structure-type">${esc(s.type)}</span>`;
    if (s.constraints) {
      const parts = Object.entries(s.constraints).map(([k, v]) => `${k}: ${v}`);
      h += ` <span class="structure-constraints">${parts.join(' | ')}</span>`;
    }
    h += '</div>';
    if (s.children) h += renderStructureLevel(s.children, depth + 1);
    return h;
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 6: CONSTRAINTS
     ═══════════════════════════════════════════════════════════════════ */
  function renderConstraints(container) {
    const constraints = (story.world || {}).constraints || [];
    if (!constraints.length) { container.innerHTML = '<p class="empty-msg">No constraints defined.</p>'; return; }
    const groups = { ERROR: [], WARNING: [], INFO: [] };
    constraints.forEach(c => (groups[c.severity] || groups.INFO).push(c));
    ['ERROR', 'WARNING', 'INFO'].forEach(sev => {
      if (!groups[sev].length) return;
      const section = document.createElement('div');
      section.className = 'constraint-section';
      section.innerHTML = `<h3 class="severity-${sev.toLowerCase()}">${sev}</h3>`;
      groups[sev].forEach(con => {
        const card = document.createElement('div');
        card.className = `constraint-card severity-${sev.toLowerCase()}`;
        let h = `<h4>${esc(con.name)}</h4><p>${esc(con.description || '')}</p>`;
        if (con.scope) h += `<div class="info-scope">${renderScope(con.scope)}</div>`;
        card.innerHTML = h;
        section.appendChild(card);
      });
      container.appendChild(section);
    });
  }

  /* ── detail HTML builders ──────────────────────────────────────── */
  function nodeDetailHTML(node) {
    let h = `<h4>${esc(node.name)}</h4><span class="info-badge" style="background:${c(node.type)}">${node.type}</span>`;
    if (node.description) h += `<p class="info-desc">${esc(node.description)}</p>`;
    if (node.tags && node.tags.length) h += `<div class="info-tags">${node.tags.map(t => `<span class="info-tag">${esc(t)}</span>`).join('')}</div>`;
    if (node.properties) h += `<table class="info-props">${Object.entries(node.properties).map(([k,v]) => `<tr><td>${esc(k)}</td><td>${esc(JSON.stringify(v))}</td></tr>`).join('')}</table>`;
    return h;
  }

  function edgeDetailHTML(edge) {
    let h = `<h4>${esc(edge.name)}</h4><span class="info-badge" style="background:${c(edge.type)}">${edge.type}</span>`;
    h += `<p><strong>${esc(edge.source)}</strong> &rarr; <strong>${esc(edge.target)}</strong></p>`;
    if (edge.description) h += `<p class="info-desc">${esc(edge.description)}</p>`;
    if (edge.scope) h += `<div class="info-scope"><strong>Scope:</strong> ${renderScope(edge.scope)}</div>`;
    return h;
  }

  function beatDetailHTML(beat) {
    let h = `<h4>${esc(beat.name)}</h4>`;
    if (beat.function) h += `<span class="info-badge" style="background:${FUNC_COLORS[beat.function] || '#999'}">${beat.function}</span>`;
    if (beat.description) h += `<p class="info-desc">${esc(beat.description)}</p>`;
    if (beat.tension != null) h += `<p><strong>Tension:</strong> ${beat.tension}</p>`;
    if (beat.emotional_target != null) h += `<p><strong>Emotional target:</strong> ${beat.emotional_target}</p>`;
    if (beat.node_ids) h += `<p><strong>Nodes:</strong> ${beat.node_ids.map(id => `<a class="info-link" data-kind="node" data-id="${id}">${id}</a>`).join(', ')}</p>`;
    if (beat.edge_ids) h += `<p><strong>Edges:</strong> ${beat.edge_ids.map(id => `<a class="info-link" data-kind="edge" data-id="${id}">${id}</a>`).join(', ')}</p>`;
    if (beat.reveals && beat.reveals.length) h += `<p><strong>Reveals:</strong> ${beat.reveals.map(r => `${r.target} (${r.degree || 'FULL'})`).join(', ')}</p>`;
    if (beat.transition) h += `<p><strong>Transition:</strong> ${beat.transition.type}</p>`;
    return h;
  }

  function threadDetailHTML(thread) {
    let h = `<h4>${esc(thread.name)}</h4><span class="info-badge">${thread.type}</span>`;
    if (thread.description) h += `<p class="info-desc">${esc(thread.description)}</p>`;
    if (thread.appearances) {
      h += '<ul class="appearance-list">';
      thread.appearances.forEach(a => { h += `<li><a class="info-link" data-kind="beat" data-id="${a.beat_id}"><strong>${a.beat_id}</strong></a>: ${esc(a.description || '')}</li>`; });
      h += '</ul>';
    }
    return h;
  }

  function deviceDetailHTML(dev) {
    let h = `<h4>${esc(dev.id)}</h4><span class="info-badge">${dev.type}</span>`;
    if (dev.description) h += `<p class="info-desc">${esc(dev.description)}</p>`;
    if (dev.setup) h += `<p><strong>Setup:</strong> ${dev.setup.map(id => `<a class="info-link" data-kind="beat" data-id="${id}">${id}</a>`).join(', ')}</p>`;
    if (dev.payoff) h += `<p><strong>Payoff:</strong> ${dev.payoff.map(id => `<a class="info-link" data-kind="beat" data-id="${id}">${id}</a>`).join(', ')}</p>`;
    return h;
  }

  /* ── helpers ────────────────────────────────────────────────────── */
  function esc(s) { if (typeof s !== 'string') s = String(s || ''); const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + '\u2026' : s; }

  function createSVG(w, h) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.style.width = w + 'px'; svg.style.minWidth = w + 'px';
    return svg;
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function renderScope(scope) {
    if (!scope) return '';
    if (scope.type && scope.item) return `<code>${scope.type}: ${scope.item}</code>`;
    if (scope.and) return '(' + scope.and.map(renderScope).join(' AND ') + ')';
    if (scope.or) return '(' + scope.or.map(renderScope).join(' OR ') + ')';
    if (scope.not) return 'NOT ' + renderScope(scope.not);
    if (scope.in) return 'IN [' + scope.in.map(renderScope).join(', ') + ']';
    if (scope.range) {
      const from = scope.range.from ? renderScope(scope.range.from) : '∞';
      const to = scope.range.to ? renderScope(scope.range.to) : '∞';
      return `${from} → ${to}`;
    }
    return JSON.stringify(scope);
  }

  function extractRange(scope) {
    if (!scope) return null;
    if (scope.range) return { from: scope.range.from?.item || null, to: scope.range.to?.item || null };
    if (scope.and) { for (const s of scope.and) { const r = extractRange(s); if (r) return r; } }
    if (scope.or) { for (const s of scope.or) { const r = extractRange(s); if (r) return r; } }
    return null;
  }

  function collectTimePoints(scope, set) {
    if (!scope) return;
    if (scope.type === 'time' && scope.item) { set.add(scope.item); return; }
    if (scope.range) { if (scope.range.from) collectTimePoints(scope.range.from, set); if (scope.range.to) collectTimePoints(scope.range.to, set); return; }
    if (scope.and) scope.and.forEach(s => collectTimePoints(s, set));
    if (scope.or) scope.or.forEach(s => collectTimePoints(s, set));
    if (scope.not) collectTimePoints(scope.not, set);
    if (scope.in) scope.in.forEach(s => collectTimePoints(s, set));
  }

  // delegate clicks on info-links
  root.addEventListener('click', e => {
    const link = e.target.closest('.info-link');
    if (link) { e.preventDefault(); select({ kind: link.dataset.kind, id: link.dataset.id }); }
  });

})();
