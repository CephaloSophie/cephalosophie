/* ═══════════════════════════════════════════════════════════════════════
   THÈME Ἶρις — « Prisme »
   Iris, la messagère arc-en-ciel : lumière holographique en nappes,
   verre dépoli, lettres chromées irisées. Les captures réelles des
   éditeurs apparaissent dans des fenêtres de verre.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var L = window.LIB, S = window.STUDIO;
  var HOLO = 'linear-gradient(100deg,#ffffff 0%,#c9f3ff 18%,#9fb4ff 34%,#f5b8ff 50%,#ffe7b0 66%,#b8fff0 82%,#ffffff 100%)';

  /* Nappes de lumière irisée, floutées, puis grain fin. */
  function holo(stage, W, H, seed, accent) {
    var cv = L.canvas(W, H), c = cv.getContext('2d'), R = L.rng(seed);
    cv.style.cssText = 'position:absolute;inset:0';
    stage.appendChild(cv);
    c.fillStyle = '#06050B'; c.fillRect(0, 0, W, H);
    var cols = [accent, '#22E1FF', '#FF3EA5', '#8B5CF6', '#FFD23F', '#2DD4A0', accent];
    c.filter = 'blur(' + Math.round(Math.min(W, H) * 0.09) + 'px)';
    cols.forEach(function (col, i) {
      var x = W * (0.1 + R() * 0.8), y = H * (0.08 + R() * 0.84), r = Math.min(W, H) * (0.22 + R() * 0.26);
      var g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, L.rgba(col, i === 0 ? 0.85 : 0.55)); g.addColorStop(1, L.rgba(col, 0));
      c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r * (1.2 + R()), r, R() * 3, 0, Math.PI * 2); c.fill();
    });
    c.filter = 'none';
    // filets de lumière : ondes fines
    c.globalCompositeOperation = 'screen';
    for (var k = 0; k < 26; k++) {
      c.beginPath();
      var y0 = H * (0.15 + k / 26 * 0.7), amp = H * 0.06, ph = R() * 6;
      for (var x = -20; x <= W + 20; x += 8) {
        var y = y0 + Math.sin(x / W * 5 + ph + k * 0.18) * amp + Math.sin(x / W * 13 + k) * amp * 0.15;
        x < 0 ? c.moveTo(x, y) : c.lineTo(x, y);
      }
      c.strokeStyle = 'rgba(255,255,255,' + (0.02 + R() * 0.05) + ')'; c.lineWidth = 1; c.stroke();
    }
    c.globalCompositeOperation = 'source-over';
    var img = c.getImageData(0, 0, W, H), d = img.data;
    for (var i = 0; i < d.length; i += 4) { var n = (R() - 0.5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    c.putImageData(img, 0, 0);
    return cv;
  }
  function layer(stage, W, H) {
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;inset:0;width:' + W + 'px;height:' + H + 'px;color:#fff';
    stage.appendChild(d);
    return d;
  }
  function chrome(txt, size, extra) {
    return '<div style="font-family:Syne;font-weight:800;font-size:' + size + 'px;line-height:1;letter-spacing:' + (size * 0.04) + 'px;' +
      'background:' + HOLO + ';-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 24px rgba(160,140,255,.35));' + (extra || '') + '">' + txt + '</div>';
  }
  var GLASS = 'background:linear-gradient(140deg,rgba(255,255,255,.16),rgba(255,255,255,.04));-webkit-backdrop-filter:blur(28px) saturate(1.4);backdrop-filter:blur(28px) saturate(1.4);' +
    'border:1px solid rgba(255,255,255,.28);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 30px 80px -20px rgba(0,0,0,.7);';
  /* Pictogramme irisé (SVG, dégradé holographique). */
  function iconSvg(icon, size, w, id) {
    var paths = icon.line.map(function (d) { return '<path d="' + d + '" fill="none" stroke="url(#' + id + ')" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }).join('') +
      icon.dots.map(function (d) { return '<path d="' + d + '" fill="url(#' + id + ')"/>'; }).join('');
    return '<svg width="' + size + '" height="' + size + '" viewBox="-4 -4 108 108" style="overflow:visible;filter:drop-shadow(0 0 18px rgba(200,180,255,.45))">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#bff4ff"/><stop offset=".55" stop-color="#d8b8ff"/><stop offset=".8" stop-color="#ffd8a8"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>' + paths + '</svg>';
  }
  function pill(txt, extra) {
    return '<span style="display:inline-flex;align-items:center;gap:10px;padding:10px 20px;border-radius:999px;' + GLASS + 'font-family:\'JetBrains Mono\';font-size:15px;letter-spacing:3px;' + (extra || '') + '">' + txt + '</span>';
  }

  async function poster(stage, o) {
    var W = o.W, H = o.H, e = o.ed;
    holo(stage, W, H, 'iris-' + e.id, e.accent);
    var d = layer(stage, W, H), fs = 132;
    while (fs > 40 && L.measure(e.greek, '800 ' + fs + 'px Syne') + e.greek.length * fs * 0.04 > W - 150) fs -= 2;
    var media;
    if (e.shot) {
      await L.loadImg(e.shot);
      media = '<div style="position:absolute;left:46px;right:46px;top:46px;bottom:150px;border-radius:22px;overflow:hidden;background:#0b0b12;border:1px solid rgba(255,255,255,.18)">' +
        '<div style="height:34px;display:flex;align-items:center;gap:8px;padding:0 14px;background:rgba(255,255,255,.07)"><i style="width:11px;height:11px;border-radius:50%;background:#ff5f57"></i><i style="width:11px;height:11px;border-radius:50%;background:#febc2e"></i><i style="width:11px;height:11px;border-radius:50%;background:#28c840"></i>' +
        '<span style="margin-left:14px;font:13px \'JetBrains Mono\';opacity:.6">' + e.site + ' / ' + e.id + '</span></div>' +
        '<img src="' + e.shot + '" style="width:100%;height:calc(100% - 34px);object-fit:cover;object-position:top left;display:block"/></div>' +
        '<div style="position:absolute;right:56px;bottom:56px;width:190px;height:190px;border-radius:50%;display:grid;place-items:center;' + GLASS + '">' + iconSvg(e.icon, 120, 4, 'g1') + '</div>';
    } else {
      media = '<div style="position:absolute;inset:0;display:grid;place-items:center">' + iconSvg(e.icon, 400, 2.6, 'g1') + '</div>';
    }
    d.innerHTML =
      '<div style="position:absolute;left:70px;top:78px">' + chrome(e.greek, fs) +
      '<div style="margin-top:18px;font-family:\'Advent Pro\';font-weight:300;font-size:30px;letter-spacing:12px;opacity:.92">' + e.latin.toUpperCase() + ' · ' + e.role.toUpperCase() + '</div></div>' +
      '<div style="position:absolute;left:70px;right:70px;top:330px;height:640px;border-radius:44px;' + GLASS + '">' + media +
      (e.shot ? '' : '') + '</div>' +
      '<div style="position:absolute;left:70px;right:70px;top:1010px">' +
      '<div style="font-family:\'EB Garamond\';font-style:italic;font-size:34px;color:#F3EEFF">' + e.word + ' — ' + e.meaning + '</div>' +
      '<div style="margin-top:12px;font-family:Manrope;font-weight:300;font-size:26px;line-height:1.45;color:rgba(255,255,255,.78);max-width:900px">' + e.pitch + '</div></div>' +
      '<div style="position:absolute;left:70px;right:70px;bottom:64px;display:flex;gap:14px;align-items:center">' +
      pill('KANTO APLO') + pill('Nº ' + String(e.n).padStart(2, '0')) + (e.status === 'pending' ? pill('EN COMPOSITION', 'color:#ffd8a8') : '') +
      '<span style="margin-left:auto;font-family:Syne;font-weight:700;font-size:18px;letter-spacing:5px;opacity:.85">CEPHALO SOPHIE</span></div>';
    await new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });
  }

  function orb(size, k) {
    return '<div style="position:relative;width:' + size + 'px;height:' + size + 'px;border-radius:50%;' + GLASS +
      'display:grid;place-items:center;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.35),rgba(255,255,255,.05) 45%,rgba(140,120,255,.12) 100%)">' +
      '<div style="position:absolute;inset:' + size * 0.06 + 'px;border-radius:50%;border:1px solid rgba(255,255,255,.25)"></div>' +
      chrome('Κ', size * 0.62, 'font-family:\'Noto Serif Display\';font-weight:600;transform:translate(' + (-size * 0.02) + 'px,' + (size * 0.03) + 'px)') +
      '<i style="position:absolute;right:' + size * 0.13 + 'px;top:' + size * 0.13 + 'px;width:' + size * 0.08 + 'px;height:' + size * 0.08 + 'px;border-radius:50%;background:' + HOLO + ';box-shadow:0 0 30px rgba(255,255,255,.8)"></i>' +
      (k ? '' : '') + '</div>';
  }

  function cover(stage, o) {
    var W = o.W, H = o.H;
    holo(stage, W, H, 'iris-cover', '#8B5CF6');
    var d = layer(stage, W, H);
    d.innerHTML =
      '<div style="position:absolute;left:250px;top:202px">' + orb(520) + '</div>' +
      '<div style="position:absolute;left:860px;top:270px;width:720px">' + chrome('CEPHALO SOPHIE', 78) +
      '<div style="margin-top:20px;font-family:\'Advent Pro\';font-weight:300;font-size:40px;letter-spacing:22px">ΚΕΦΑΛΗ ΣΟΦΙΑ</div>' +
      '<div style="margin-top:22px;font-family:\'EB Garamond\';font-style:italic;font-size:32px;color:#F3EEFF">« L\'intelligence qui précède l\'action »</div>' +
      '<div style="margin-top:38px;display:inline-flex;gap:14px;padding:16px 22px;border-radius:999px;' + GLASS + '">' +
      S.editors.map(function (e, i) { return iconSvg(e.icon, 32, 6, 'c' + i); }).join('') + '</div>' +
      '<div style="margin-top:26px;font-family:Syne;font-weight:700;font-size:20px;letter-spacing:8px;opacity:.9">KANTO APLO · KÝDOS</div></div>';
  }
  function profile(stage, o) {
    var W = o.W, H = o.H;
    holo(stage, W, H, 'iris-profile', '#8B5CF6');
    var d = layer(stage, W, H);
    d.innerHTML = '<div style="position:absolute;left:' + (W / 2 - 360) + 'px;top:' + (H / 2 - 360) + 'px">' + orb(720) + '</div>';
  }
  function logo(stage, o) {
    var W = o.W, H = o.H;
    var holder = document.createElement('div');
    holder.style.cssText = 'position:absolute;left:' + (W / 2 - 470) + 'px;top:150px;width:940px;height:940px;border-radius:50%;overflow:hidden';
    stage.appendChild(holder);
    holo(holder, 940, 940, 'iris-logo', '#8B5CF6');
    var d = layer(stage, W, H);
    d.innerHTML = '<div style="position:absolute;left:' + (W / 2 - 380) + 'px;top:240px">' + orb(760) + '</div>' +
      '<div style="position:absolute;left:0;right:0;top:1180px;text-align:center;font-family:Syne;font-weight:800;font-size:116px;letter-spacing:12px;' +
      'background:linear-gradient(100deg,#5B3FD1,#C03FA8 50%,#2A9FC9);-webkit-background-clip:text;background-clip:text;color:transparent">CEPHALO SOPHIE</div>' +
      '<div style="position:absolute;left:0;right:0;top:1330px;text-align:center;font-family:\'Advent Pro\';font-weight:500;font-size:62px;letter-spacing:34px;color:#6B54C9">ΚΕΦΑΛΗ ΣΟΦΙΑ</div>';
  }

  window.THEMES = window.THEMES || {};
  window.THEMES.iris = {
    id: 'iris', name: 'Ἶρις', label: 'Prisme',
    fonts: ['800 40px Syne', '700 40px Syne', '300 40px "Advent Pro"', '500 40px "Advent Pro"', '300 40px Manrope', 'italic 400 40px "EB Garamond"', '600 40px "Noto Serif Display"', '400 40px "JetBrains Mono"'],
    render: function (stage, o) { return ({ poster: poster, cover: cover, profile: profile, logo: logo })[o.kind](stage, o); }
  };
})();
