(function () {
  'use strict';

  const root = document.getElementById('story-graph');
  if (!root) return;

  /* ── colour palette (auto-assigned, no hardcoded shapes) ───────── */
  const ASSIGNED = {};
  const PALETTE = ['#7E57C2','#26A69A','#FFB300','#EF5350','#78909C','#5C6BC0','#EC407A','#8D6E63','#66BB6A','#42A5F5','#AB47BC','#FFA726','#26C6DA','#D4E157'];
  let _pi = 0;
  function colorFor(type) {
    if (ASSIGNED[type]) return ASSIGNED[type];
    ASSIGNED[type] = { light: PALETTE[_pi % PALETTE.length], dark: PALETTE[(_pi + 7) % PALETTE.length] };
    _pi++;
    return ASSIGNED[type];
  }
  function isDark() { return document.body.getAttribute('data-md-color-scheme') === 'slate'; }
  function c(type) { const cl = colorFor(type); return isDark() ? cl.dark : cl.light; }

  const FUNC_COLORS = {
    HOOK: '#42A5F5', INCITING_INCIDENT: '#66BB6A', RISING_ACTION: '#FFB300',
    FIRST_THRESHOLD: '#FFA726', PINCH_POINT: '#FF7043', MIDPOINT: '#AB47BC',
    CRISIS: '#EF5350', CLIMAX: '#D32F2F', RESOLUTION: '#26A69A',
    DENOUEMENT: '#78909C', CUSTOM: '#BDBDBD',
  };
  const DEVICE_COLORS = { FORESHADOWING: '#42A5F5', RED_HERRING: '#EF5350', SETUP_PAYOFF: '#FFA726', CHEKHOV_GUN: '#66BB6A', DRAMATIC_IRONY: '#AB47BC', ECHO: '#78909C', CONTRAST: '#EC407A', PARALLEL: '#26C6DA', CALLBACK: '#8D6E63', CUSTOM: '#BDBDBD' };

  /* ── state ─────────────────────────────────────────────────────── */
  let story = null;
  let selected = null;
  const listeners = [];
  function select(sel) {
    if (selected && sel && selected.kind === sel.kind && selected.id === sel.id) selected = null;
    else selected = sel;
    listeners.forEach(fn => fn(selected));
  }
  function onSelect(fn) { listeners.push(fn); }

  /* ── relevance engine: compute which IDs are "related" ─────────── */
  function relatedIds(sel) {
    if (!sel) return null; // null = no filtering
    const ids = { nodes: new Set(), edges: new Set(), beats: new Set(), threads: new Set(), devices: new Set(), lenses: new Set() };
    const w = story.world || {}, n = story.narrative || {};
    const beats = n.beats || [], threads = n.threads || [], devices = n.devices || [], lenses = n.lenses || [];

    if (sel.kind === 'node') {
      ids.nodes.add(sel.id);
      // connected edges
      (w.edges || []).forEach(e => { if (e.source === sel.id || e.target === sel.id) { ids.edges.add(e.id); ids.nodes.add(e.source); ids.nodes.add(e.target); }});
      // beats referencing node
      beats.forEach(b => { if ((b.node_ids || []).includes(sel.id)) ids.beats.add(b.id); });
      // lenses
      lenses.forEach(l => {
        if (l.perspective?.anchor === sel.id || (l.emotional?.bias?.toward || []).includes(sel.id) || (l.reliability?.distorts || []).some(d => d.node === sel.id))
          ids.lenses.add(l.id);
      });
    } else if (sel.kind === 'edge') {
      const edge = (w.edges || []).find(e => e.id === sel.id);
      if (edge) { ids.edges.add(sel.id); ids.nodes.add(edge.source); ids.nodes.add(edge.target); }
      beats.forEach(b => { if ((b.edge_ids || []).includes(sel.id)) ids.beats.add(b.id); });
    } else if (sel.kind === 'beat') {
      ids.beats.add(sel.id);
      const beat = beats.find(b => b.id === sel.id);
      if (beat) {
        (beat.node_ids || []).forEach(id => ids.nodes.add(id));
        (beat.edge_ids || []).forEach(id => {
          ids.edges.add(id);
          const e = (w.edges || []).find(e => e.id === id);
          if (e) { ids.nodes.add(e.source); ids.nodes.add(e.target); }
        });
      }
      threads.forEach(t => { if ((t.appearances || []).some(a => a.beat_id === sel.id)) ids.threads.add(t.id); });
      devices.forEach(d => { if ((d.setup || []).includes(sel.id) || (d.payoff || []).includes(sel.id)) ids.devices.add(d.id); });
    } else if (sel.kind === 'thread') {
      ids.threads.add(sel.id);
      const thread = threads.find(t => t.id === sel.id);
      if (thread) (thread.appearances || []).forEach(a => {
        ids.beats.add(a.beat_id);
        const b = beats.find(b => b.id === a.beat_id);
        if (b) (b.node_ids || []).forEach(id => ids.nodes.add(id));
      });
    } else if (sel.kind === 'device') {
      ids.devices.add(sel.id);
      const dev = devices.find(d => d.id === sel.id);
      if (dev) [...(dev.setup || []), ...(dev.payoff || [])].forEach(id => {
        ids.beats.add(id);
        const b = beats.find(b => b.id === id);
        if (b) (b.node_ids || []).forEach(nid => ids.nodes.add(nid));
      });
    } else if (sel.kind === 'lens') {
      ids.lenses.add(sel.id);
      const lens = lenses.find(l => l.id === sel.id);
      if (lens) {
        if (lens.perspective?.anchor) ids.nodes.add(lens.perspective.anchor);
        (lens.emotional?.bias?.toward || []).forEach(id => ids.nodes.add(id));
        (lens.reliability?.distorts || []).forEach(d => ids.nodes.add(d.node));
      }
    }
    return ids;
  }

  /* ── data loading ──────────────────────────────────────────────── */
  const src = root.getAttribute('data-src');
  if (!src) { root.innerHTML = '<p>No data-src attribute.</p>'; return; }
  fetch(src).then(r => r.json()).then(data => { story = data; init(); })
    .catch(e => { root.innerHTML = '<p>Failed to load story: ' + e.message + '</p>'; });

  /* ── init ───────────────────────────────────────────────────────── */
  let cy = null;
  const detailPanel = () => root.querySelector('#detail-panel');

  function init() {
    // pre-assign colors for all types found in data
    const w = story.world || {}, n = story.narrative || {};
    (w.nodes || []).forEach(nd => colorFor(nd.type));
    (w.edges || []).forEach(e => colorFor(e.type));

    renderAllSections();
    setupDetailPanel();

    new MutationObserver(() => renderAllSections()).observe(document.body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
  }

  function renderAllSections() {
    root.querySelectorAll('.graph-section').forEach(sec => {
      const content = sec.querySelector('.section-content');
      content.innerHTML = '';
      switch (sec.dataset.view) {
        case 'world': renderWorld(content); break;
        case 'narrative': renderNarrative(content); break;
        case 'timeline': renderTimeline(content); break;
        case 'lenses': renderLenses(content); break;
        case 'formats': renderFormats(content); break;
        case 'constraints': renderConstraints(content); break;
      }
    });
  }

  function setupDetailPanel() {
    onSelect(sel => {
      const dp = detailPanel();
      if (!sel) { dp.innerHTML = ''; dp.classList.remove('open'); return; }
      dp.classList.add('open');
      const w = story.world || {}, n = story.narrative || {};
      let html = '';
      if (sel.kind === 'node') { const nd = (w.nodes || []).find(x => x.id === sel.id); if (nd) html = nodeDetailHTML(nd); }
      else if (sel.kind === 'edge') { const e = (w.edges || []).find(x => x.id === sel.id); if (e) html = edgeDetailHTML(e); }
      else if (sel.kind === 'beat') { const b = (n.beats || []).find(x => x.id === sel.id); if (b) html = beatDetailHTML(b); }
      else if (sel.kind === 'thread') { const t = (n.threads || []).find(x => x.id === sel.id); if (t) html = threadDetailHTML(t); }
      else if (sel.kind === 'device') { const d = (n.devices || []).find(x => x.id === sel.id); if (d) html = deviceDetailHTML(d); }
      else if (sel.kind === 'lens') { const l = (n.lenses || []).find(x => x.id === sel.id); if (l) html = lensCardHTML(l); }
      dp.innerHTML = '<button class="detail-close">&times;</button>' + html;
      dp.querySelector('.detail-close').addEventListener('click', () => select(null));
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 1: WORLD GRAPH
     ═══════════════════════════════════════════════════════════════════ */
  function renderWorld(container) {
    const w = story.world || {};
    const nodes = w.nodes || [], edges = w.edges || [];

    const filterBar = document.createElement('div');
    filterBar.className = 'world-filters';
    const nodeTypes = [...new Set(nodes.map(n => n.type))];
    const edgeTypes = [...new Set(edges.map(e => e.type))];
    filterBar.innerHTML = '<span class="filter-label">Nodes:</span>' +
      nodeTypes.map(t => `<label class="filter-chip" style="--chip-color:${c(t)}"><input type="checkbox" checked data-filter="node-${t}"> ${t}</label>`).join('') +
      '<span class="filter-label">Edges:</span>' +
      edgeTypes.map(t => `<label class="filter-chip" style="--chip-color:${c(t)}"><input type="checkbox" checked data-filter="edge-${t}"> ${t}</label>`).join('');
    container.appendChild(filterBar);

    const cyDiv = document.createElement('div');
    cyDiv.className = 'cy-container';
    container.appendChild(cyDiv);

    // deterministic initial positions: group by type in a wide circle
    const typeGroups = {};
    nodes.forEach(n => { (typeGroups[n.type] = typeGroups[n.type] || []).push(n); });
    const typeKeys = Object.keys(typeGroups);
    const initPos = {};
    const R = 240; // radius of type group ring
    typeKeys.forEach((type, ti) => {
      const angle = (2 * Math.PI * ti) / typeKeys.length - Math.PI / 2;
      const cx = R * Math.cos(angle), cy = R * Math.sin(angle);
      const group = typeGroups[type];
      const spread = 40 + group.length * 16;
      group.forEach((n, ni) => {
        const ga = (2 * Math.PI * ni) / group.length;
        initPos[n.id] = { x: cx + spread * Math.cos(ga), y: cy + spread * Math.sin(ga) };
      });
    });

    const elements = [];
    nodes.forEach(n => elements.push({ group: 'nodes', data: { id: n.id, label: n.name || n.id, type: n.type }, classes: n.type, position: initPos[n.id] }));
    edges.forEach(e => elements.push({ group: 'edges', data: { id: e.id, source: e.source, target: e.target, label: e.name || '', type: e.type, hasScope: !!e.scope }, classes: e.type }));

    const dk = isDark(), bg = dk ? '#1e1e1e' : '#fafafa', textCol = dk ? '#ccc' : '#444';
    const styles = [
      { selector: 'node', style: { 'label': 'data(label)', 'font-size': 10, 'color': textCol, 'text-valign': 'bottom', 'text-margin-y': 5, 'width': 34, 'height': 34, 'border-width': 2, 'border-color': dk ? '#666' : '#ccc', 'text-wrap': 'ellipsis', 'text-max-width': 90, 'shape': 'ellipse' }},
      { selector: 'edge', style: { 'width': 1.5, 'curve-style': 'bezier', 'target-arrow-shape': 'triangle', 'target-arrow-color': '#bbb', 'line-color': '#bbb', 'opacity': 0.6 }},
      { selector: 'edge[?hasScope]', style: { 'line-style': 'dashed', 'line-dash-pattern': [5, 3] }},
      { selector: '.dimmed', style: { 'opacity': 0.12 }},
      { selector: '.highlighted', style: { 'opacity': 1 }},
      { selector: '.filtered-out', style: { 'display': 'none' }},
    ];
    nodeTypes.forEach(type => styles.push({ selector: 'node.' + type, style: { 'background-color': c(type) }}));
    edgeTypes.forEach(type => styles.push({ selector: 'edge.' + type, style: { 'line-color': c(type), 'target-arrow-color': c(type) }}));

    cy = cytoscape({ container: cyDiv, elements, style: styles, layout: { name: 'preset', fit: true, padding: 40 }, minZoom: 0.1, maxZoom: 3 });

    cy.on('tap', 'node', e => select({ kind: 'node', id: e.target.id() }));
    cy.on('tap', 'edge', e => select({ kind: 'edge', id: e.target.id() }));
    cy.on('tap', e => { if (e.target === cy) select(null); });

    // hover: neighbourhood highlight
    cy.on('mouseover', 'node', e => { const nb = e.target.closedNeighborhood(); cy.elements().not(nb).addClass('dimmed'); nb.addClass('highlighted'); });
    cy.on('mouseout', 'node', () => cy.elements().removeClass('dimmed highlighted'));
    cy.on('mouseover', 'edge', e => { const c = e.target.connectedNodes().union(e.target); cy.elements().not(c).addClass('dimmed'); c.addClass('highlighted'); });
    cy.on('mouseout', 'edge', () => cy.elements().removeClass('dimmed highlighted'));

    // selection: global grey-out
    onSelect(sel => {
      if (!cy) return;
      cy.elements().removeClass('dimmed highlighted');
      const rel = relatedIds(sel);
      if (!rel) return;
      cy.nodes().forEach(n => { if (!rel.nodes.has(n.id())) n.addClass('dimmed'); });
      cy.edges().forEach(e => { if (!rel.edges.has(e.id())) e.addClass('dimmed'); });
    });

    filterBar.querySelectorAll('input[type=checkbox]').forEach(cb => cb.addEventListener('change', () => {
      const [kind, type] = cb.dataset.filter.split('-');
      (kind === 'node' ? cy.nodes('.' + type) : cy.edges('.' + type)).toggleClass('filtered-out', !cb.checked);
    }));
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 2: NARRATIVE FLOW (no stepper, just clickable)
     ═══════════════════════════════════════════════════════════════════ */
  function renderNarrative(container) {
    const n = story.narrative || {};
    const beats = (n.beats || []).filter(b => b.order != null).sort((a, b) => a.order - b.order);
    const threads = n.threads || [], devices = n.devices || [];
    if (!beats.length) { container.innerHTML = '<p class="empty-msg">No beats with order defined.</p>'; return; }

    const CARD_W = 130, CARD_H = 96, GAP = 18, PAD = 50;
    const totalW = beats.length * (CARD_W + GAP) - GAP + PAD * 2;
    const threadH = 22, deviceArcH = 50, tensionH = 60;
    const totalH = deviceArcH + tensionH + CARD_H + 16 + threads.length * threadH + PAD;

    const wrapper = document.createElement('div');
    wrapper.className = 'narrative-scroll';
    container.appendChild(wrapper);
    const svg = createSVG(totalW, totalH);
    wrapper.appendChild(svg);

    const beatX = i => PAD + i * (CARD_W + GAP) + CARD_W / 2;
    const tensionBaseline = deviceArcH + tensionH;

    // tension curve
    let tensionPath = '';
    beats.forEach((b, i) => {
      const x = beatX(i), y = tensionBaseline - (b.tension || 0) * (tensionH - 8);
      tensionPath += (i === 0 ? 'M' : 'L') + `${x},${y}`;
      const dot = svgEl('circle', { cx: x, cy: y, r: 3, fill: FUNC_COLORS[b.function] || '#999' });
      dot.innerHTML = `<title>${b.name}: tension ${b.tension}</title>`;
      svg.appendChild(dot);
    });
    svg.appendChild(svgEl('path', { d: tensionPath, fill: 'none', stroke: isDark() ? '#B39DDB' : '#7E57C2', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    svg.appendChild(svgEl('line', { x1: PAD, y1: tensionBaseline, x2: totalW - PAD, y2: tensionBaseline, stroke: isDark() ? '#444' : '#ddd', 'stroke-width': 1 }));
    const tLabel = svgEl('text', { x: 8, y: tensionBaseline - tensionH / 2, fill: isDark() ? '#666' : '#bbb', 'font-size': 8, 'writing-mode': 'tb', 'text-anchor': 'middle' });
    tLabel.textContent = 'Tension';
    svg.appendChild(tLabel);

    // device arcs
    devices.forEach((dev, di) => {
      const setupIdxs = (dev.setup || []).map(id => beats.findIndex(b => b.id === id)).filter(i => i >= 0);
      const payoffIdxs = (dev.payoff || []).map(id => beats.findIndex(b => b.id === id)).filter(i => i >= 0);
      const col = DEVICE_COLORS[dev.type] || '#999';
      setupIdxs.forEach(si => payoffIdxs.forEach(pi => {
        const x1 = beatX(si), x2 = beatX(pi), midX = (x1 + x2) / 2, arcY = deviceArcH - 8 - di * 14;
        const arc = svgEl('path', { d: `M${x1},${tensionBaseline - tensionH} Q${midX},${arcY} ${x2},${tensionBaseline - tensionH}`, fill: 'none', stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': dev.type === 'CHEKHOV_GUN' ? '6,3' : 'none', class: 'device-arc', 'data-device': dev.id, cursor: 'pointer' });
        arc.addEventListener('click', () => select({ kind: 'device', id: dev.id }));
        svg.appendChild(arc);
        const label = svgEl('text', { x: midX, y: arcY - 3, fill: col, 'font-size': 7, 'text-anchor': 'middle' });
        label.textContent = dev.type.replace(/_/g, ' ');
        svg.appendChild(label);
      }));
    });

    // beat cards
    beats.forEach((b, i) => {
      const x = PAD + i * (CARD_W + GAP), y = deviceArcH + tensionH;
      const emColor = b.emotional_target != null ? (b.emotional_target < 0 ? `rgba(66,165,245,${Math.abs(b.emotional_target) * 0.2})` : `rgba(255,167,38,${b.emotional_target * 0.2})`) : 'transparent';
      const funcColor = FUNC_COLORS[b.function] || '#999';
      const g = svgEl('g', { class: 'beat-card', 'data-beat': b.id, cursor: 'pointer' });
      g.addEventListener('click', () => select({ kind: 'beat', id: b.id }));

      g.appendChild(svgEl('rect', { x, y, width: CARD_W, height: CARD_H, rx: 6, fill: isDark() ? '#2a2a2a' : '#fff', stroke: funcColor, 'stroke-width': 1.5 }));
      g.appendChild(svgEl('rect', { x: x + 1, y: y + 1, width: CARD_W - 2, height: CARD_H - 2, rx: 5, fill: emColor }));
      g.appendChild(svgEl('rect', { x: x + 3, y: y + 3, width: CARD_W - 6, height: 16, rx: 3, fill: funcColor }));
      const funcText = svgEl('text', { x: x + CARD_W / 2, y: y + 14, fill: '#fff', 'font-size': 7, 'text-anchor': 'middle', 'font-weight': 'bold' });
      funcText.textContent = (b.function || '').replace(/_/g, ' ');
      g.appendChild(funcText);
      const nameText = svgEl('text', { x: x + CARD_W / 2, y: y + 34, fill: isDark() ? '#ddd' : '#333', 'font-size': 10, 'text-anchor': 'middle', 'font-weight': '600' });
      nameText.textContent = truncate(b.name || b.id, 16);
      g.appendChild(nameText);
      const orderText = svgEl('text', { x: x + CARD_W / 2, y: y + 47, fill: isDark() ? '#777' : '#aaa', 'font-size': 8, 'text-anchor': 'middle' });
      orderText.textContent = `#${b.order}`;
      g.appendChild(orderText);
      const barW = (CARD_W - 12) * (b.tension || 0);
      g.appendChild(svgEl('rect', { x: x + 6, y: y + CARD_H - 18, width: CARD_W - 12, height: 4, rx: 2, fill: isDark() ? '#444' : '#eee' }));
      g.appendChild(svgEl('rect', { x: x + 6, y: y + CARD_H - 18, width: barW, height: 4, rx: 2, fill: funcColor }));
      if (b.reveals && b.reveals.length) {
        const revText = svgEl('text', { x: x + CARD_W - 8, y: y + CARD_H - 8, fill: isDark() ? '#FFD54F' : '#FF8F00', 'font-size': 7, 'text-anchor': 'end' });
        revText.textContent = `${b.reveals.length} reveal${b.reveals.length > 1 ? 's' : ''}`;
        g.appendChild(revText);
      }
      svg.appendChild(g);

      // transition arrow
      if (i < beats.length - 1) {
        const ax = x + CARD_W + 1, ay = y + CARD_H / 2;
        svg.appendChild(svgEl('line', { x1: ax, y1: ay, x2: ax + GAP - 3, y2: ay, stroke: isDark() ? '#555' : '#ccc', 'stroke-width': 1 }));
        svg.appendChild(svgEl('polygon', { points: `${ax + GAP - 3},${ay - 2} ${ax + GAP},${ay} ${ax + GAP - 3},${ay + 2}`, fill: isDark() ? '#555' : '#ccc' }));
        if (b.transition) {
          const tl = svgEl('text', { x: ax + GAP / 2, y: ay - 4, fill: isDark() ? '#666' : '#bbb', 'font-size': 6, 'text-anchor': 'middle' });
          tl.textContent = b.transition.type;
          svg.appendChild(tl);
        }
      }
    });

    // thread swim lanes
    const threadBaseY = deviceArcH + tensionH + CARD_H + 16;
    const TCOLS = [isDark() ? '#F48FB1' : '#EC407A', isDark() ? '#90CAF9' : '#42A5F5', isDark() ? '#A5D6A7' : '#66BB6A', isDark() ? '#FFE082' : '#FFB300', isDark() ? '#CE93D8' : '#AB47BC'];
    threads.forEach((thread, ti) => {
      const y = threadBaseY + ti * threadH, col = TCOLS[ti % TCOLS.length];
      const labelEl = svgEl('text', { x: PAD - 6, y: y + threadH / 2 + 3, fill: col, 'font-size': 8, 'text-anchor': 'end', 'font-weight': '500', cursor: 'pointer' });
      labelEl.textContent = truncate(thread.name, 18);
      labelEl.addEventListener('click', () => select({ kind: 'thread', id: thread.id }));
      svg.appendChild(labelEl);
      svg.appendChild(svgEl('line', { x1: PAD, y1: y + threadH / 2, x2: totalW - PAD, y2: y + threadH / 2, stroke: col, 'stroke-width': 1, opacity: 0.2 }));

      const apps = (thread.appearances || []).map(a => ({ ...a, idx: beats.findIndex(b => b.id === a.beat_id) })).filter(a => a.idx >= 0).sort((a, b) => a.idx - b.idx);
      let lp = '';
      apps.forEach((a, ai) => {
        const cx = beatX(a.idx), cy2 = y + threadH / 2;
        lp += (ai === 0 ? 'M' : 'L') + `${cx},${cy2}`;
        const dot = svgEl('circle', { cx, cy: cy2, r: 4, fill: col, cursor: 'pointer', class: 'thread-dot', 'data-thread': thread.id });
        dot.innerHTML = `<title>${esc(a.description || a.beat_id)}</title>`;
        dot.addEventListener('click', ev => { ev.stopPropagation(); select({ kind: 'thread', id: thread.id }); });
        svg.appendChild(dot);
      });
      if (lp) { const line = svgEl('path', { d: lp, fill: 'none', stroke: col, 'stroke-width': 1.5, opacity: 0.4 }); svg.insertBefore(line, svg.querySelector('.beat-card')); }
    });

    // global grey-out for narrative
    onSelect(sel => {
      const rel = relatedIds(sel);
      svg.querySelectorAll('.beat-card').forEach(g => {
        const id = g.getAttribute('data-beat');
        g.classList.toggle('greyed', rel != null && !rel.beats.has(id));
        g.classList.toggle('sel-highlight', rel != null && rel.beats.has(id));
      });
      svg.querySelectorAll('.device-arc').forEach(a => {
        const id = a.getAttribute('data-device');
        a.classList.toggle('greyed', rel != null && !rel.devices.has(id));
      });
      svg.querySelectorAll('.thread-dot').forEach(d => {
        const id = d.getAttribute('data-thread');
        d.classList.toggle('greyed', rel != null && !rel.threads.has(id));
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     VIEW 3: TIMELINE
     ═══════════════════════════════════════════════════════════════════ */
  function renderTimeline(container) {
    const w = story.world || {};
    const ts = w.time_system, frames = w.frames || [];
    const edges = (w.edges || []).filter(e => e.scope);
    if (!ts && !edges.length && !frames.length) { container.innerHTML = '<p class="empty-msg">No time system, frames, or temporal scopes defined.</p>'; return; }

    const timePoints = new Set();
    edges.forEach(e => collectTimePoints(e.scope, timePoints));
    frames.forEach(f => { if (f.branches_at) timePoints.add(f.branches_at); (f.relations || []).forEach(r => { if (r.at) timePoints.add(r.at); }); });
    const sorted = [...timePoints].sort();

    const PAD = 50, BAR_H = 20, LANE_GAP = 6, axisY = 60, barStartY = axisY + 30;
    const WIDTH = Math.max(700, sorted.length * 120 + PAD * 2);
    const frameLaneY = barStartY + edges.length * (BAR_H + LANE_GAP) + 30;
    const totalH = frameLaneY + (frames.length + 1) * (BAR_H + LANE_GAP) + PAD;

    const wrapper = document.createElement('div');
    wrapper.className = 'timeline-scroll';
    container.appendChild(wrapper);
    const svg = createSVG(WIDTH, totalH);
    wrapper.appendChild(svg);
    const tpX = tp => { const idx = sorted.indexOf(tp); return idx >= 0 ? PAD + (idx + 0.5) * ((WIDTH - PAD * 2) / sorted.length) : PAD; };

    // defs
    const defs = svgEl('defs');
    defs.innerHTML = `<linearGradient id="fadeL"><stop offset="0%" stop-color="${isDark() ? '#1e1e1e' : '#fff'}" stop-opacity="0.8"/><stop offset="100%" stop-opacity="0"/></linearGradient><linearGradient id="fadeR"><stop offset="0%" stop-opacity="0"/><stop offset="100%" stop-color="${isDark() ? '#1e1e1e' : '#fff'}" stop-opacity="0.8"/></linearGradient>`;
    svg.appendChild(defs);

    if (ts) {
      const title = svgEl('text', { x: PAD, y: 22, fill: isDark() ? '#ddd' : '#333', 'font-size': 13, 'font-weight': 'bold' });
      title.textContent = ts.name || 'Timeline';
      svg.appendChild(title);
      const sub = svgEl('text', { x: PAD, y: 36, fill: isDark() ? '#777' : '#999', 'font-size': 10 });
      sub.textContent = `${ts.type}` + (ts.calendar ? ` | ${ts.calendar.unit || ''}` + (ts.calendar.season ? ` | ${ts.calendar.season}` : '') : '');
      svg.appendChild(sub);
    }

    svg.appendChild(svgEl('line', { x1: PAD, y1: axisY, x2: WIDTH - PAD, y2: axisY, stroke: isDark() ? '#444' : '#ccc', 'stroke-width': 1.5 }));
    sorted.forEach(tp => {
      const x = tpX(tp);
      svg.appendChild(svgEl('line', { x1: x, y1: axisY - 4, x2: x, y2: axisY + 4, stroke: isDark() ? '#666' : '#999', 'stroke-width': 1 }));
      const l = svgEl('text', { x, y: axisY + 14, fill: isDark() ? '#999' : '#666', 'font-size': 8, 'text-anchor': 'middle' });
      l.textContent = tp;
      svg.appendChild(l);
    });

    edges.forEach((edge, i) => {
      const y = barStartY + i * (BAR_H + LANE_GAP);
      const range = extractRange(edge.scope);
      if (!range) return;
      const x1 = range.from ? tpX(range.from) : PAD, x2 = range.to ? tpX(range.to) : WIDTH - PAD;
      const col = c(edge.type);
      const g = svgEl('g', { class: 'scope-bar', cursor: 'pointer', 'data-edge': edge.id });
      g.addEventListener('click', () => select({ kind: 'edge', id: edge.id }));
      g.appendChild(svgEl('rect', { x: x1, y, width: Math.max(x2 - x1, 6), height: BAR_H, rx: 3, fill: col, opacity: 0.25 }));
      g.appendChild(svgEl('rect', { x: x1, y, width: Math.max(x2 - x1, 6), height: BAR_H, rx: 3, fill: 'none', stroke: col, 'stroke-width': 1 }));
      if (!range.from) g.appendChild(svgEl('rect', { x: x1, y, width: 16, height: BAR_H, rx: 3, fill: 'url(#fadeL)' }));
      if (!range.to) g.appendChild(svgEl('rect', { x: x2 - 16, y, width: 16, height: BAR_H, rx: 3, fill: 'url(#fadeR)' }));
      const label = svgEl('text', { x: x1 + 4, y: y + BAR_H / 2 + 3, fill: isDark() ? '#ddd' : '#333', 'font-size': 8 });
      label.textContent = `${edge.name} (${edge.source} → ${edge.target})`;
      g.appendChild(label);
      svg.appendChild(g);
    });

    if (frames.length) {
      frames.forEach((frame, fi) => {
        const y = frameLaneY + fi * (BAR_H + LANE_GAP), col = isDark() ? '#A5D6A7' : '#388E3C';
        svg.appendChild(svgEl('rect', { x: PAD, y, width: WIDTH - PAD * 2, height: BAR_H, rx: 3, fill: col, opacity: 0.08, stroke: col, 'stroke-width': 1, 'stroke-dasharray': '5,3' }));
        const l = svgEl('text', { x: PAD + 6, y: y + BAR_H / 2 + 3, fill: col, 'font-size': 9 });
        l.textContent = frame.name || frame.id;
        svg.appendChild(l);
      });
    }

    onSelect(sel => {
      const rel = relatedIds(sel);
      svg.querySelectorAll('.scope-bar').forEach(b => {
        const id = b.getAttribute('data-edge');
        b.classList.toggle('greyed', rel != null && !rel.edges.has(id));
      });
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
      const rel = relatedIds(sel);
      grid.querySelectorAll('.lens-card').forEach(c => {
        const id = c.dataset.lens;
        c.classList.toggle('greyed', rel != null && !rel.lenses.has(id));
        c.classList.toggle('sel-highlight', rel != null && rel.lenses.has(id));
      });
    });
  }

  function lensCardHTML(lens) {
    let h = `<h4>${esc(lens.id)}</h4>`;
    const p = lens.perspective || {};
    h += `<div class="lens-row"><strong>Perspective:</strong> <span class="info-badge">${p.type || '?'}</span>`;
    if (p.person) h += ` <span class="info-badge">${p.person} person</span>`;
    h += '</div>';
    if (p.anchor) h += `<div class="lens-row"><strong>Anchor:</strong> <a class="info-link" data-kind="node" data-id="${p.anchor}">${p.anchor}</a></div>`;
    const k = lens.knowledge || {};
    if (k.mode) { h += `<div class="lens-row"><strong>Knowledge:</strong> ${k.mode}`; if (k.include_subconscious) h += ' <span class="lens-flag">+subconscious</span>'; if (k.include_wrong_beliefs) h += ' <span class="lens-flag">+wrong beliefs</span>'; h += '</div>'; }
    const tp = lens.temporal_position || {};
    if (tp.type) h += `<div class="lens-row"><strong>Temporal:</strong> ${tp.type}</div>`;
    const em = lens.emotional || {};
    if (em.bias) { h += `<div class="lens-row"><strong>Bias toward:</strong> ${(em.bias.toward || []).map(id => `<a class="info-link" data-kind="node" data-id="${id}">${id}</a>`).join(', ')}`; if (em.bias.bias_strength != null) h += ` (${em.bias.bias_strength})`; h += '</div>'; }
    const v = lens.voice || {};
    if (v.vocabulary_level || v.sentence_tendency) { h += '<div class="lens-row"><strong>Voice:</strong> '; const pts = []; if (v.vocabulary_level) pts.push(v.vocabulary_level); if (v.sentence_tendency) pts.push(v.sentence_tendency); if (v.metaphor_density) pts.push('metaphor: ' + v.metaphor_density); if (v.inner_monologue) pts.push('inner monologue'); h += pts.join(', '); if (v.verbal_tics?.length) h += `<br><em>"${v.verbal_tics.join('", "')}"</em>`; h += '</div>'; }
    const r = lens.reliability || {};
    if (r.level) { const rc = { RELIABLE: '#66BB6A', SELECTIVE: '#FFB300', UNRELIABLE: '#FFA726', LYING: '#EF5350' }; h += `<div class="lens-row"><strong>Reliability:</strong> <span class="info-badge" style="background:${rc[r.level] || '#999'}">${r.level}</span>`; if (r.distorts?.length) h += `<br>Distorts: ${r.distorts.map(d => `<span class="lens-distort ${d.direction.toLowerCase()}">${d.node} ${d.direction === 'POSITIVE' ? '↑' : '↓'}</span>`).join(', ')}`; h += '</div>'; }
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
      let h = `<h4>${esc(fmt.name || fmt.id)}</h4><span class="info-badge">${fmt.type}</span>`;
      h += '<div class="format-tree">' + renderStructureLevel(fmt.structure, 0) + '</div>';
      if (fmt.settings) h += '<div class="format-settings"><strong>Settings:</strong><pre>' + esc(JSON.stringify(fmt.settings, null, 2)) + '</pre></div>';
      card.innerHTML = h;
      container.appendChild(card);
    });
  }
  function renderStructureLevel(s, depth) {
    if (!s) return '';
    let h = `<div class="structure-level" style="margin-left:${depth * 16}px"><span class="structure-type">${esc(s.type)}</span>`;
    if (s.constraints) h += ` <span class="structure-constraints">${Object.entries(s.constraints).map(([k, v]) => `${k}: ${v}`).join(' | ')}</span>`;
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
      const sec = document.createElement('div');
      sec.innerHTML = `<h4 class="severity-${sev.toLowerCase()}">${sev}</h4>`;
      groups[sev].forEach(con => {
        const card = document.createElement('div');
        card.className = `constraint-card severity-${sev.toLowerCase()}`;
        card.innerHTML = `<strong>${esc(con.name)}</strong><p>${esc(con.description || '')}</p>` + (con.scope ? `<div class="info-scope">${renderScope(con.scope)}</div>` : '');
        sec.appendChild(card);
      });
      container.appendChild(sec);
    });
  }

  /* ── detail HTML builders ──────────────────────────────────────── */
  function nodeDetailHTML(node) {
    let h = `<h4>${esc(node.name)}</h4><span class="info-badge" style="background:${c(node.type)}">${node.type}</span>`;
    if (node.description) h += `<p class="info-desc">${esc(node.description)}</p>`;
    if (node.tags?.length) h += `<div class="info-tags">${node.tags.map(t => `<span class="info-tag">${esc(t)}</span>`).join('')}</div>`;
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
    if (beat.emotional_target != null) h += `<p><strong>Emotional:</strong> ${beat.emotional_target}</p>`;
    if (beat.node_ids) h += `<p><strong>Nodes:</strong> ${beat.node_ids.map(id => `<a class="info-link" data-kind="node" data-id="${id}">${id}</a>`).join(', ')}</p>`;
    if (beat.edge_ids) h += `<p><strong>Edges:</strong> ${beat.edge_ids.map(id => `<a class="info-link" data-kind="edge" data-id="${id}">${id}</a>`).join(', ')}</p>`;
    if (beat.reveals?.length) h += `<p><strong>Reveals:</strong> ${beat.reveals.map(r => `${r.target} (${r.degree || 'FULL'})`).join(', ')}</p>`;
    if (beat.transition) h += `<p><strong>Transition:</strong> ${beat.transition.type}</p>`;
    return h;
  }
  function threadDetailHTML(thread) {
    let h = `<h4>${esc(thread.name)}</h4><span class="info-badge">${thread.type}</span>`;
    if (thread.description) h += `<p class="info-desc">${esc(thread.description)}</p>`;
    if (thread.appearances) { h += '<ul class="appearance-list">'; thread.appearances.forEach(a => { h += `<li><a class="info-link" data-kind="beat" data-id="${a.beat_id}"><strong>${a.beat_id}</strong></a>: ${esc(a.description || '')}</li>`; }); h += '</ul>'; }
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
  function createSVG(w, h) { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('width', w); s.setAttribute('height', h); s.setAttribute('viewBox', `0 0 ${w} ${h}`); s.style.width = w + 'px'; s.style.minWidth = w + 'px'; return s; }
  function svgEl(tag, attrs) { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); return el; }

  function renderScope(scope) {
    if (!scope) return '';
    if (scope.type && scope.item) return `<code>${scope.type}: ${scope.item}</code>`;
    if (scope.and) return '(' + scope.and.map(renderScope).join(' AND ') + ')';
    if (scope.or) return '(' + scope.or.map(renderScope).join(' OR ') + ')';
    if (scope.not) return 'NOT ' + renderScope(scope.not);
    if (scope.in) return 'IN [' + scope.in.map(renderScope).join(', ') + ']';
    if (scope.range) { const f = scope.range.from ? renderScope(scope.range.from) : '∞', t = scope.range.to ? renderScope(scope.range.to) : '∞'; return `${f} → ${t}`; }
    return JSON.stringify(scope);
  }
  function extractRange(scope) {
    if (!scope) return null;
    if (scope.range) return { from: scope.range.from?.item || null, to: scope.range.to?.item || null };
    if (scope.and) { for (const s of scope.and) { const r = extractRange(s); if (r) return r; } }
    return null;
  }
  function collectTimePoints(scope, set) {
    if (!scope) return;
    if (scope.type === 'time' && scope.item) { set.add(scope.item); return; }
    if (scope.range) { if (scope.range.from) collectTimePoints(scope.range.from, set); if (scope.range.to) collectTimePoints(scope.range.to, set); return; }
    ['and','or'].forEach(k => { if (scope[k]) scope[k].forEach(s => collectTimePoints(s, set)); });
    if (scope.not) collectTimePoints(scope.not, set);
    if (scope.in) scope.in.forEach(s => collectTimePoints(s, set));
  }

  root.addEventListener('click', e => { const link = e.target.closest('.info-link'); if (link) { e.preventDefault(); select({ kind: link.dataset.kind, id: link.dataset.id }); }});
})();
