/* ═══════════════════════════════════════════════════════════════════════
   STUDIO VISUELS — outils de dessin partagés par les thèmes
   Hasard reproductible, bruit, SVG, pictogrammes, méandre grec,
   engrenages, mosaïque de tesselles (psèphoi).
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  /* ── Hasard reproductible : même graine, même image ── */
  function rng(seed) {
    var a = 0;
    String(seed).split('').forEach(function (c) { a = (a * 31 + c.charCodeAt(0)) | 0; });
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ── Bruit de valeur lissé + fbm ── */
  function noise(seed) {
    var r = rng(seed), perm = new Uint8Array(512), vals = new Float32Array(256);
    for (var i = 0; i < 256; i++) { perm[i] = i; vals[i] = r(); }
    for (i = 255; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    for (i = 0; i < 256; i++) perm[i + 256] = perm[i];
    function s(t) { return t * t * (3 - 2 * t); }
    function n2(x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      xi &= 255; yi &= 255;
      var a = vals[perm[xi + perm[yi]]], b = vals[perm[xi + 1 + perm[yi]]];
      var c = vals[perm[xi + perm[yi + 1]]], d = vals[perm[xi + 1 + perm[yi + 1]]];
      var u = s(xf), v = s(yf);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    }
    function fbm(x, y, oct) {
      var sum = 0, amp = 0.5, f = 1, norm = 0;
      for (var o = 0; o < (oct || 5); o++) { sum += amp * n2(x * f, y * f); norm += amp; amp *= 0.5; f *= 2.03; }
      return sum / norm;
    }
    return { n2: n2, fbm: fbm };
  }

  /* ── SVG ── */
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function svgRoot(stage, W, H) {
    var s = el('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, xmlns: NS });
    s.style.cssText = 'position:absolute;inset:0';
    stage.appendChild(s);
    return s;
  }
  function html(parent, markup) { parent.insertAdjacentHTML('beforeend', markup); return parent.lastElementChild; }

  /* ── Images ── */
  function loadImg(src) {
    return new Promise(function (ok, ko) {
      var i = new Image();
      i.onload = function () { ok(i); };
      i.onerror = function () { ko(new Error('image ' + src)); };
      i.src = src;
    });
  }
  function canvas(W, H) {
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    return c;
  }

  /* ── Couleurs ── */
  function hex(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(h, a) { var c = hex(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mix(a, b, t) {
    var x = hex(a), y = hex(b);
    return '#' + [0, 1, 2].map(function (i) { return Math.round(x[i] + (y[i] - x[i]) * t).toString(16).padStart(2, '0'); }).join('');
  }

  /* ── Pictogrammes ── */
  function iconPath2D(icon) {
    return { line: icon.line.map(function (d) { return new Path2D(d); }), dots: icon.dots.map(function (d) { return new Path2D(d); }) };
  }
  /* Dessine un pictogramme (traits + pastilles) sur un contexte 2D, centré en (x,y), taille s. */
  function drawIcon(ctx, icon, x, y, s, o) {
    o = o || {};
    var p = iconPath2D(icon);
    ctx.save();
    ctx.translate(x - s / 2, y - s / 2);
    ctx.scale(s / 100, s / 100);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = (o.width || 3.2);
    if (o.fill) { ctx.fillStyle = o.fill; p.line.forEach(function (q) { ctx.fill(q); }); }
    ctx.strokeStyle = o.stroke || '#fff';
    p.line.forEach(function (q) { ctx.stroke(q); });
    ctx.fillStyle = o.dot || o.stroke || '#fff';
    p.dots.forEach(function (q) { ctx.fill(q); });
    ctx.restore();
  }
  /* Groupe SVG d'un pictogramme. */
  function svgIcon(parent, icon, x, y, s, o) {
    o = o || {};
    var g = el('g', { transform: 'translate(' + (x - s / 2) + ' ' + (y - s / 2) + ') scale(' + (s / 100) + ')', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
    icon.line.forEach(function (d) {
      el('path', { d: d, fill: o.fill || 'none', stroke: o.stroke || '#fff', 'stroke-width': o.width || 3, 'vector-effect': o.nonScaling ? 'non-scaling-stroke' : null, filter: o.filter, opacity: o.opacity }, g);
    });
    icon.dots.forEach(function (d) { el('path', { d: d, fill: o.dot || o.stroke || '#fff', stroke: 'none' }, g); });
    return g;
  }
  /* Points répartis le long des traits d'un pictogramme (pour les constellations). */
  function iconPoints(icon, step) {
    var tmp = el('svg', { width: 100, height: 100 });
    tmp.style.cssText = 'position:absolute;left:-9999px';
    document.body.appendChild(tmp);
    var out = [];
    icon.line.concat(icon.dots).forEach(function (d, k) {
      var p = el('path', { d: d }, tmp), L = p.getTotalLength(), n = Math.max(2, Math.round(L / step));
      var sub = [];
      for (var i = 0; i <= n; i++) { var q = p.getPointAtLength(L * i / n); sub.push([q.x, q.y]); }
      out.push({ pts: sub, dot: k >= icon.line.length });
    });
    tmp.remove();
    return out;
  }

  /* ── Méandre grec (clé) sur une bande horizontale : chemin SVG ── */
  function meander(x0, y0, w, h) {
    var u = h / 5, n = Math.floor(w / (u * 6)), d = '', x = x0 + (w - n * u * 6) / 2;
    for (var i = 0; i < n; i++) {
      var X = x + i * u * 6;
      d += 'M' + X + ' ' + (y0 + 5 * u) + ' V' + y0 + ' H' + (X + 4 * u) + ' V' + (y0 + 3 * u) + ' H' + (X + 2 * u) + ' V' + (y0 + 2 * u) +
        ' H' + (X + 3 * u) + ' V' + (y0 + u) + ' H' + (X + u) + ' V' + (y0 + 4 * u) + ' H' + (X + 5 * u) + ' V' + y0 + ' H' + (X + 6 * u) + ' ';
    }
    return d;
  }

  /* ── Engrenage : chemin SVG d'une roue dentée ── */
  function gear(cx, cy, r, teeth, depth, holeR) {
    var d = '', step = Math.PI * 2 / teeth;
    for (var i = 0; i < teeth; i++) {
      var a = i * step;
      var pts = [[a, r - depth], [a + step * 0.12, r], [a + step * 0.42, r], [a + step * 0.54, r - depth]];
      pts.forEach(function (p, j) {
        var x = cx + Math.cos(p[0]) * p[1], y = cy + Math.sin(p[0]) * p[1];
        d += (i === 0 && j === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
      });
      var a2 = a + step, x2 = cx + Math.cos(a2) * (r - depth), y2 = cy + Math.sin(a2) * (r - depth);
      d += 'A' + (r - depth) + ' ' + (r - depth) + ' 0 0 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' ';
    }
    d += 'Z';
    if (holeR) d += ' ' + window.STUDIO.C(cx, cy, holeR);
    return d;
  }

  /* ── Texte ── */
  function fitFont(ctx, text, font, maxW, maxSize) {
    var size = maxSize;
    for (; size > 8; size -= 2) {
      ctx.font = font.replace('{s}', size);
      if (ctx.measureText(text).width <= maxW) break;
    }
    return size;
  }
  function measure(text, font) {
    var c = measure.c || (measure.c = canvas(10, 10).getContext('2d'));
    c.font = font;
    return c.measureText(text).width;
  }
  /* Coupe un texte en lignes de largeur maximale. */
  function wrap(text, font, maxW) {
    var words = text.split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (measure(t, font) > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  /* Espacement des lettres : chaîne avec espaces fines simulées par letter-spacing SVG. */
  function svgText(parent, x, y, text, a) {
    var t = el('text', Object.assign({ x: x, y: y }, a), parent);
    t.textContent = text;
    return t;
  }

  /* ════════════════ Mosaïque ════════════════
     cartoon : canvas du dessin à paver (couleurs plates)
     mat     : canvas des matières — rouge = or (smalt doré), vert = détail (tesselles fines),
               bleu = zone vide (le joint reste visible)
     Le fond est posé en anneaux autour de `center` (andamento des absides
     byzantines) ; le détail est posé en petites tesselles alignées. */
  function mosaic(ctx, W, H, o) {
    var R = rng(o.seed || 'psephos');
    var cd = o.cartoon.getContext('2d').getImageData(0, 0, W, H).data;
    var md = o.mat.getContext('2d').getImageData(0, 0, W, H).data;
    var s = o.size || 12, fs = o.fine || s * 0.5;
    var gap = o.gap == null ? 0.16 : o.gap;
    function at(x, y) { x = Math.max(0, Math.min(W - 1, x | 0)); y = Math.max(0, Math.min(H - 1, y | 0)); return (y * W + x) * 4; }
    function isDetail(x, y) { return md[at(x, y) + 1] > 128; }
    function isVoid(x, y) { return md[at(x, y) + 2] > 128; }
    function isGold(x, y) { return md[at(x, y)] > 128; }
    function sample(x, y, r) {
      var acc = [0, 0, 0], pts = [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]];
      pts.forEach(function (p) { var i = at(x + p[0], y + p[1]); acc[0] += cd[i]; acc[1] += cd[i + 1]; acc[2] += cd[i + 2]; });
      return [acc[0] / 5, acc[1] / 5, acc[2] / 5];
    }
    ctx.fillStyle = o.grout || '#17120d';
    ctx.fillRect(0, 0, W, H);

    var gold = o.gold || ['#F6D77A', '#E8BC4E', '#C9963A', '#A97A24', '#FFE9A6'];
    function tile(x, y, w, h, ang, fine) {
      var col;
      var gld = isGold(x, y);
      if (gld) {
        var g = gold[Math.floor(R() * gold.length)];
        col = hex(g);
      } else {
        col = sample(x, y, fine ? 1 : 2);
      }
      var j = (o.jitter == null ? 0.07 : o.jitter);
      var k = 1 + (R() - 0.5) * 2 * j * (gld ? 2.2 : 1);
      var c = col.map(function (v) { return Math.max(0, Math.min(255, v * k + (R() - 0.5) * 10)); });
      var hw = w / 2 * (1 - gap * 0.5), hh = h / 2 * (1 - gap * 0.5), e = Math.min(w, h) * 0.09;
      var pts = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(function (p) { return [p[0] + (R() - 0.5) * e * 2, p[1] + (R() - 0.5) * e * 2]; });
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ang + (R() - 0.5) * 0.12);
      // ombre portée
      ctx.beginPath();
      pts.forEach(function (p, i) { ctx[i ? 'lineTo' : 'moveTo'](p[0] + 1, p[1] + 1.4); });
      ctx.closePath(); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill();
      ctx.beginPath();
      pts.forEach(function (p, i) { ctx[i ? 'lineTo' : 'moveTo'](p[0], p[1]); });
      ctx.closePath();
      var base = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
      if (gld) {
        var gr = ctx.createLinearGradient(-hw, -hh, hw, hh);
        gr.addColorStop(0, 'rgb(' + Math.min(255, c[0] + 40) + ',' + Math.min(255, c[1] + 34) + ',' + Math.min(255, c[2] + 20) + ')');
        gr.addColorStop(0.5, base);
        gr.addColorStop(1, 'rgb(' + c[0] * 0.72 + ',' + c[1] * 0.68 + ',' + c[2] * 0.6 + ')');
        ctx.fillStyle = gr;
      } else ctx.fillStyle = base;
      ctx.fill();
      // reflet sur l'arête haute
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]);
      ctx.strokeStyle = gld ? 'rgba(255,248,220,.55)' : 'rgba(255,255,255,.14)'; ctx.lineWidth = 1; ctx.stroke();
      if (gld && R() < 0.12) { ctx.fillStyle = 'rgba(255,255,240,.6)'; ctx.fillRect(-hw * 0.4, -hh * 0.5, hw * 0.5, hh * 0.25); }
      ctx.restore();
    }

    // 1. Fond en anneaux autour du centre (hors détail et hors vide)
    var cx = o.center[0], cy = o.center[1];
    var maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + s;
    var ringStep = s * 1.02;
    for (var r = s * 0.6; r < maxR; r += ringStep) {
      var n = Math.max(6, Math.floor(2 * Math.PI * r / (s * 1.04)));
      var off = R() * Math.PI * 2;
      for (var k2 = 0; k2 < n; k2++) {
        var a = off + k2 * Math.PI * 2 / n;
        var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (x < -s || y < -s || x > W + s || y > H + s) continue;
        if (isDetail(x, y) || isVoid(x, y)) continue;
        tile(x, y, 2 * Math.PI * r / n, s, a + Math.PI / 2, false);
      }
    }
    // 2. Détail : petites tesselles en rangs droits
    for (var yy = fs / 2; yy < H; yy += fs) {
      var shift = (Math.round(yy / fs) % 2) * fs * 0.5;
      for (var xx = fs / 2 + shift; xx < W; xx += fs) {
        if (!isDetail(xx, yy) || isVoid(xx, yy)) continue;
        tile(xx, yy, fs, fs, 0, true);
      }
    }
  }

  window.LIB = {
    rng: rng, noise: noise, el: el, svgRoot: svgRoot, html: html, loadImg: loadImg, canvas: canvas,
    hex: hex, rgba: rgba, mix: mix, drawIcon: drawIcon, svgIcon: svgIcon, iconPoints: iconPoints,
    meander: meander, gear: gear, fitFont: fitFont, measure: measure, wrap: wrap, svgText: svgText, mosaic: mosaic
  };
})();
