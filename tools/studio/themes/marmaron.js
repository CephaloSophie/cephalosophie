/* ═══════════════════════════════════════════════════════════════════════
   THÈME Μάρμαρον — « Marbre & néon »
   Marbre noir de Portoro veiné d'or, calculé pixel par pixel ; dessus,
   chaque éditeur en tube de néon à sa couleur. L'Antiquité gravée,
   la lumière d'aujourd'hui.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LIB, S = window.STUDIO, el = L.el;

  /* Marbre de Portoro : fond noir, veines d'or et veines blanches. */
  function marble(stage, W, H, seed) {
    var cv = L.canvas(W, H), c = cv.getContext('2d');
    cv.style.cssText = 'position:absolute;inset:0';
    stage.appendChild(cv);
    var img = c.createImageData(W, H), d = img.data, N = L.noise(seed), N2 = L.noise(seed + 'b');
    var sc = 1 / 380, ang = 0.62, ca = Math.cos(ang), sa = Math.sin(ang);
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var u = (x * ca + y * sa) * sc, v = (-x * sa + y * ca) * sc;
        var t = N.fbm(u * 1.4, v * 1.4, 6);
        var vein = 1 - Math.abs(Math.sin((u * 2.2 + t * 5.5) * Math.PI));
        var fade = Math.max(0, Math.min(1, (N2.fbm(u * 0.7 + 3, v * 0.7 - 2, 3) - 0.38) * 4));
        var gold = Math.pow(vein, 26) * (0.25 + 0.75 * fade);
        var t2 = N2.fbm(u * 3 + 7, v * 3, 5);
        var white = Math.pow(1 - Math.abs(Math.sin((v * 3.1 + t2 * 7) * Math.PI)), 60) * 0.55;
        var cloud = N.fbm(u * 6, v * 6, 4) * 0.06;
        var base = 9 + cloud * 160;
        var i = (y * W + x) * 4;
        d[i] = Math.min(255, base + gold * 198 + white * 170);
        d[i + 1] = Math.min(255, base + gold * 150 + white * 168);
        d[i + 2] = Math.min(255, base + 3 + gold * 70 + white * 170);
        d[i + 3] = 255;
      }
    }
    c.putImageData(img, 0, 0);
    // poli : reflet doux en diagonale
    var g = c.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, 'rgba(255,255,255,0.05)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.35)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    return cv;
  }

  function defs(s) {
    var d = el('defs', {}, s);
    var g = el('linearGradient', { id: 'gold', x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    [['0', '#FFF1C4'], ['0.45', '#E3B85A'], ['0.55', '#B8862E'], ['1', '#F0D488']].forEach(function (x) { el('stop', { offset: x[0], 'stop-color': x[1] }, g); });
    // néon : halo large + halo serré + âme blanche
    var f = el('filter', { id: 'neon', x: '-30%', y: '-30%', width: '160%', height: '160%' }, d);
    el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 18, result: 'b1' }, f);
    el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 5, result: 'b2' }, f);
    var m = el('feMerge', {}, f);
    el('feMergeNode', { in: 'b1' }, m); el('feMergeNode', { in: 'b1' }, m); el('feMergeNode', { in: 'b2' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
    // gravure : ombre intérieure + liseré clair
    var e = el('filter', { id: 'carve', x: '-5%', y: '-20%', width: '110%', height: '140%' }, d);
    el('feOffset', { in: 'SourceAlpha', dx: 0, dy: 3, result: 'o' }, e);
    el('feGaussianBlur', { in: 'o', stdDeviation: 2, result: 'ob' }, e);
    el('feComposite', { in: 'SourceAlpha', in2: 'ob', operator: 'out', result: 'inner' }, e);
    el('feFlood', { 'flood-color': '#000', 'flood-opacity': 0.75, result: 'k' }, e);
    el('feComposite', { in: 'k', in2: 'inner', operator: 'in', result: 'shade' }, e);
    var m2 = el('feMerge', {}, e); el('feMergeNode', { in: 'SourceGraphic' }, m2); el('feMergeNode', { in: 'shade' }, m2);
    // néon fin pour les petits pictogrammes (le halo large déborderait)
    var fs = el('filter', { id: 'neonS', filterUnits: 'userSpaceOnUse', x: 0, y: 0, width: 4000, height: 4000 }, d);
    el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 6, result: 'b1' }, fs);
    el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 1.8, result: 'b2' }, fs);
    var ms = el('feMerge', {}, fs);
    el('feMergeNode', { in: 'b1' }, ms); el('feMergeNode', { in: 'b2' }, ms); el('feMergeNode', { in: 'SourceGraphic' }, ms);
    return d;
  }
  /* Tube de néon : couleur, puis âme presque blanche. */
  function neonIcon(s, icon, x, y, size, color, w) {
    var g = el('g', { filter: size < 120 ? 'url(#neonS)' : 'url(#neon)' }, s);
    L.svgIcon(g, icon, x, y, size, { stroke: color, width: w || 3.2, dot: color });
    L.svgIcon(s, icon, x, y, size, { stroke: L.mix(color, '#ffffff', 0.78), width: (w || 3.2) * 0.38, dot: L.mix(color, '#ffffff', 0.7) });
  }
  function neonText(s, x, y, txt, color, a) {
    var g = el('g', { filter: 'url(#neon)' }, s);
    L.svgText(g, x, y, txt, Object.assign({ fill: color }, a));
    L.svgText(s, x, y, txt, Object.assign({ fill: L.mix(color, '#ffffff', 0.72) }, a));
  }
  function carved(s, x, y, txt, a) {
    return L.svgText(s, x, y, txt, Object.assign({ fill: 'url(#gold)', filter: 'url(#carve)' }, a));
  }
  /* Reflet coloré du néon sur le marbre poli. */
  function glowPool(s, x, y, r, color, op) {
    var id = 'pool' + Math.round(x) + Math.round(y);
    var g = el('radialGradient', { id: id }, s.querySelector('defs'));
    el('stop', { offset: 0, 'stop-color': color, 'stop-opacity': op || 0.28 }, g);
    el('stop', { offset: 1, 'stop-color': color, 'stop-opacity': 0 }, g);
    el('circle', { cx: x, cy: y, r: r, fill: 'url(#' + id + ')', style: 'mix-blend-mode:screen' }, s);
  }

  function poster(stage, o) {
    var W = o.W, H = o.H, e = o.ed, cx = W / 2, cy = 620;
    marble(stage, W, H, 'marmaron-' + e.id);
    var s = L.svgRoot(stage, W, H);
    defs(s);
    glowPool(s, cx, cy, 520, e.accent, 0.3);
    // cadre gravé
    el('rect', { x: 46, y: 46, width: W - 92, height: H - 92, fill: 'none', stroke: 'url(#gold)', 'stroke-width': 1.4, opacity: 0.7 }, s);
    el('rect', { x: 58, y: 58, width: W - 116, height: H - 116, fill: 'none', stroke: 'url(#gold)', 'stroke-width': 0.6, opacity: 0.5 }, s);
    var fs = Math.min(112, (W - 200) / (e.greek.length * 0.8));
    carved(s, cx, 200, e.greek, { 'text-anchor': 'middle', 'font-family': '"Noto Serif Display"', 'font-weight': 600, 'font-size': fs, 'letter-spacing': fs * 0.12 });
    // anneau de néon et pictogramme
    var ring = el('g', { filter: 'url(#neon)' }, s);
    el('circle', { cx: cx, cy: cy, r: 300, fill: 'none', stroke: e.accent, 'stroke-width': 4, 'stroke-dasharray': '540 40 160 40' }, ring);
    el('circle', { cx: cx, cy: cy, r: 300, fill: 'none', stroke: L.mix(e.accent, '#fff', 0.75), 'stroke-width': 1.4, 'stroke-dasharray': '540 40 160 40' }, s);
    neonIcon(s, e.icon, cx, cy, 400, e.accent, 3.4);
    // nom latin en néon
    var lat = e.latin.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    var ls = Math.min(104, (W - 220) / (lat.length * 0.86));
    neonText(s, cx, 1048, lat, e.accent, { 'text-anchor': 'middle', 'font-family': 'Monoton', 'font-size': ls, 'letter-spacing': 6 });
    L.svgText(s, cx, 1112, e.role.toUpperCase() + '  ·  ' + e.word + ' — ' + e.meaning, { 'text-anchor': 'middle', fill: '#EDE3CC', 'font-family': 'Cinzel', 'font-weight': 500, 'font-size': 22, 'letter-spacing': 3 });
    L.wrap(e.pitch, '300 24px Commissioner', W - 260).slice(0, 2).forEach(function (line, i) {
      L.svgText(s, cx, 1160 + i * 32, line, { 'text-anchor': 'middle', fill: '#B9B2A4', 'font-family': 'Commissioner', 'font-weight': 300, 'font-size': 24 });
    });
    L.svgText(s, 92, H - 82, 'CEPHALO SOPHIE · KANTO APLO', { fill: '#D9B25E', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 17, 'letter-spacing': 5 });
    L.svgText(s, W - 92, H - 82, String(e.n).padStart(2, '0') + ' / 13' + (e.status === 'pending' ? '  ·  EN COMPOSITION' : ''), { 'text-anchor': 'end', fill: '#9C968B', 'font-family': '"JetBrains Mono"', 'font-size': 15, 'letter-spacing': 3 });
  }

  function emblem(s, cx, cy, r, color) {
    var g = el('g', { filter: 'url(#neon)' }, s);
    el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: color, 'stroke-width': r * 0.022 }, g);
    el('circle', { cx: cx + r * 0.7, cy: cy - r * 0.7, r: r * 0.07, fill: '#FF3EA5' }, g);
    el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: L.mix(color, '#fff', 0.8), 'stroke-width': r * 0.008 }, s);
    el('circle', { cx: cx + r * 0.7, cy: cy - r * 0.7, r: r * 0.035, fill: '#ffe0f0' }, s);
    carved(s, cx - r * 0.03, cy + r * 0.4, 'Κ', { 'text-anchor': 'middle', 'font-family': '"Noto Serif Display"', 'font-weight': 600, 'font-size': r * 1.25 });
  }

  function cover(stage, o) {
    var W = o.W, H = o.H;
    marble(stage, W, H, 'marmaron-cover');
    var s = L.svgRoot(stage, W, H);
    defs(s);
    glowPool(s, 470, 462, 420, '#22E1FF', 0.22);
    emblem(s, 470, 462, 230, '#22E1FF');
    var x = 1150;
    carved(s, x, 360, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', 'font-family': 'Cinzel', 'font-weight': 700, 'font-size': 74, 'letter-spacing': 12 });
    carved(s, x, 426, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', 'font-family': '"Noto Serif Display"', 'font-weight': 500, 'font-size': 42, 'letter-spacing': 24 });
    L.svgText(s, x, 486, "« L'intelligence qui précède l'action »", { 'text-anchor': 'middle', fill: '#EDE3CC', 'font-family': '"EB Garamond"', 'font-style': 'italic', 'font-size': 32 });
    var n = S.editors.length, step = 64, x0 = x - (n - 1) * step / 2;
    S.editors.forEach(function (e, i) { neonIcon(s, e.icon, x0 + i * step, 596, 46, e.accent, 4); });
    neonText(s, x, 690, 'KANTO APLO', '#2DD4A0', { 'text-anchor': 'middle', 'font-family': 'Monoton', 'font-size': 40, 'letter-spacing': 4 });
  }
  function profile(stage, o) {
    var W = o.W, H = o.H;
    marble(stage, W, H, 'marmaron-profile');
    var s = L.svgRoot(stage, W, H);
    defs(s);
    glowPool(s, W / 2, H / 2, 520, '#22E1FF', 0.25);
    emblem(s, W / 2, H / 2, 350, '#22E1FF');
  }
  function logo(stage, o) {
    var W = o.W, H = o.H;
    var holder = document.createElement('div');
    holder.style.cssText = 'position:absolute;left:' + (W / 2 - 470) + 'px;top:150px;width:940px;height:940px;border-radius:50%;overflow:hidden';
    stage.appendChild(holder);
    marble(holder, 940, 940, 'marmaron-logo');
    var s = L.svgRoot(stage, W, H);
    defs(s);
    el('circle', { cx: W / 2, cy: 620, r: 470, fill: 'none', stroke: 'url(#gold)', 'stroke-width': 8 }, s);
    emblem(s, W / 2, 620, 330, '#22E1FF');
    L.svgText(s, W / 2, 1300, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', fill: '#B8862E', 'font-family': 'Cinzel', 'font-weight': 700, 'font-size': 118, 'letter-spacing': 22 });
    L.svgText(s, W / 2, 1395, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', fill: '#15A9C8', 'font-family': '"Noto Serif Display"', 'font-weight': 500, 'font-size': 60, 'letter-spacing': 34 });
  }

  window.THEMES = window.THEMES || {};
  window.THEMES.marmaron = {
    id: 'marmaron', name: 'Μάρμαρον', label: 'Marbre & néon',
    fonts: ['600 40px "Noto Serif Display"', '500 40px "Noto Serif Display"', '400 40px Monoton', '500 40px Cinzel', '600 40px Cinzel', '700 40px Cinzel', 'italic 400 40px "EB Garamond"', '300 40px Commissioner', '400 40px "JetBrains Mono"'],
    render: function (stage, o) { return ({ poster: poster, cover: cover, profile: profile, logo: logo })[o.kind](stage, o); }
  };
})();
