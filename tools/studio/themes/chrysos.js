/* ═══════════════════════════════════════════════════════════════════════
   THÈME Χρυσός Οὐρανός — « Constellation d'or »
   Gravure à l'or fin sur la nuit : chaque éditeur devient une
   constellation tracée d'étoile en étoile, dans une sphère armillaire.
   La tête-constellation du site signe la couverture.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LIB, S = window.STUDIO, el = L.el;

  function defs(s, accent) {
    var d = el('defs', {}, s);
    var g = el('linearGradient', { id: 'gold', x1: 0, y1: 0, x2: 0.4, y2: 1 }, d);
    [['0', '#FFF1C4'], ['0.35', '#E8C060'], ['0.7', '#C9963A'], ['1', '#8A6420']].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, g); });
    var bg = el('radialGradient', { id: 'night', cx: 0.5, cy: 0.42, r: 0.75 }, d);
    [['0', '#121530'], ['0.55', '#070818'], ['1', '#020208']].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, bg); });
    var neb = el('radialGradient', { id: 'neb' }, d);
    el('stop', { offset: 0, 'stop-color': accent || '#8B5CF6', 'stop-opacity': 0.32 }, neb);
    el('stop', { offset: 1, 'stop-color': accent || '#8B5CF6', 'stop-opacity': 0 }, neb);
    var f = el('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, d);
    el('feGaussianBlur', { stdDeviation: 3.2, result: 'b' }, f);
    var m = el('feMerge', {}, f); el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
    var f2 = el('filter', { id: 'soft', x: '-50%', y: '-50%', width: '200%', height: '200%' }, d);
    el('feGaussianBlur', { stdDeviation: 40 }, f2);
    return d;
  }
  function stars(s, W, H, n, seed, area) {
    var R = L.rng(seed), g = el('g', {}, s);
    for (var i = 0; i < n; i++) {
      var x = R() * W, y = R() * H, r = R() < 0.92 ? 0.4 + R() * 0.8 : 1.2 + R() * 1.1;
      el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: r.toFixed(2), fill: R() < 0.2 ? '#E6D6A8' : '#fff', opacity: (0.25 + R() * 0.65).toFixed(2) }, g);
    }
    return g;
  }
  /* Sphère armillaire : cercles gradués, texte en couronne. */
  function armillary(s, cx, cy, r, label, id) {
    var g = el('g', { fill: 'none', stroke: 'url(#gold)' }, s);
    el('circle', { cx: cx, cy: cy, r: r, 'stroke-width': 1.4 }, g);
    el('circle', { cx: cx, cy: cy, r: r - 14, 'stroke-width': 0.7, opacity: 0.7 }, g);
    el('circle', { cx: cx, cy: cy, r: r * 0.78, 'stroke-width': 0.8, 'stroke-dasharray': '2 7', opacity: 0.6 }, g);
    for (var i = 0; i < 180; i++) {
      var a = i * Math.PI / 90, l = i % 15 === 0 ? 14 : i % 5 === 0 ? 9 : 5;
      el('line', { x1: cx + Math.cos(a) * r, y1: cy + Math.sin(a) * r, x2: cx + Math.cos(a) * (r - l), y2: cy + Math.sin(a) * (r - l), 'stroke-width': i % 15 === 0 ? 1.2 : 0.6 }, g);
    }
    // anneaux inclinés : l'écliptique et l'orbite
    el('ellipse', { cx: cx, cy: cy, rx: r * 1.12, ry: r * 0.34, transform: 'rotate(-18 ' + cx + ' ' + cy + ')', 'stroke-width': 0.9, opacity: 0.75 }, g);
    el('ellipse', { cx: cx, cy: cy, rx: r * 0.42, ry: r * 1.08, transform: 'rotate(28 ' + cx + ' ' + cy + ')', 'stroke-width': 0.6, opacity: 0.45 }, g);
    if (label) {
      var d = s.querySelector('defs');
      el('path', { id: id, d: 'M' + cx + ' ' + (cy - r - 34) + ' a' + (r + 34) + ' ' + (r + 34) + ' 0 1 1 -0.01 0' }, d);
      var t = el('text', { fill: '#C9963A', 'font-family': '"Noto Serif Display"', 'font-size': 20, 'letter-spacing': 9, opacity: 0.85 }, s);
      var tp = el('textPath', { href: '#' + id, startOffset: '0' }, t);
      tp.textContent = label;
    }
    return g;
  }
  /* Constellation d'un pictogramme : étoiles sur les tracés, reliées par des filets d'or. */
  function constellation(s, icon, cx, cy, size, seed, accent) {
    var R = L.rng(seed), k = size / 100, ox = cx - size / 2, oy = cy - size / 2;
    var g = el('g', {}, s);
    var lines = el('g', { transform: 'translate(' + ox + ' ' + oy + ') scale(' + k + ')', fill: 'none', stroke: 'url(#gold)', 'stroke-width': 1.1 / k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.8 }, g);
    icon.line.forEach(function (d) { el('path', { d: d }, lines); });
    var sg = el('g', { filter: 'url(#glow)' }, g);
    L.iconPoints(icon, 7.5).forEach(function (seg) {
      seg.pts.forEach(function (p, i) {
        var big = seg.dot || i === 0 || R() < 0.12;
        el('circle', { cx: (ox + p[0] * k).toFixed(1), cy: (oy + p[1] * k).toFixed(1), r: (big ? 3.4 + R() * 1.6 : 1.3 + R() * 1.1).toFixed(2), fill: big ? '#FFF4D2' : '#E8C060' }, sg);
      });
    });
    icon.dots.forEach(function (d) {
      el('path', { d: d, transform: 'translate(' + ox + ' ' + oy + ') scale(' + k + ')', fill: accent, opacity: 0.85 }, g);
    });
    return g;
  }
  function T(s, x, y, txt, a) { return L.svgText(s, x, y, txt, a); }

  function poster(stage, o) {
    var W = o.W, H = o.H, e = o.ed, s = L.svgRoot(stage, W, H), cx = W / 2, cy = 668;
    defs(s, e.accent);
    el('rect', { width: W, height: H, fill: 'url(#night)' }, s);
    el('circle', { cx: cx + 120, cy: cy - 80, r: 420, fill: 'url(#neb)' }, s);
    stars(s, W, H, 900, 'chrysos-' + e.id);
    armillary(s, cx, cy, 336, (e.greek + ' · ' + e.word.toUpperCase() + ' · ').repeat(3), 'ring');
    constellation(s, e.icon, cx, cy, 430, e.id, e.accent);
    // planète en orbite à la couleur de l'éditeur
    var a = -0.6, px = cx + Math.cos(a) * 336 * 1.12, py = cy + Math.sin(a) * 336 * 0.34;
    var rot = -18 * Math.PI / 180, qx = cx + (px - cx) * Math.cos(rot) - (py - cy) * Math.sin(rot), qy = cy + (px - cx) * Math.sin(rot) + (py - cy) * Math.cos(rot);
    el('circle', { cx: qx, cy: qy, r: 11, fill: e.accent, filter: 'url(#glow)' }, s);
    // titre
    var fs = Math.min(118, (W - 160) / (e.greek.length * 0.92));
    T(s, cx, 160, e.greek, { 'text-anchor': 'middle', fill: 'url(#gold)', 'font-family': '"Noto Serif Display"', 'font-weight': 300, 'font-size': fs, 'letter-spacing': fs * 0.18 });
    T(s, cx, 214, e.latin.toUpperCase() + '   ·   ' + e.role.toUpperCase(), { 'text-anchor': 'middle', fill: '#EDE7DB', 'font-family': 'Cinzel', 'font-weight': 500, 'font-size': 25, 'letter-spacing': 9 });
    el('line', { x1: cx - 60, y1: 240, x2: cx + 60, y2: 240, stroke: 'url(#gold)', 'stroke-width': 1 }, s);
    // légende
    T(s, cx, 1100, e.word + ' — ' + e.meaning, { 'text-anchor': 'middle', fill: '#E6D6A8', 'font-family': '"EB Garamond"', 'font-style': 'italic', 'font-size': 36 });
    L.wrap(e.pitch, '300 25px Commissioner', W - 240).slice(0, 2).forEach(function (line, i) {
      T(s, cx, 1150 + i * 34, line, { 'text-anchor': 'middle', fill: '#A9A39A', 'font-family': 'Commissioner', 'font-weight': 300, 'font-size': 25 });
    });
    el('line', { x1: 80, y1: H - 92, x2: W - 80, y2: H - 92, stroke: 'url(#gold)', 'stroke-width': 0.8, opacity: 0.6 }, s);
    T(s, 80, H - 54, 'KANTO APLO · CEPHALO SOPHIE', { fill: '#C9963A', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 18, 'letter-spacing': 5 });
    T(s, W - 80, H - 54, 'Nº ' + String(e.n).padStart(2, '0') + '  ·  ' + (e.status === 'pending' ? 'EN COMPOSITION' : e.site.toUpperCase()), { 'text-anchor': 'end', fill: '#8C857A', 'font-family': '"JetBrains Mono"', 'font-size': 15, 'letter-spacing': 3 });
  }

  /* La tête-constellation (profil grec) du site, l'univers dans l'esprit. */
  function head(s, x, y, k) {
    var h = S.head, g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + k + ')' }, s);
    var d = 'M' + h.P.map(function (p) { return p.join(','); }).join(' L');
    el('path', { d: d, fill: 'none', stroke: 'url(#gold)', 'stroke-width': 1.3 / k, opacity: 0.9 }, g);
    el('path', { d: 'M' + h.ear.map(function (p) { return p.join(','); }).join(' L') + ' Z', fill: 'none', stroke: '#C9963A', 'stroke-width': 0.8 / k, opacity: 0.6 }, g);
    [h.P[8], h.P[11], h.eye, h.ear[1], h.P[5], h.P[3]].forEach(function (p) {
      el('line', { x1: h.mind[0], y1: h.mind[1], x2: p[0], y2: p[1], stroke: '#C9963A', 'stroke-width': 0.7 / k, opacity: 0.45, 'stroke-dasharray': (3 / k) + ' ' + (5 / k) }, g);
    });
    var sg = el('g', { filter: 'url(#glow)' }, g), R = L.rng('head');
    h.P.concat([h.eye], h.ear).forEach(function (p, i) {
      var big = [4, 6, 8, 11, 15, 20].indexOf(i) >= 0 || p === h.eye;
      el('circle', { cx: p[0], cy: p[1], r: (big ? 4.2 : 1.8 + R() * 1.2) / Math.sqrt(k), fill: big ? '#FFF4D2' : '#E8C060' }, sg);
    });
    var m = el('g', { transform: 'translate(' + h.mind[0] + ' ' + h.mind[1] + ')' }, g);
    el('circle', { r: 70, fill: 'url(#neb)' }, m);
    el('ellipse', { rx: 36, ry: 13, fill: 'none', stroke: '#C9963A', 'stroke-width': 0.8 / k }, m);
    el('ellipse', { rx: 56, ry: 20, fill: 'none', stroke: '#C9963A', 'stroke-width': 0.8 / k, opacity: 0.7 }, m);
    el('circle', { r: 11, fill: 'url(#gold)', filter: 'url(#glow)' }, m);
    el('circle', { cx: 36, cy: 0, r: 4, fill: '#2DD4A0', filter: 'url(#glow)' }, m);
    el('circle', { cx: -40, cy: 14, r: 5, fill: '#FF3EA5', filter: 'url(#glow)' }, m);
    return g;
  }

  function cover(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H);
    defs(s, '#8B5CF6');
    el('rect', { width: W, height: H, fill: 'url(#night)' }, s);
    el('circle', { cx: 470, cy: 430, r: 380, fill: 'url(#neb)' }, s);
    stars(s, W, H, 1500, 'chrysos-cover');
    armillary(s, 470, 462, 300, null);
    head(s, 470 - 245 * 1.18, 462 - 264 * 1.18, 1.18);
    var x = 1180;
    T(s, x, 352, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', fill: 'url(#gold)', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 76, 'letter-spacing': 14 });
    T(s, x, 418, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', fill: '#E6D6A8', 'font-family': '"Noto Serif Display"', 'font-weight': 300, 'font-size': 40, 'letter-spacing': 26 });
    el('line', { x1: x - 70, y1: 452, x2: x + 70, y2: 452, stroke: 'url(#gold)' }, s);
    T(s, x, 500, "« L'intelligence qui précède l'action »", { 'text-anchor': 'middle', fill: '#EDE7DB', 'font-family': '"EB Garamond"', 'font-style': 'italic', 'font-size': 34 });
    // les treize éditeurs, gravés
    var n = S.editors.length, step = 62, x0 = x - (n - 1) * step / 2;
    S.editors.forEach(function (e, i) {
      L.svgIcon(s, e.icon, x0 + i * step, 600, 44, { stroke: 'url(#gold)', width: 3.4, dot: e.accent });
    });
    T(s, x, 676, 'KANTO APLO  ·  KÝDOS', { 'text-anchor': 'middle', fill: '#C9963A', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 20, 'letter-spacing': 8 });
  }

  function emblem(s, cx, cy, r, ring) {
    if (ring !== false) armillary(s, cx, cy, r, 'ΚΕΦΑΛΗ · ΣΟΦΙΑ · ΚΑΝΤΟ ΑΠΛΟ · ΚΥΔΟΣ · '.repeat(3), 'ering');
    T(s, cx - r * 0.04, cy + r * 0.36, 'Κ', { 'text-anchor': 'middle', fill: 'url(#gold)', 'font-family': '"Noto Serif Display"', 'font-weight': 300, 'font-size': r * 1.15 });
    el('circle', { cx: cx + r * 0.6, cy: cy - r * 0.56, r: r * 0.06, fill: 'url(#gold)', filter: 'url(#glow)' }, s);
  }
  function profile(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H);
    defs(s, '#C9963A');
    el('rect', { width: W, height: H, fill: 'url(#night)' }, s);
    el('circle', { cx: W / 2, cy: H / 2, r: 420, fill: 'url(#neb)' }, s);
    stars(s, W, H, 700, 'chrysos-profile');
    emblem(s, W / 2, H / 2, 330);
  }
  function logo(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H);
    defs(s, '#C9963A');
    var g = el('circle', { cx: W / 2, cy: 620, r: 470, fill: '#05040d' }, s);
    stars(s, W, H, 0, 'x');
    emblem(s, W / 2, 620, 380);
    T(s, W / 2, 1310, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', fill: 'url(#gold)', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 120, 'letter-spacing': 22 });
    T(s, W / 2, 1405, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', fill: '#B08A3E', 'font-family': '"Noto Serif Display"', 'font-weight': 400, 'font-size': 60, 'letter-spacing': 34 });
    return g;
  }

  window.THEMES = window.THEMES || {};
  window.THEMES.chrysos = {
    id: 'chrysos', name: 'Χρυσός Οὐρανός', label: "Constellation d'or",
    fonts: ['300 40px "Noto Serif Display"', '400 40px "Noto Serif Display"', '500 40px Cinzel', '600 40px Cinzel', 'italic 400 40px "EB Garamond"', '300 40px Commissioner', '400 40px "JetBrains Mono"'],
    render: function (stage, o) { return ({ poster: poster, cover: cover, profile: profile, logo: logo })[o.kind](stage, o); }
  };
})();
