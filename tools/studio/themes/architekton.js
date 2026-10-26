/* ═══════════════════════════════════════════════════════════════════════
   THÈME Ἀρχιτέκτων — « L'épure »
   ἀρχι-τέκτων, le maître bâtisseur : chaque éditeur est une planche
   d'architecte au bleu de Prusse — tracés de construction, cotes,
   cartouche, et la vraie capture de l'éditeur tirée en cyanotype.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LIB, S = window.STUDIO, el = L.el;
  var INK = '#EAF2FF', BLUE = '#0D3768', LINE = 'rgba(234,242,255,';

  function defs(s) {
    var d = el('defs', {}, s);
    var g = el('radialGradient', { id: 'paper', cx: 0.5, cy: 0.45, r: 0.8 }, d);
    [['0', '#1A4E8A'], ['0.6', '#103E72'], ['1', '#082849']].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, g); });
    var t = el('filter', { id: 'fiber', x: 0, y: 0, width: '100%', height: '100%' }, d);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.012 0.6', numOctaves: 3, seed: 3, result: 'n' }, t);
    el('feColorMatrix', { in: 'n', type: 'matrix', values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0', result: 'a' }, t);
    el('feComposite', { in: 'a', in2: 'SourceGraphic', operator: 'in' }, t);
    // cyanotype inversé : le fond clair de l'interface devient bleu, le texte devient blanc
    var c = el('filter', { id: 'cyan', 'color-interpolation-filters': 'sRGB' }, d);
    el('feColorMatrix', { type: 'saturate', values: 0, result: 'g' }, c);
    var ct = el('feComponentTransfer', { in: 'g' }, c);
    el('feFuncR', { type: 'table', tableValues: '0.92 0.30 0.06' }, ct);
    el('feFuncG', { type: 'table', tableValues: '0.96 0.45 0.22' }, ct);
    el('feFuncB', { type: 'table', tableValues: '1 0.70 0.43' }, ct);
    var mk = el('marker', { id: 'arr', viewBox: '0 0 10 10', refX: 10, refY: 5, markerWidth: 9, markerHeight: 9, orient: 'auto-start-reverse' }, d);
    el('path', { d: 'M0 1 L10 5 L0 9', fill: 'none', stroke: INK, 'stroke-width': 1.4 }, mk);
    return d;
  }
  function paper(s, W, H) {
    el('rect', { width: W, height: H, fill: 'url(#paper)' }, s);
    var g = el('g', { stroke: INK, fill: 'none' }, s);
    for (var x = 0; x <= W; x += 24) el('line', { x1: x, y1: 0, x2: x, y2: H, 'stroke-width': x % 120 === 0 ? 0.6 : 0.3, opacity: x % 120 === 0 ? 0.16 : 0.07 }, g);
    for (var y = 0; y <= H; y += 24) el('line', { x1: 0, y1: y, x2: W, y2: y, 'stroke-width': y % 120 === 0 ? 0.6 : 0.3, opacity: y % 120 === 0 ? 0.16 : 0.07 }, g);
    el('rect', { width: W, height: H, fill: '#fff', filter: 'url(#fiber)' }, s);
    el('rect', { x: 30, y: 30, width: W - 60, height: H - 60, fill: 'none', stroke: INK, 'stroke-width': 2, opacity: 0.85 }, s);
    el('rect', { x: 40, y: 40, width: W - 80, height: H - 80, fill: 'none', stroke: INK, 'stroke-width': 0.7, opacity: 0.6 }, s);
  }
  function T(s, x, y, txt, a) { return L.svgText(s, x, y, txt, Object.assign({ fill: INK, 'font-family': 'Jura' }, a)); }
  /* Cote : ligne avec flèches, traits de rappel et valeur. */
  function dim(s, x1, y1, x2, y2, label, off) {
    var g = el('g', { stroke: INK, 'stroke-width': 0.9, opacity: 0.85 }, s);
    var dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len * off, ny = dx / len * off;
    el('line', { x1: x1, y1: y1, x2: x1 + nx * 1.15, y2: y1 + ny * 1.15 }, g);
    el('line', { x1: x2, y1: y2, x2: x2 + nx * 1.15, y2: y2 + ny * 1.15 }, g);
    el('line', { x1: x1 + nx, y1: y1 + ny, x2: x2 + nx, y2: y2 + ny, 'marker-start': 'url(#arr)', 'marker-end': 'url(#arr)' }, g);
    var mx = (x1 + x2) / 2 + nx, my = (y1 + y2) / 2 + ny, ang = Math.atan2(dy, dx) * 180 / Math.PI;
    el('rect', { x: mx - label.length * 5.2 - 6, y: my - 10, width: label.length * 10.4 + 12, height: 20, fill: BLUE, stroke: 'none', transform: 'rotate(' + ang + ' ' + mx + ' ' + my + ')' }, g);
    T(s, mx, my + 6, label, { 'text-anchor': 'middle', 'font-size': 16, 'font-family': '"JetBrains Mono"', transform: 'rotate(' + ang + ' ' + mx + ' ' + my + ')' });
  }
  /* Tracés de construction : rectangle d'or, spirale, cercles au compas, axes. */
  function construction(s, cx, cy, r) {
    var g = el('g', { fill: 'none', stroke: INK, 'stroke-width': 0.8 }, s);
    el('circle', { cx: cx, cy: cy, r: r, opacity: 0.55, 'stroke-dasharray': '10 5 2 5' }, g);
    el('circle', { cx: cx, cy: cy, r: r * 0.618, opacity: 0.3 }, g);
    el('line', { x1: cx - r * 1.3, y1: cy, x2: cx + r * 1.3, y2: cy, opacity: 0.45, 'stroke-dasharray': '18 6 3 6' }, g);
    el('line', { x1: cx, y1: cy - r * 1.3, x2: cx, y2: cy + r * 1.3, opacity: 0.45, 'stroke-dasharray': '18 6 3 6' }, g);
    el('line', { x1: cx - r, y1: cy - r, x2: cx + r, y2: cy + r, opacity: 0.18 }, g);
    el('line', { x1: cx + r, y1: cy - r, x2: cx - r, y2: cy + r, opacity: 0.18 }, g);
    // spirale d'or inscrite
    var phi = 1.618, w = r * 2, h = w / phi, x = cx - r, y = cy - h / 2, d = '', dir = 0;
    el('rect', { x: x, y: y, width: w, height: h, opacity: 0.25 }, g);
    for (var i = 0; i < 9; i++) {
      var sq = Math.min(w, h);
      if (dir === 0) { d += (i ? '' : 'M' + x + ' ' + (y + sq)) + ' A' + sq + ' ' + sq + ' 0 0 1 ' + (x + sq) + ' ' + y; el('line', { x1: x + sq, y1: y, x2: x + sq, y2: y + h, opacity: 0.2 }, g); x += sq; w -= sq; }
      else if (dir === 1) { d += ' A' + sq + ' ' + sq + ' 0 0 1 ' + (x + w) + ' ' + (y + sq); el('line', { x1: x, y1: y + sq, x2: x + w, y2: y + sq, opacity: 0.2 }, g); y += sq; h -= sq; }
      else if (dir === 2) { d += ' A' + sq + ' ' + sq + ' 0 0 1 ' + (x + w - sq) + ' ' + (y + h); el('line', { x1: x + w - sq, y1: y, x2: x + w - sq, y2: y + h, opacity: 0.2 }, g); w -= sq; }
      else { d += ' A' + sq + ' ' + sq + ' 0 0 1 ' + x + ' ' + (y + h - sq); el('line', { x1: x, y1: y + h - sq, x2: x + w, y2: y + h - sq, opacity: 0.2 }, g); h -= sq; }
      dir = (dir + 1) % 4;
    }
    el('path', { d: d, opacity: 0.4 }, g);
  }
  /* Cartouche d'architecte. */
  function titleBlock(s, x, y, w, rows) {
    var h = rows.length * 40;
    var g = el('g', { stroke: INK, fill: 'none' }, s);
    el('rect', { x: x, y: y, width: w, height: h, fill: BLUE, 'stroke-width': 1.6 }, g);
    rows.forEach(function (r, i) {
      if (i) el('line', { x1: x, y1: y + i * 40, x2: x + w, y2: y + i * 40, 'stroke-width': 0.7 }, g);
      el('line', { x1: x + 128, y1: y + i * 40, x2: x + 128, y2: y + (i + 1) * 40, 'stroke-width': 0.7 }, g);
      T(s, x + 12, y + i * 40 + 25, r[0], { 'font-size': 12.5, 'font-family': '"JetBrains Mono"', 'letter-spacing': 1.5, opacity: 0.75 });
      var fs = r[2] || 19; while (fs > 11 && L.measure(r[1], '600 ' + fs + 'px Jura') + fs * 0.1 * r[1].length > w - 156) fs -= 0.5;
      T(s, x + 142, y + i * 40 + 27, r[1], { 'font-size': fs, 'font-weight': 600, 'letter-spacing': 1.5 });
    });
    return h;
  }
  /* Capture tirée en cyanotype inversé : le fond clair de l'interface devient bleu, le texte blanc. */
  async function shot(s, src, x, y, w, caption) {
    var img = await L.loadImg(src), h = Math.round(w * img.naturalHeight / img.naturalWidth);
    var c = L.canvas(w * 2, h * 2), cx = c.getContext('2d');
    cx.drawImage(img, 0, 0, w * 2, h * 2);
    var d = cx.getImageData(0, 0, w * 2, h * 2), p = d.data;
    for (var i = 0; i < p.length; i += 4) {
      var l = (p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11) / 255, t = Math.pow(1 - l, 0.8);
      p[i] = 10 + t * 224; p[i + 1] = 44 + t * 198; p[i + 2] = 92 + t * 163;
    }
    cx.putImageData(d, 0, 0);
    el('image', { href: c.toDataURL('image/png'), x: x, y: y, width: w, height: h }, s);
    el('rect', { x: x, y: y, width: w, height: h, fill: 'none', stroke: INK, 'stroke-width': 1.4 }, s);
    [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(function (p) {
      el('path', { d: 'M' + (p[0] - 10) + ' ' + p[1] + ' H' + (p[0] + 10) + ' M' + p[0] + ' ' + (p[1] - 10) + ' V' + (p[1] + 10), stroke: INK, 'stroke-width': 1 }, s);
    });
    T(s, x, y + h + 26, caption, { 'font-size': 14, 'font-family': '"JetBrains Mono"', 'letter-spacing': 2, opacity: 0.85 });
    return h;
  }

  async function poster(stage, o) {
    var W = o.W, H = o.H, e = o.ed, s = L.svgRoot(stage, W, H), cx = W / 2, cy = 560, size = 400;
    defs(s); paper(s, W, H);
    T(s, 76, 150, e.greek, { 'font-size': Math.min(108, (W - 200) / (e.greek.length * 0.72)), 'font-weight': 500, 'letter-spacing': 10 });
    T(s, 80, 196, (e.latin + ' — ' + e.role).toUpperCase(), { 'font-size': 22, 'font-family': '"JetBrains Mono"', 'letter-spacing': 4 });
    T(s, 80, 234, e.word + ' — ' + e.meaning, { 'font-size': 26, 'font-family': '"EB Garamond"', 'font-style': 'italic', opacity: 0.92 });
    T(s, W - 80, 108, 'PL. ' + String(e.n).padStart(2, '0') + ' / 13', { 'text-anchor': 'end', 'font-size': 18, 'font-family': '"JetBrains Mono"', 'letter-spacing': 3 });
    construction(s, cx, cy, 270);
    L.svgIcon(s, e.icon, cx, cy, size, { stroke: INK, width: 1.9 });
    dim(s, cx - size / 2, cy - size / 2, cx + size / 2, cy - size / 2, '400', -40);
    dim(s, cx + size / 2, cy - size / 2, cx + size / 2, cy + size / 2, '400', -40);
    dim(s, cx - 270, cy + 300, cx + 270, cy + 300, 'Ø 540', 0);
    T(s, cx - 262, cy - 262, 'A', { 'font-size': 18, 'font-family': '"JetBrains Mono"' });
    T(s, cx + 254, cy + 280, 'B', { 'font-size': 18, 'font-family': '"JetBrains Mono"' });
    var bx = 70, by = 916;
    if (e.shot) await shot(s, e.shot, bx, by, 440, 'FIG. 2 — ' + e.latin.toUpperCase() + ', EN SERVICE');
    else {
      T(s, bx, by + 20, 'NOTE —', { 'font-size': 15, 'font-family': '"JetBrains Mono"', 'letter-spacing': 3, opacity: 0.8 });
      L.wrap(e.pitch, '400 22px Jura', 430).forEach(function (line, i) { T(s, bx, by + 58 + i * 32, line, { 'font-size': 22 }); });
      T(s, bx, by + 200, e.status === 'pending' ? '◇ EN COMPOSITION' : '', { 'font-size': 15, 'font-family': '"JetBrains Mono"', 'letter-spacing': 3 });
    }
    titleBlock(s, W - 520, H - 360, 450, [
      ['PROJET', 'KANTO APLO'],
      ['OUVRAGE', e.latin + ' · ' + e.greek],
      ['RÔLE', e.role],
      ['ÉTYMOLOGIE', e.word],
      ['ÉCHELLE', '1 : 1 · ' + e.site],
      ['ARCHITECTE', 'CEPHALO SOPHIE']
    ]);
    if (e.shot) L.wrap(e.pitch, '400 20px Jura', 440).slice(0, 3).forEach(function (line, i) { T(s, bx, H - 120 + i * 28, line, { 'font-size': 20, opacity: 0.9 }); });
  }

  function cover(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H), cx = 500, cy = 470, k = 1.08;
    defs(s); paper(s, W, H);
    // plan d'ensemble de l'univers : étoile, orbites, éditeurs cotés
    var g = el('g', { fill: 'none', stroke: INK }, s);
    var orbits = [130, 200, 270, 340];
    orbits.forEach(function (a, i) { el('ellipse', { cx: cx, cy: cy, rx: a * 1.25 * k, ry: a * 0.62 * k, 'stroke-width': 0.9, opacity: 0.6, 'stroke-dasharray': i % 2 ? '8 5' : 'none' }, g); });
    el('line', { x1: cx - 430, y1: cy, x2: cx + 430, y2: cy, 'stroke-width': 0.6, opacity: 0.4, 'stroke-dasharray': '18 6 3 6' }, g);
    el('line', { x1: cx, y1: cy - 260, x2: cx, y2: cy + 260, 'stroke-width': 0.6, opacity: 0.4, 'stroke-dasharray': '18 6 3 6' }, g);
    el('circle', { cx: cx, cy: cy, r: 42, 'stroke-width': 1.6 }, g);
    T(s, cx, cy + 17, 'Κ', { 'text-anchor': 'middle', 'font-size': 50, 'font-family': '"Noto Serif Display"' });
    // positions, puis étiquettes écartées verticalement pour ne jamais se chevaucher
    var marks = S.editors.map(function (e, i) {
      var a = orbits[[0, 2, 1, 3][i % 4]] * k, t = 0.35 + i * 2 * Math.PI / 13, x = cx + Math.cos(t) * a * 1.25, y = cy + Math.sin(t) * a * 0.62;
      var dir = Math.cos(t) > 0 ? 1 : -1;
      if (x + dir * 142 < 70) dir = 1;
      if (x + dir * 142 > 860) dir = -1;
      var lx = x + dir * 30;
      return { e: e, x: x, y: y, dir: dir, lx: lx, ly: y + (Math.sin(t) > 0 ? 22 : -22), x0: Math.min(lx, lx + dir * 112), x1: Math.max(lx, lx + dir * 112) };
    });
    for (var it = 0; it < 40; it++) {
      marks.forEach(function (m) {
        marks.forEach(function (n) {
          if (m === n || m.x1 < n.x0 || n.x1 < m.x0) return;
          var dy = n.ly - m.ly;
          if (Math.abs(dy) < 26) { var push = (26 - Math.abs(dy)) / 2 * (dy >= 0 ? 1 : -1); n.ly += push; m.ly -= push; }
        });
      });
    }
    marks.forEach(function (m) {
      el('circle', { cx: m.x, cy: m.y, r: 7, fill: BLUE, stroke: INK, 'stroke-width': 1.4 }, s);
      el('path', { d: 'M' + m.x + ' ' + m.y + ' L' + m.lx + ' ' + m.ly + ' H' + (m.lx + m.dir * 112), fill: 'none', stroke: INK, 'stroke-width': 0.8, opacity: 0.8 }, s);
      T(s, m.lx + m.dir * 4, m.ly - 6, String(m.e.n).padStart(2, '0') + ' ' + m.e.latin.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), { 'text-anchor': m.dir > 0 ? 'start' : 'end', 'font-size': 14, 'font-family': '"JetBrains Mono"', 'letter-spacing': 1.5 });
    });
    dim(s, cx - 368, cy + 280, cx + 368, cy + 280, 'KANTO APLO · 13 ÉDITEURS', 0);
    T(s, 120, 120, "PLAN D'ENSEMBLE — UNIVERS KANTO APLO", { 'font-size': 16, 'font-family': '"JetBrains Mono"', 'letter-spacing': 3 });
    var x = 1240;
    T(s, x, 320, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', 'font-size': 66, 'font-weight': 600, 'letter-spacing': 10 });
    T(s, x, 380, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', 'font-size': 38, 'font-weight': 400, 'letter-spacing': 22 });
    dim(s, x - 250, 412, x + 250, 412, 'LA TÊTE SAGE', 0);
    T(s, x, 470, "« L'intelligence qui précède l'action »", { 'text-anchor': 'middle', 'font-size': 26, 'font-family': '"EB Garamond"', 'font-style': 'italic' });
    titleBlock(s, x - 230, 520, 460, [['STUDIO', 'Paris · depuis 2018'], ['MONDES', 'KANTO APLO · KÝDOS'], ['SITE', 'cephalosophie.com']]);
  }
  function kappa(s, cx, cy, r) {
    construction(s, cx, cy, r);
    T(s, cx - r * 0.04, cy + r * 0.42, 'Κ', { 'text-anchor': 'middle', 'font-family': '"Noto Serif Display"', 'font-weight': 400, 'font-size': r * 1.4, fill: 'none', stroke: INK, 'stroke-width': 2.2 });
    el('circle', { cx: cx + r * 0.66, cy: cy - r * 0.66, r: r * 0.07, fill: 'none', stroke: INK, 'stroke-width': 2 }, s);
    dim(s, cx - r, cy + r * 1.08, cx + r, cy + r * 1.08, 'Ø ' + Math.round(r * 2), 0);
  }
  function profile(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H);
    defs(s); paper(s, W, H);
    kappa(s, W / 2, H / 2 - 20, 330);
  }
  function logo(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H);
    defs(s);
    el('circle', { cx: W / 2, cy: 620, r: 480, fill: 'url(#paper)' }, s);
    el('circle', { cx: W / 2, cy: 620, r: 480, fill: '#fff', filter: 'url(#fiber)' }, s);
    el('circle', { cx: W / 2, cy: 620, r: 466, fill: 'none', stroke: INK, 'stroke-width': 2 }, s);
    kappa(s, W / 2, 600, 300);
    L.svgText(s, W / 2, 1300, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', fill: '#0D3768', 'font-family': 'Jura', 'font-weight': 600, 'font-size': 118, 'letter-spacing': 22 });
    L.svgText(s, W / 2, 1395, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', fill: '#2A6BB5', 'font-family': 'Jura', 'font-weight': 500, 'font-size': 60, 'letter-spacing': 34 });
  }

  window.THEMES = window.THEMES || {};
  window.THEMES.architekton = {
    id: 'architekton', name: 'Ἀρχιτέκτων', label: "L'épure",
    fonts: ['400 40px Jura', '500 40px Jura', '600 40px Jura', '400 40px "JetBrains Mono"', '400 40px "Noto Serif Display"', 'italic 400 40px "EB Garamond"'],
    render: function (stage, o) { return ({ poster: poster, cover: cover, profile: profile, logo: logo })[o.kind](stage, o); }
  };
})();
