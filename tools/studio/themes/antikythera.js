/* ═══════════════════════════════════════════════════════════════════════
   THÈME Ἀντικύθηρα — « Le mécanisme »
   Le mécanisme d'Anticythère, premier calculateur connu, bronze grec du
   IIᵉ siècle av. J.-C. : roues dentées, cadrans gradués, inscriptions
   gravées, patine vert-de-gris. Chaque éditeur est un rouage de la
   machine KANTO APLO.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LIB, S = window.STUDIO, el = L.el;

  /* Patine : bronze sombre taché de vert-de-gris. */
  function patina(stage, W, H, seed) {
    var cv = L.canvas(W, H), c = cv.getContext('2d');
    cv.style.cssText = 'position:absolute;inset:0';
    stage.appendChild(cv);
    var img = c.createImageData(W, H), d = img.data, N = L.noise(seed);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var n = N.fbm(x / 260, y / 260, 6), m = N.fbm(x / 60 + 9, y / 60, 4), v = Math.max(0, Math.min(1, (n - 0.46) * 3.2));
      var i = (y * W + x) * 4, k = 0.75 + m * 0.5;
      // bronze brun ↔ vert-de-gris
      d[i] = (24 + (34 - 24) * v) * k + (1 - v) * 10;
      d[i + 1] = (20 + (70 - 20) * v) * k;
      d[i + 2] = (14 + (60 - 14) * v) * k;
      d[i + 3] = 255;
    }
    c.putImageData(img, 0, 0);
    var g = c.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.6)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  function defs(s) {
    var d = el('defs', {}, s);
    var b = el('linearGradient', { id: 'bronze', x1: 0, y1: 0, x2: 1, y2: 1 }, d);
    [['0', '#F2C27A'], ['0.3', '#C98C43'], ['0.62', '#8A5A24'], ['1', '#4A2E14']].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, b); });
    var b2 = el('radialGradient', { id: 'plate', cx: 0.4, cy: 0.35, r: 0.8 }, d);
    [['0', '#D9A35C'], ['0.6', '#9C6A30'], ['1', '#5A3A1A']].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, b2); });
    var t = el('linearGradient', { id: 'title', x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    [['0', '#FFE2A8'], ['0.5', '#D89A4A'], ['1', '#8E5E26']].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, t); });
    var f = el('filter', { id: 'drop', x: '-20%', y: '-20%', width: '140%', height: '140%' }, d);
    el('feDropShadow', { dx: 0, dy: 10, stdDeviation: 12, 'flood-color': '#000', 'flood-opacity': 0.65 }, f);
    var e = el('filter', { id: 'etch', x: '-5%', y: '-5%', width: '110%', height: '110%' }, d);
    el('feOffset', { in: 'SourceGraphic', dx: 0, dy: 1.4, result: 'o' }, e);
    el('feColorMatrix', { in: 'o', type: 'matrix', values: '0 0 0 0 1  0 0 0 0 0.86  0 0 0 0 0.6  0 0 0 0.35 0', result: 'hi' }, e);
    var m = el('feMerge', {}, e); el('feMergeNode', { in: 'hi' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
    return d;
  }
  /* Roue dentée en bronze, ajourée de rayons. */
  function wheel(s, cx, cy, r, teeth, spokes, rot) {
    var g = el('g', { transform: 'rotate(' + (rot || 0) + ' ' + cx + ' ' + cy + ')', filter: 'url(#drop)' }, s);
    var d = L.gear(cx, cy, r, teeth, Math.max(5, r * 0.07));
    var rin = r * 0.2, rout = r * 0.78, k = spokes || 4, sw = 0.22;
    for (var i = 0; i < k; i++) {
      var a0 = i * 2 * Math.PI / k + sw, a1 = (i + 1) * 2 * Math.PI / k - sw;
      var p = function (a, rr) { return (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); };
      d += ' M' + p(a0, rin * 1.5) + ' L' + p(a0, rout) + ' A' + rout + ' ' + rout + ' 0 0 1 ' + p(a1, rout) + ' L' + p(a1, rin * 1.5) + ' A' + rin * 1.5 + ' ' + rin * 1.5 + ' 0 0 0 ' + p(a0, rin * 1.5) + ' Z';
    }
    d += ' ' + S.C(cx, cy, r * 0.05);
    el('path', { d: d, fill: 'url(#bronze)', 'fill-rule': 'evenodd', stroke: '#3A2410', 'stroke-width': 1.2 }, g);
    el('circle', { cx: cx, cy: cy, r: r * 0.86, fill: 'none', stroke: '#F3C987', 'stroke-width': 0.8, opacity: 0.5 }, g);
    el('circle', { cx: cx, cy: cy, r: r * 0.2, fill: 'none', stroke: '#3A2410', 'stroke-width': 2 }, g);
    return g;
  }
  /* Cadran gradué : plaque de bronze, graduations, lettres grecques, aiguille. */
  function dial(s, cx, cy, r, label, id) {
    var g = el('g', { filter: 'url(#drop)' }, s);
    el('path', { d: L.gear(cx, cy, r * 1.06, 120, r * 0.03), fill: 'url(#bronze)', stroke: '#3A2410', 'stroke-width': 1 }, g);
    el('circle', { cx: cx, cy: cy, r: r, fill: 'url(#plate)', stroke: '#3A2410', 'stroke-width': 2 }, g);
    var t = el('g', { stroke: '#2A1808', fill: 'none', filter: 'url(#etch)' }, s);
    el('circle', { cx: cx, cy: cy, r: r * 0.92, 'stroke-width': 1.6 }, t);
    el('circle', { cx: cx, cy: cy, r: r * 0.78, 'stroke-width': 1.2 }, t);
    el('circle', { cx: cx, cy: cy, r: r * 0.6, 'stroke-width': 1 }, t);
    for (var i = 0; i < 365; i += 5) {
      var a = i / 365 * Math.PI * 2, l = i % 30 === 0 ? r * 0.14 : r * 0.06;
      el('line', { x1: cx + Math.cos(a) * r * 0.92, y1: cy + Math.sin(a) * r * 0.92, x2: cx + Math.cos(a) * (r * 0.92 - l), y2: cy + Math.sin(a) * (r * 0.92 - l), 'stroke-width': i % 30 === 0 ? 1.6 : 0.8 }, t);
    }
    var alpha = 'ΑΒΓΔΕΖΗΘΙΚΛΜ';
    for (var j = 0; j < 12; j++) {
      var b = (j + 0.5) / 12 * Math.PI * 2 - Math.PI / 2;
      var tx = el('text', { x: cx + Math.cos(b) * r * 0.69, y: cy + Math.sin(b) * r * 0.69 + r * 0.03, 'text-anchor': 'middle', fill: '#2A1808', 'font-family': '"Noto Serif Display"', 'font-weight': 600, 'font-size': r * 0.085, filter: 'url(#etch)' }, s);
      tx.textContent = alpha[j];
    }
    if (label) {
      el('path', { id: id, d: 'M' + cx + ' ' + (cy - r * 0.84) + ' a' + r * 0.84 + ' ' + r * 0.84 + ' 0 1 1 -0.01 0' }, s.querySelector('defs'));
      var tt = el('text', { fill: '#2A1808', 'font-family': '"Noto Serif Display"', 'font-weight': 600, 'font-size': r * 0.06, 'letter-spacing': r * 0.025, filter: 'url(#etch)' }, s);
      el('textPath', { href: '#' + id }, tt).textContent = label;
    }
    return g;
  }
  function pointer(s, cx, cy, r, ang, color) {
    var g = el('g', { transform: 'rotate(' + ang + ' ' + cx + ' ' + cy + ')', filter: 'url(#drop)' }, s);
    el('path', { d: 'M' + cx + ' ' + (cy - r) + ' L' + (cx + r * 0.035) + ' ' + cy + ' L' + cx + ' ' + (cy + r * 0.18) + ' L' + (cx - r * 0.035) + ' ' + cy + ' Z', fill: '#2A1808' }, g);
    el('circle', { cx: cx, cy: cy - r, r: r * 0.035, fill: color }, g);
    el('circle', { cx: cx, cy: cy, r: r * 0.05, fill: 'url(#bronze)', stroke: '#2A1808', 'stroke-width': 2 }, g);
  }
  function engrave(s, x, y, txt, a) {
    return L.svgText(s, x, y, txt, Object.assign({ fill: 'url(#title)', filter: 'url(#drop)' }, a));
  }

  function poster(stage, o) {
    var W = o.W, H = o.H, e = o.ed, cx = W / 2, cy = 640, r = 300, R = L.rng('ak-' + e.id);
    patina(stage, W, H, 'ak-' + e.id);
    var s = L.svgRoot(stage, W, H);
    defs(s);
    wheel(s, 120, 330, 230, 64, 5, R() * 20);
    wheel(s, W - 60, 1010, 280, 80, 6, R() * 20);
    wheel(s, W - 150, 330, 110, 32, 4, R() * 20);
    wheel(s, 160, 1060, 130, 38, 4, R() * 20);
    dial(s, cx, cy, r, (e.greek + ' · ' + e.word.toUpperCase() + ' · ' + e.latin.toUpperCase() + ' · ').repeat(3), 'dl');
    // l'aiguille sort de sous la plaque centrale gravée du pictogramme
    pointer(s, cx, cy, r * 0.9, 40 + R() * 260, e.accent);
    el('circle', { cx: cx, cy: cy, r: r * 0.56, fill: 'url(#plate)', stroke: '#3A2410', 'stroke-width': 1.5 }, s);
    var ic = L.svgIcon(s, e.icon, cx, cy, r * 0.84, { stroke: '#2A1808', width: 3.6, dot: e.accent });
    ic.setAttribute('filter', 'url(#etch)');
    var fs = Math.min(100, (W - 160) / (e.greek.length * 0.82));
    engrave(s, cx, 170, e.greek, { 'text-anchor': 'middle', 'font-family': '"Noto Serif Display"', 'font-weight': 700, 'font-size': fs, 'letter-spacing': fs * 0.14 });
    L.svgText(s, cx, 222, e.latin.toUpperCase() + '  ·  ' + e.role.toUpperCase(), { 'text-anchor': 'middle', fill: '#E9D2A6', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 25, 'letter-spacing': 8 });
    // cartouche de bronze
    var y0 = 1052;
    el('rect', { x: 120, y: y0, width: W - 240, height: 196, rx: 6, fill: 'rgba(20,14,8,.78)', stroke: '#C98C43', 'stroke-width': 1.2 }, s);
    L.svgText(s, cx, y0 + 58, e.word + ' — ' + e.meaning, { 'text-anchor': 'middle', fill: '#F2C27A', 'font-family': '"EB Garamond"', 'font-style': 'italic', 'font-size': 32 });
    L.wrap(e.pitch, '300 24px Commissioner', W - 320).slice(0, 2).forEach(function (line, i) {
      L.svgText(s, cx, y0 + 104 + i * 32, line, { 'text-anchor': 'middle', fill: '#CDBB9A', 'font-family': 'Commissioner', 'font-weight': 300, 'font-size': 24 });
    });
    L.svgText(s, cx, y0 + 176, 'KANTO APLO · CEPHALO SOPHIE · ' + String(e.n).padStart(2, '0') + '/13' + (e.status === 'pending' ? ' · EN COMPOSITION' : ''), { 'text-anchor': 'middle', fill: '#9C7A4A', 'font-family': '"JetBrains Mono"', 'font-size': 14, 'letter-spacing': 3 });
  }

  function kappaDial(s, cx, cy, r) {
    dial(s, cx, cy, r, 'ΚΕΦΑΛΗ · ΣΟΦΙΑ · ΚΑΝΤΟ ΑΠΛΟ · ΚΥΔΟΣ · '.repeat(3), 'kd');
    pointer(s, cx, cy, r * 0.9, 42, '#2DD4A0');
    el('circle', { cx: cx, cy: cy, r: r * 0.56, fill: 'url(#plate)', stroke: '#3A2410', 'stroke-width': 1.5 }, s);
    var t = L.svgText(s, cx - r * 0.02, cy + r * 0.25, 'Κ', { 'text-anchor': 'middle', fill: '#2A1808', 'font-family': '"Noto Serif Display"', 'font-weight': 700, 'font-size': r * 0.72, filter: 'url(#etch)' });
    return t;
  }

  function cover(stage, o) {
    var W = o.W, H = o.H;
    patina(stage, W, H, 'ak-cover');
    var s = L.svgRoot(stage, W, H);
    defs(s);
    wheel(s, 160, 230, 210, 60, 5, 8);
    wheel(s, 760, 800, 190, 56, 5, 3);
    wheel(s, 780, 190, 90, 28, 4, 10);
    kappaDial(s, 470, 470, 250);
    var x = 1190;
    engrave(s, x, 350, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', 'font-family': 'Cinzel', 'font-weight': 700, 'font-size': 70, 'letter-spacing': 12 });
    L.svgText(s, x, 410, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', fill: '#E9D2A6', 'font-family': '"Noto Serif Display"', 'font-weight': 500, 'font-size': 40, 'letter-spacing': 22 });
    L.svgText(s, x, 466, "« L'intelligence qui précède l'action »", { 'text-anchor': 'middle', fill: '#F2C27A', 'font-family': '"EB Garamond"', 'font-style': 'italic', 'font-size': 31 });
    // treize petites roues, une par éditeur
    var n = S.editors.length, step = 64;
    S.editors.forEach(function (e, i) {
      var px = x - (n - 1) * step / 2 + i * step, py = 580 + (i % 2) * 52;
      el('path', { d: L.gear(px, py, 30, 16, 4.5), fill: 'url(#bronze)', stroke: '#3A2410', filter: 'url(#drop)' }, s);
      el('circle', { cx: px, cy: py, r: 22, fill: 'url(#plate)' }, s);
      L.svgIcon(s, e.icon, px, py, 30, { stroke: '#2A1808', width: 5, dot: e.accent });
    });
    L.svgText(s, x, 716, 'KANTO APLO  ·  KÝDOS', { 'text-anchor': 'middle', fill: '#C98C43', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 20, 'letter-spacing': 8 });
  }
  function profile(stage, o) {
    var W = o.W, H = o.H;
    patina(stage, W, H, 'ak-profile');
    var s = L.svgRoot(stage, W, H);
    defs(s);
    wheel(s, 120, 140, 200, 56, 5, 4);
    wheel(s, W - 110, H - 120, 220, 60, 5, 9);
    kappaDial(s, W / 2, H / 2, 380);
  }
  function logo(stage, o) {
    var W = o.W, H = o.H, s = L.svgRoot(stage, W, H);
    defs(s);
    kappaDial(s, W / 2, 620, 420);
    L.svgText(s, W / 2, 1300, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', fill: '#A8722F', 'font-family': 'Cinzel', 'font-weight': 700, 'font-size': 118, 'letter-spacing': 22 });
    L.svgText(s, W / 2, 1395, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', fill: '#3F7A6A', 'font-family': '"Noto Serif Display"', 'font-weight': 600, 'font-size': 60, 'letter-spacing': 34 });
  }

  window.THEMES = window.THEMES || {};
  window.THEMES.antikythera = {
    id: 'antikythera', name: 'Ἀντικύθηρα', label: 'Le mécanisme',
    fonts: ['700 40px "Noto Serif Display"', '600 40px "Noto Serif Display"', '500 40px "Noto Serif Display"', '600 40px Cinzel', '700 40px Cinzel', 'italic 400 40px "EB Garamond"', '300 40px Commissioner', '400 40px "JetBrains Mono"'],
    render: function (stage, o) { return ({ poster: poster, cover: cover, profile: profile, logo: logo })[o.kind](stage, o); }
  };
})();
