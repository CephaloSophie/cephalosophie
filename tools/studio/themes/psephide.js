/* ═══════════════════════════════════════════════════════════════════════
   THÈME Ψηφιδωτό — « Mosaïque »
   ψηφίς, la tesselle, vient de ψῆφος : la pierre de Zeugma. Chaque visuel
   est une mosaïque byzantine de milliers de psèphoi — fond d'or posé en
   anneaux autour du médaillon, détail en tesselles fines.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LIB, S = window.STUDIO;

  var P = {
    lapis: '#1D3B7C', lapis2: '#13285A', lapisL: '#3A64B8', ivory: '#F1E6CC', oxblood: '#6E1A17', red: '#9C2A20',
    grout: '#1B140E', ink: '#120E0A', teal: '#2C7C78'
  };
  var GOLD = 'gold', DETAIL = 'detail';

  /* Toile + masques des matières (or, détail), dessinés ensemble.
     Toute forme peinte efface l'or sous elle ; seules les formes marquées GOLD le posent. */
  function Board(W, H) {
    var c = L.canvas(W, H), g = L.canvas(W, H), d = L.canvas(W, H);
    return { c: c, g: g, d: d, cx: c.getContext('2d'), gx: g.getContext('2d'), dx: d.getContext('2d'), W: W, H: H };
  }
  function shape(b, draw, color, mat) {
    b.cx.save(); b.cx.fillStyle = color; b.cx.strokeStyle = color; draw(b.cx); b.cx.restore();
    b.gx.save(); b.gx.fillStyle = b.gx.strokeStyle = '#fff';
    b.gx.globalCompositeOperation = mat === GOLD ? 'source-over' : 'destination-out';
    draw(b.gx); b.gx.restore();
    if (mat === DETAIL) { b.dx.save(); b.dx.fillStyle = b.dx.strokeStyle = '#fff'; draw(b.dx); b.dx.restore(); }
  }
  /* Assemble la carte lue par la mosaïque : rouge = or, vert = détail. */
  function matMap(b) {
    var m = L.canvas(b.W, b.H), x = m.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, b.W, b.H);
    x.globalCompositeOperation = 'lighter';
    [[b.g, '#f00'], [b.d, '#0f0']].forEach(function (t) {
      var tmp = L.canvas(b.W, b.H), tx = tmp.getContext('2d');
      tx.drawImage(t[0], 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = t[1]; tx.fillRect(0, 0, b.W, b.H);
      x.drawImage(tmp, 0, 0);
    });
    return m;
  }
  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  function ring(ctx, x, y, r, w) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.lineWidth = w; ctx.stroke(); }

  /* Médaillon : disque de lapis dégradé, anneaux ivoire et rouge. */
  function medallion(b, x, y, r, inner) {
    shape(b, function (c) {
      var g = c.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
      g.addColorStop(0, inner || P.lapisL); g.addColorStop(0.65, P.lapis); g.addColorStop(1, P.lapis2);
      c.fillStyle = g; circle(c, x, y, r);
    }, null);
    shape(b, function (c) { ring(c, x, y, r + r * 0.035, r * 0.05); }, P.ivory, null);
    shape(b, function (c) { ring(c, x, y, r + r * 0.09, r * 0.045); }, P.red, null);
    shape(b, function (c) { ring(c, x, y, r + r * 0.13, r * 0.03); }, P.ink, null);
  }
  /* Pictogramme : contour sombre puis trait ivoire (lisible en tesselles). */
  function icon(b, ic, x, y, s, col) {
    var w = Math.max(4.6, Math.min(12, 1150 / s));
    shape(b, function (c) { L.drawIcon(c, ic, x, y, s, { stroke: c.strokeStyle, width: w + 3.2, dot: c.strokeStyle }); }, P.ink, DETAIL);
    shape(b, function (c) { L.drawIcon(c, ic, x, y, s, { stroke: col || P.ivory, width: w, dot: col || P.ivory }); }, col || P.ivory, null);
  }
  /* Texte en tesselles. */
  function text(b, str, x, y, font, color, align, spacing) {
    shape(b, function (c) {
      c.font = font; c.textAlign = align || 'center'; c.textBaseline = 'alphabetic';
      if (spacing) c.letterSpacing = spacing + 'px';
      c.lineWidth = 6; c.lineJoin = 'round';
      c.strokeText(str, x, y); c.fillText(str, x, y);
    }, color, DETAIL);
  }
  /* Couronne de perles : l'ornement des médaillons byzantins. */
  function pearls(b, x, y, r, n, pr) {
    for (var i = 0; i < n; i++) {
      (function (a) {
        var px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
        shape(b, function (c) { circle(c, px, py, pr + 2.5); }, P.ink, DETAIL);
        shape(b, function (c) { circle(c, px, py, pr); }, i % 2 ? P.ivory : P.red, null);
      })(i * Math.PI * 2 / n);
    }
  }
  function textRing(b, str, x, y, r, font, color) {
    shape(b, function (c) {
      c.font = font; c.textAlign = 'center'; c.textBaseline = 'middle';
      var chars = str.split(''), step = Math.PI * 2 / chars.length;
      chars.forEach(function (ch, i) {
        var a = -Math.PI / 2 + i * step;
        c.save(); c.translate(x + Math.cos(a) * r, y + Math.sin(a) * r); c.rotate(a + Math.PI / 2);
        c.lineWidth = parseFloat(font.split(' ')[1]) * 0.1; c.lineJoin = 'round'; c.strokeText(ch, 0, 0); c.fillText(ch, 0, 0); c.restore();
      });
    }, color, DETAIL);
  }
  /* Frise : denticules ivoire et rouge entre deux filets sombres (lisible en tesselles). */
  function meanderBand(b, x, y, w, h) {
    shape(b, function (c) { c.fillRect(x, y, w, h); }, P.ink, null);
    var u = h * 0.62, n = Math.round(w / (u * 2)), step = w / n;
    for (var i = 0; i < n; i++) {
      (function (i) {
        shape(b, function (c) { c.fillRect(x + i * step + step * 0.08, y + h * 0.18, step * 0.42, h * 0.64); }, P.ivory, DETAIL);
        shape(b, function (c) { c.fillRect(x + i * step + step * 0.54, y + h * 0.18, step * 0.42, h * 0.64); }, P.red, DETAIL);
      })(i);
    }
  }
  function goldField(b) { shape(b, function (c) { c.fillRect(0, 0, b.W, b.H); }, '#D9AE55', GOLD); }

  function pave(stage, b, o) {
    var cv = L.canvas(b.W, b.H);
    cv.style.cssText = 'position:absolute;inset:0';
    stage.appendChild(cv);
    L.mosaic(cv.getContext('2d'), b.W, b.H, Object.assign({ cartoon: b.c, mat: matMap(b), grout: P.grout }, o));
    return cv;
  }
  /* Émail ancien : légère variation de lumière sur toute la surface. */
  function patina(cv, seed) {
    var c = cv.getContext('2d'), W = cv.width, H = cv.height;
    var g = c.createRadialGradient(W * 0.5, H * 0.38, Math.min(W, H) * 0.1, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
    g.addColorStop(0, 'rgba(255,240,200,0.10)'); g.addColorStop(1, 'rgba(10,6,2,0.45)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }

  /* Le monogramme Κ dans son médaillon. */
  function emblem(b, x, y, r) {
    medallion(b, x, y, r);
    var fs = r * 1.35;
    shape(b, function (c) {
      c.font = '800 ' + fs + 'px "Noto Serif Display"'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      c.lineWidth = fs * 0.07; c.lineJoin = 'round'; c.strokeText('Κ', x - r * 0.04, y + fs * 0.35);
    }, P.ink, DETAIL);
    shape(b, function (c) {
      c.font = '800 ' + fs + 'px "Noto Serif Display"'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      c.fillText('Κ', x - r * 0.04, y + fs * 0.35);
    }, P.ivory, null);
    // l'astre en orbite : la lune dorée du logo
    var mx = x + r * 0.62, my = y - r * 0.62;
    shape(b, function (c) { circle(c, mx, my, r * 0.13); }, P.ink, DETAIL);
    shape(b, function (c) { circle(c, mx, my, r * 0.1); }, '#E9C25C', GOLD);
    shape(b, function (c) { c.beginPath(); c.ellipse(x, y, r * 0.88, r * 0.88, 0, Math.PI * 1.15, Math.PI * 1.85); c.lineWidth = r * 0.025; c.stroke(); }, '#E9C25C', DETAIL);
  }

  function poster(stage, o) {
    var W = o.W, H = o.H, e = o.ed, b = Board(W, H);
    var hx = W / 2, hy = 488, hr = 236;
    goldField(b);
    // cadre : lapis + frise de méandre
    shape(b, function (c) { c.fillRect(0, 0, W, 64); c.fillRect(0, H - 300, W, 300); c.fillRect(0, 0, 64, H); c.fillRect(W - 64, 0, 64, H); }, P.lapis2, null);
    meanderBand(b, 64, 64, W - 128, 34);
    meanderBand(b, 64, H - 334, W - 128, 34);
    // abside : arc en plein cintre, bordé de rouge
    shape(b, function (c) { c.beginPath(); c.moveTo(104, H - 340); c.lineTo(104, 566); c.arc(W / 2, 566, W / 2 - 104, Math.PI, 0); c.lineTo(W - 104, H - 340); c.lineWidth = 14; c.stroke(); }, P.red, null);
    // rayons d'or plus clairs autour du halo
    shape(b, function (c) {
      for (var i = 0; i < 24; i++) {
        var a = i * Math.PI / 12;
        c.beginPath(); c.moveTo(hx + Math.cos(a) * (hr + 50), hy + Math.sin(a) * (hr + 50));
        c.lineTo(hx + Math.cos(a + 0.05) * (hr + 190), hy + Math.sin(a + 0.05) * (hr + 190));
        c.lineTo(hx + Math.cos(a - 0.05) * (hr + 190), hy + Math.sin(a - 0.05) * (hr + 190)); c.closePath(); c.fill();
      }
    }, '#F3D483', null);
    medallion(b, hx, hy, hr, L.mix(P.lapisL, e.accent, 0.25));
    // anneau intérieur à la couleur de l'éditeur
    shape(b, function (c) { ring(c, hx, hy, hr * 0.86, 9); }, e.accent, DETAIL);
    icon(b, e.icon, hx, hy, hr * 1.25);
    // nom grec en tesselles
    var font = '800 {s}px "Noto Serif Display"';
    var fs = L.fitFont(b.cx, e.greek, font, W - 300, 118);
    text(b, e.greek, hx, 880, font.replace('{s}', fs), P.oxblood, 'center', fs * 0.06);
    // pastilles de domino de part et d'autre (les psèphoi)
    [[150, 860], [W - 150, 860]].forEach(function (p) {
      shape(b, function (c) { c.beginPath(); c.roundRect(p[0] - 22, p[1] - 44, 44, 88, 8); c.fill(); }, P.ivory, DETAIL);
      shape(b, function (c) { c.fillRect(p[0] - 22, p[1] - 2, 44, 4); circle(c, p[0], p[1] - 22, 6); circle(c, p[0] - 9, p[1] + 14, 5); circle(c, p[0] + 9, p[1] + 30, 5); }, P.ink, null);
    });
    var cv = pave(stage, b, { center: [hx, hy], size: 13, fine: 6.2, seed: 'psephide-' + e.id });
    patina(cv);
    // Plaque gravée : texte net, lisible dans le fil
    var s = L.svgRoot(stage, W, H), y0 = H - 290;
    var defs = L.el('defs', {}, s);
    var lg = L.el('linearGradient', { id: 'pl', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    L.el('stop', { offset: 0, 'stop-color': '#0F1A38' }, lg); L.el('stop', { offset: 1, 'stop-color': '#08101F' }, lg);
    L.el('rect', { x: 64, y: y0, width: W - 128, height: 226, fill: 'url(#pl)' }, s);
    L.el('rect', { x: 78, y: y0 + 14, width: W - 156, height: 198, fill: 'none', stroke: '#C9963A', 'stroke-opacity': 0.55, 'stroke-width': 1.2 }, s);
    L.svgText(s, W / 2, y0 + 70, e.latin.toUpperCase() + '  ·  ' + e.role.toUpperCase(), { 'text-anchor': 'middle', fill: '#F1E6CC', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 34, 'letter-spacing': 7 });
    L.svgText(s, W / 2, y0 + 112, e.word + ' — ' + e.meaning, { 'text-anchor': 'middle', fill: '#E6C77A', 'font-family': 'EB Garamond', 'font-style': 'italic', 'font-size': 29 });
    L.wrap(e.pitch, '400 24px Commissioner', W - 260).slice(0, 2).forEach(function (line, i) {
      L.svgText(s, W / 2, y0 + 152 + i * 31, line, { 'text-anchor': 'middle', fill: '#BFB5A0', 'font-family': 'Commissioner', 'font-weight': 300, 'font-size': 24 });
    });
    L.svgText(s, 96, H - 26, 'KANTO APLO  ·  CEPHALO SOPHIE', { fill: '#C9963A', 'font-family': 'Cinzel', 'font-weight': 600, 'font-size': 19, 'letter-spacing': 5 });
    L.svgText(s, W - 96, H - 26, (e.status === 'pending' ? S.status.pending + '  ·  ' : '') + String(e.n).padStart(2, '0') + ' / 13', { 'text-anchor': 'end', fill: '#8E9AB8', 'font-family': 'JetBrains Mono', 'font-size': 17, 'letter-spacing': 3 });
  }

  /* Points répartis à distance égale sur un arc d'ellipse (angles en degrés). */
  function arcPoints(cx, cy, rx, ry, t0, t1, n) {
    var pts = [], acc = [0], N = 400;
    for (var i = 0; i <= N; i++) {
      var t = (t0 + (t1 - t0) * i / N) * Math.PI / 180;
      pts.push([cx + Math.cos(t) * rx, cy - Math.sin(t) * ry]);
      if (i) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    }
    var out = [], total = acc[N];
    for (var k = 0; k < n; k++) {
      var want = total * k / (n - 1), j = 0;
      while (acc[j] < want && j < N) j++;
      out.push(pts[j]);
    }
    return out;
  }

  function cover(stage, o) {
    var W = o.W, H = o.H, b = Board(W, H), cx = W / 2, cy = 462, r = 150, rx = 700, ry = 250;
    goldField(b);
    meanderBand(b, 0, 0, W, 46); meanderBand(b, 0, H - 46, W, 46);
    shape(b, function (c) { c.fillRect(0, 46, W, 10); c.fillRect(0, H - 56, W, 10); }, P.lapis2, null);
    shape(b, function (c) { c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); c.lineWidth = 7; c.stroke(); }, P.red, null);
    // sept éditeurs à gauche, six à droite : l'orbite de KANTO APLO
    var pos = arcPoints(cx, cy, rx, ry, 111, 249, 7).concat(arcPoints(cx, cy, rx, ry, 69, -69, 6));
    S.editors.forEach(function (e, i) {
      var x = pos[i][0], y = pos[i][1];
      shape(b, function (c) { circle(c, x, y, 62); }, P.ink, null);
      shape(b, function (c) { circle(c, x, y, 58); }, P.ivory, null);
      shape(b, function (c) { circle(c, x, y, 51); }, L.mix(e.accent, '#1D3B7C', 0.45), null);
      icon(b, e.icon, x, y, 80);
    });
    emblem(b, cx, cy, r);
    pearls(b, cx, cy, r + 46, 36, 9);
    var cv = pave(stage, b, { center: [cx, cy], size: 12, fine: 4.6, seed: 'psephide-cover' });
    patina(cv);
  }

  function profile(stage, o) {
    var W = o.W, H = o.H, b = Board(W, H), cx = W / 2, cy = H / 2, r = 300;
    goldField(b);
    emblem(b, cx, cy, r);
    pearls(b, cx, cy, r + 74, 44, 13);
    var cv = pave(stage, b, { center: [cx, cy], size: 15, fine: 6.5, seed: 'psephide-profile' });
    patina(cv);
  }

  function logo(stage, o) {
    var W = o.W, H = o.H, b = Board(W, H), cx = W / 2, cy = 640, r = 330;
    goldField(b);
    emblem(b, cx, cy, r);
    pearls(b, cx, cy, r + 80, 44, 14);
    var cv = pave(stage, b, { center: [cx, cy], size: 15, fine: 6.5, seed: 'psephide-logo' });
    // ne garder que le disque
    var c = cv.getContext('2d');
    c.globalCompositeOperation = 'destination-in';
    c.beginPath(); c.arc(cx, cy, r + 160, 0, Math.PI * 2); c.fill();
    c.globalCompositeOperation = 'source-over';
    c.lineWidth = 10; c.strokeStyle = P.oxblood; c.beginPath(); c.arc(cx, cy, r + 158, 0, Math.PI * 2); c.stroke();
    var s = L.svgRoot(stage, W, H);
    L.svgText(s, cx, 1300, 'CEPHALO SOPHIE', { 'text-anchor': 'middle', fill: '#B8862E', 'font-family': 'Cinzel', 'font-weight': 700, 'font-size': 118, 'letter-spacing': 22 });
    L.svgText(s, cx, 1400, 'ΚΕΦΑΛΗ ΣΟΦΙΑ', { 'text-anchor': 'middle', fill: '#1D3B7C', 'font-family': 'Noto Serif Display', 'font-weight': 600, 'font-size': 62, 'letter-spacing': 30 });
    L.svgText(s, cx, 1470, "L'INTELLIGENCE QUI PRÉCÈDE L'ACTION", { 'text-anchor': 'middle', fill: '#9C7A3A', 'font-family': 'Commissioner', 'font-weight': 500, 'font-size': 30, 'letter-spacing': 9 });
  }

  window.THEMES = window.THEMES || {};
  window.THEMES.psephide = {
    id: 'psephide', name: 'Ψηφιδωτό', label: 'Mosaïque',
    fonts: ['800 40px "Noto Serif Display"', '700 40px "Noto Serif Display"', '600 40px "Noto Serif Display"', '600 40px Cinzel', '700 40px Cinzel', 'italic 400 40px "EB Garamond"', '300 40px Commissioner', '700 40px Commissioner', '500 40px Commissioner', '400 40px "JetBrains Mono"'],
    render: function (stage, o) { return ({ poster: poster, cover: cover, profile: profile, logo: logo })[o.kind](stage, o); }
  };
})();
