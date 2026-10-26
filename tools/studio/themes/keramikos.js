/* ═══════════════════════════════════════════════════════════════════════
   THÈME Κεραμική — « Figures rouges »
   La céramique attique : glaçure noire, figures réservées couleur d'argile,
   trait de relief noir, méandres et palmettes. Chaque éditeur est peint au
   fond d'une coupe (tondo), son nom inscrit le long du bord comme les
   inscriptions des peintres de vases.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LIB, S = window.STUDIO, el = L.el;
  var CLAY = '#C8683C', CLAY_L = '#E08A55', CLAY_D = '#8E3F1E', GLAZE = '#110C09', CREAM = '#EBD3B0';

  function defs(s) {
    var d = el('defs', {}, s);
    var g = el('linearGradient', { id: 'glaze', x1: 0, y1: 0, x2: 1, y2: 0 }, d);
    [['0', '#060403'], ['0.28', '#1F1611'], ['0.36', '#2B1F18'], ['0.5', '#120C09'], ['1', '#050302']].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, g); });
    var c = el('radialGradient', { id: 'clay', cx: 0.42, cy: 0.38, r: 0.7 }, d);
    [['0', CLAY_L], ['0.7', CLAY], ['1', CLAY_D]].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, c); });
    var t = el('filter', { id: 'grain', x: 0, y: 0, width: '100%', height: '100%' }, d);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.9, numOctaves: 2, seed: 7, result: 'n' }, t);
    el('feColorMatrix', { in: 'n', type: 'matrix', values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0' , result: 'a' }, t);
    el('feComposite', { in: 'a', in2: 'SourceGraphic', operator: 'in' }, t);
    return d;
  }
  /* Craquelures de la glaçure. */
  function cracks(s, W, H, seed) {
    var R = L.rng(seed), g = el('g', { fill: 'none', stroke: '#3A2A20', 'stroke-width': 0.6, opacity: 0.35 }, s);
    for (var i = 0; i < 46; i++) {
      var x = R() * W, y = R() * H, d = 'M' + x.toFixed(0) + ' ' + y.toFixed(0), a = R() * 6.28;
      for (var k = 0; k < 9; k++) { a += (R() - 0.5) * 1.4; x += Math.cos(a) * (14 + R() * 30); y += Math.sin(a) * (14 + R() * 30); d += ' L' + x.toFixed(0) + ' ' + y.toFixed(0); }
      el('path', { d: d }, g);
    }
  }
  /* Points d'un motif de méandre (une unité), en coordonnées de bande. */
  function keyUnit(u) {
    return [[0, 5], [0, 0], [4, 0], [4, 3], [2, 3], [2, 2], [3, 2], [3, 1], [1, 1], [1, 4], [5, 4], [5, 0], [6, 0]].map(function (p) { return [p[0] * u, p[1] * u]; });
  }
  function meanderBand(s, x, y, w, h, color) {
    el('rect', { x: x, y: y, width: w, height: h, fill: color || CLAY }, s);
    el('path', { d: L.meander(x, y + h * 0.16, w, h * 0.68), fill: 'none', stroke: GLAZE, 'stroke-width': h * 0.68 / 5 * 0.62, 'stroke-linecap': 'square' }, s);
  }
  /* Méandre en couronne (bord d'une coupe). */
  function meanderRing(s, cx, cy, r, h) {
    var rm = r - h / 2, u = h * 0.7 / 5, n = Math.round(2 * Math.PI * rm / (6 * u)), uu = 2 * Math.PI * rm / n / 6;
    el('circle', { cx: cx, cy: cy, r: rm, fill: 'none', stroke: CLAY, 'stroke-width': h }, s);
    var d = '';
    for (var i = 0; i < n; i++) {
      keyUnit(uu).forEach(function (p, j) {
        var ang = (i * 6 * uu + p[0]) / rm - Math.PI / 2, rad = r - h * 0.15 - p[1] * (h * 0.7 / (5 * uu));
        d += (j ? 'L' : 'M') + (cx + Math.cos(ang) * rad).toFixed(2) + ' ' + (cy + Math.sin(ang) * rad).toFixed(2) + ' ';
      });
    }
    el('path', { d: d, fill: 'none', stroke: GLAZE, 'stroke-width': u * 0.62, 'stroke-linejoin': 'miter' }, s);
  }
  /* Palmette : éventail de pétales sur une volute. */
  function palmette(s, x, y, size, rot) {
    var g = el('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + size / 100 + ')', fill: CLAY }, s);
    for (var i = -4; i <= 4; i++) {
      var a = i * 17;
      el('path', { d: 'M0 0 C-7 -22 -6 -54 0 -' + (70 - Math.abs(i) * 5) + ' C6 -54 7 -22 0 0 Z', transform: 'rotate(' + a + ')' }, g);
    }
    el('path', { d: 'M-30 12 C-30 -4 -12 -6 -8 4 C-4 14 -18 18 -18 8 M30 12 C30 -4 12 -6 8 4 C4 14 18 18 18 8', fill: 'none', stroke: CLAY, 'stroke-width': 5 }, g);
    el('path', { d: 'M-10 6 Q0 -10 10 6 Z' }, g);
  }
  /* Figure rouge : trait d'argile épais, trait de relief noir au milieu. */
  function figure(s, icon, x, y, size, w) {
    L.svgIcon(s, icon, x, y, size, { stroke: CLAY, width: w || 7, dot: CLAY });
    L.svgIcon(s, icon, x, y, size, { stroke: GLAZE, width: (w || 7) * 0.2, dot: CLAY_D });
  }
  function arcText(s, cx, cy, r, text, size, id, top) {
    var d = s.querySelector('defs');
    var p = top ? 'M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy
      : 'M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 0 ' + (cx + r) + ' ' + cy;
    el('path', { id: id, d: p }, d);
    var t = el('text', { fill: CLAY, 'font-family': '"GFS Didot"', 'font-size': size, 'letter-spacing': size * 0.35, 'text-anchor': 'middle' }, s);
    var tp = el('textPath', { href: '#' + id, startOffset: '50%' }, t);
    tp.textContent = text;
  }
  function tondo(s, cx, cy, r) {
    el('circle', { cx: cx, cy: cy, r: r + 4, fill: CLAY_D }, s);
    meanderRing(s, cx, cy, r, r * 0.14);
    el('circle', { cx: cx, cy: cy, r: r * 0.86, fill: GLAZE }, s);
    el('circle', { cx: cx, cy: cy, r: r * 0.86, fill: '#000', filter: 'url(#grain)' }, s);
    el('circle', { cx: cx, cy: cy, r: r * 0.83, fill: 'none', stroke: CLAY, 'stroke-width': 1.5, opacity: 0.6 }, s);
  }
  function backdrop(s, W, H, seed) {
    el('rect', { width: W, height: H, fill: 'url(#glaze)' }, s);
    el('rect', { width: W, height: H, fill: '#000', filter: 'url(#grain)' }, s);
    cracks(s, W, H, seed);
  }

  function poster(stage, o) {
    var W = o.W, H = o.H, e = o.ed, s = L.svgRoot(stage, W, H), cx = W / 2, cy = 560, r = 340;
    defs(s);
    backdrop(s, W, H, 'k-' + e.id);
    meanderBand(s, 0, 54, W, 52);
    // languettes sous la frise
    for (var x = 0; x < W; x += 26) el('path', { d: 'M' + x + ' 112 Q' + (x + 13) + ' 150 ' + (x + 26) + ' 112 Z', fill: CLAY, opacity: 0.85 }, s);
    tondo(s, cx, cy, r);
    figure(s, e.icon, cx, cy + 14, 330, 6.6);
    arcText(s, cx, cy, r * 0.72, e.greek, 34, 'gk', true);
    arcText(s, cx, cy, r * 0.76, e.word.toUpperCase() + ' · ΚΑΝΤΟ ΑΠΛΟ', 20, 'gk2', false);
    palmette(s, 92, cy, 120, -90); palmette(s, W - 92, cy, 120, 90);
    meanderBand(s, 0, 948, W, 44);
    var fs = Math.min(84, (W - 160) / (e.latin.length * 0.82));
    L.svgText(s, cx, 1072, e.latin.toUpperCase(), { 'text-anchor': 'middle', fill: CLAY_L, 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': fs, 'letter-spacing': fs * 0.18 });
    L.svgText(s, cx, 1122, e.role.toUpperCase() + '  ·  ' + e.meaning, { 'text-anchor': 'middle', fill: CREAM, 'font-family': '"EB Garamond"', 'font-size': 28, 'letter-spacing': 2 });
    L.wrap(e.pitch, '300 24px Commissioner', W - 220).slice(0, 2).forEach(function (line, i) {
      L.svgText(s, cx, 1172 + i * 32, line, { 'text-anchor': 'middle', fill: '#B59A80', 'font-family': 'Commissioner', 'font-weight': 300, 'font-size': 24 });
    });
    L.svgText(s, 70, H - 48, 'ΚΕΦΑΛΗ ΣΟΦΙΑ · CEPHALO SOPHIE', { fill: CLAY, 'font-family': '"GFS Didot"', 'font-size': 20, 'letter-spacing': 5 });
    L.svgText(s, W - 70, H - 48, (e.status === 'pending' ? 'EN COMPOSITION · ' : '') + String(e.n).padStart(2, '0') + ' / 13', { 'text-anchor': 'end', fill: '#8F7764', 'font-family': '"JetBrains Mono"', 'font-size': 15, 'letter-spacing': 3 });
  }

  function kappa(s, cx, cy, r) {
    L.svgText(s, cx - r * 0.03, cy + r * 0.38, 'Κ', { 'text-anchor': 'middle', fill: CLAY, 'font-family': '"GFS Didot"', 'font-size': r * 1.2 });
    el('circle', { cx: cx + r * 0.52, cy: cy - r * 0.5, r: r * 0.07, fill: CLAY }, s);
    el('ellipse', { cx: cx, cy: cy, rx: r * 0.72, ry: r * 0.72, fill: 'none', stroke: CLAY, 'stroke-width': r * 0.012, 'stroke-dasharray': r * 0.04 + ' ' + r * 0.05, opacity: 0.7 }, s);
  }

  function cover(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H), cx = W / 2, cy = 370, r = 200;
    defs(s);
    backdrop(s, W, H, 'k-cover');
    meanderBand(s, 0, 40, W, 50);
    tondo(s, cx, cy, r);
    kappa(s, cx, cy, r * 0.82);
    palmette(s, cx - 262, cy - 6, 64, -90); palmette(s, cx + 262, cy - 6, 64, 90);
    L.svgText(s, cx - 312, cy + 22, 'ΚΕΦΑΛΗ', { 'text-anchor': 'end', fill: CLAY_L, 'font-family': '"GFS Didot"', 'font-size': 72, 'letter-spacing': 12 });
    L.svgText(s, cx + 312, cy + 22, 'ΣΟΦΙΑ', { 'text-anchor': 'start', fill: CLAY_L, 'font-family': '"GFS Didot"', 'font-size': 72, 'letter-spacing': 12 });
    L.svgText(s, cx - 320, cy + 70, 'CEPHALO', { 'text-anchor': 'end', fill: CREAM, 'font-family': 'Cinzel', 'font-weight': 500, 'font-size': 30, 'letter-spacing': 14 });
    L.svgText(s, cx + 320, cy + 70, 'SOPHIE', { 'text-anchor': 'start', fill: CREAM, 'font-family': 'Cinzel', 'font-weight': 500, 'font-size': 30, 'letter-spacing': 14 });
    // frise : treize métopes, une par éditeur, séparées par des triglyphes
    var y0 = 610, h = 140, n = S.editors.length, w = (W - 80) / n;
    el('rect', { x: 0, y: y0 - 14, width: W, height: 8, fill: CLAY }, s);
    el('rect', { x: 0, y: y0 + h + 6, width: W, height: 8, fill: CLAY }, s);
    S.editors.forEach(function (e, i) {
      var x = 40 + i * w;
      el('rect', { x: x + 4, y: y0, width: w - 8, height: h, fill: '#0B0806', stroke: CLAY_D, 'stroke-width': 1 }, s);
      figure(s, e.icon, x + w / 2, y0 + h / 2 - 8, 78, 6.2);
      L.svgText(s, x + w / 2, y0 + h - 12, e.latin.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, ''), { 'text-anchor': 'middle', fill: CLAY, 'font-family': 'Cinzel', 'font-size': 12.5, 'letter-spacing': 2 });
      if (i) for (var k = -1; k <= 1; k++) el('line', { x1: x + k * 3, y1: y0, x2: x + k * 3, y2: y0 + h, stroke: CLAY, 'stroke-width': 1.2, opacity: 0.8 }, s);
    });
    meanderBand(s, 0, H - 88, W, 48);
  }
  function profile(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H), cx = W / 2, cy = H / 2;
    defs(s);
    backdrop(s, W, H, 'k-profile');
    tondo(s, cx, cy, 440);
    kappa(s, cx, cy + 10, 330);
    arcText(s, cx, cy, 330, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', 40, 'pk', true);
  }
  function logo(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H), cx = W / 2, cy = 620;
    defs(s);
    tondo(s, cx, cy, 460);
    kappa(s, cx, cy + 10, 340);
    arcText(s, cx, cy, 340, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', 42, 'lk', true);
    L.svgText(s, cx, 1300, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', fill: CLAY, 'font-family': 'Cinzel', 'font-weight': 700, 'font-size': 118, 'letter-spacing': 22 });
    L.svgText(s, cx, 1395, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', fill: CLAY_D, 'font-family': '"GFS Didot"', 'font-size': 64, 'letter-spacing': 34 });
  }

  window.THEMES = window.THEMES || {};
  window.THEMES.keramikos = {
    id: 'keramikos', name: 'Κεραμική', label: 'Figures rouges',
    fonts: ['400 40px "GFS Didot"', '500 40px Cinzel', '600 40px Cinzel', '700 40px Cinzel', '400 40px "EB Garamond"', '300 40px Commissioner', '400 40px "JetBrains Mono"'],
    render: function (stage, o) { return ({ poster: poster, cover: cover, profile: profile, logo: logo })[o.kind](stage, o); }
  };
})();
