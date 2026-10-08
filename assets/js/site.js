/* ═══════════════════════════════════════════════════════════════════════
   CEPHALO SOPHIE — comportement du site
   Ciel étoilé (dessiné une fois), tête-constellation, changement d'ambiance
   par section, univers KANTO APLO vivant, sections Kýdos.
   Aucun écouteur de scroll : IntersectionObserver partout. L'univers ne
   s'anime que lorsqu'il est à l'écran.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var D = window.CEPHALO;
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* Texte bilingue : les deux langues sont dans le DOM, le CSS masque l'autre. */
  function bi(o, tag) {
    tag = tag || 'span';
    if (typeof o === 'string') return esc(o);
    return '<' + tag + ' data-fr>' + esc(o.fr) + '</' + tag + '><' + tag + ' data-en>' + esc(o.en) + '</' + tag + '>';
  }
  function L(fr, en) { return { fr: fr, en: en }; }

  /* ════════════════ Ciel : dessiné une seule fois (pas d'animation par image) ════════════════ */
  var sky = $('sky');
  function drawSky() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth, h = window.innerHeight;
    sky.width = w * dpr; sky.height = h * dpr;
    var ctx = sky.getContext('2d');
    ctx.scale(dpr, dpr);
    var n = Math.round(w * h / 2600);
    var tints = ['#ffffff', '#ffffff', '#ffffff', '#E6D6A8', '#C9B8FF', '#9AF3D6'];
    for (var i = 0; i < n; i++) {
      var r = Math.random();
      ctx.globalAlpha = 0.15 + Math.random() * 0.6;
      ctx.fillStyle = tints[Math.floor(Math.random() * tints.length)];
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, r < 0.75 ? 0.5 + Math.random() * 0.5 : 0.9 + Math.random() * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawSky();
  var skyTimer = 0, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (Math.abs(window.innerWidth - lastW) < 40) return; // la barre d'adresse mobile ne redessine pas le ciel
    lastW = window.innerWidth;
    clearTimeout(skyTimer); skyTimer = setTimeout(drawSky, 250);
  });
  (function twinkles() {
    var html = '';
    for (var i = 0; i < 26; i++) {
      html += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) +
        '%;--t:' + (3 + Math.random() * 4).toFixed(1) + 's;--dl:' + (Math.random() * 5).toFixed(1) + 's"></i>';
    }
    $('twinkles').innerHTML = html;
  })();

  /* ════════════════ La tête-constellation ════════════════
     Un profil grec tracé d'étoile en étoile ; dans l'esprit, l'étoile KANTO APLO
     et ses deux mondes en orbite. */
  (function head() {
    var P = [[150, 452], [150, 392], [128, 352], [110, 300], [104, 240], [116, 180], [146, 128], [190, 92], [246, 76], [298, 86],
      [336, 116], [352, 160], [356, 198], [350, 214], [368, 250], [386, 284], [364, 296], [370, 316], [362, 330],
      [364, 352], [358, 374], [338, 394], [304, 404], [296, 452]];
    var eye = [330, 224], ear = [[198, 228], [222, 234], [228, 262], [210, 286], [192, 264]];
    var mind = [232, 178];
    var bright = { 8: 1, 11: 1, 15: 1, 20: 1, 4: 1, 6: 1 };
    var d = 'M' + P.map(function (p) { return p.join(','); }).join(' L');
    var lines = '<path d="' + d + '" pathLength="1"/>' +
      '<path d="M' + ear.map(function (p) { return p.join(','); }).join(' L') + ' Z" pathLength="1" class="in-line"/>';
    [[P[8], 'in'], [P[11], 'in'], [eye, 'in'], [ear[1], 'in'], [P[5], 'in'], [P[3], 'in']].forEach(function (t) {
      lines += '<line x1="' + mind[0] + '" y1="' + mind[1] + '" x2="' + t[0][0] + '" y2="' + t[0][1] + '" pathLength="1" class="in-line"/>';
    });
    var stars = '';
    P.concat([eye], ear).forEach(function (p, i) {
      var big = bright[i] || p === eye;
      stars += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (big ? 3.2 : 1.4 + Math.random() * 1.1).toFixed(1) +
        '" style="--sd:' + (0.15 + i * 0.07).toFixed(2) + 's;--tw:' + (3 + Math.random() * 3).toFixed(1) + 's;--so:' + (big ? 1 : 0.75) + '"/>';
    });
    $('headLines').innerHTML = lines;
    $('headStars').innerHTML = stars;
    // Orbites des deux mondes dans l'esprit : mouvement exact le long de l'ellipse (SVG natif).
    var g = document.querySelector('.mind');
    g.insertAdjacentHTML('beforeend',
      '<circle r="4" fill="#2DD4A0" style="filter:drop-shadow(0 0 4px #2DD4A0)"><animateMotion dur="7s" repeatCount="indefinite" path="M34,0 A34,12 0 1,1 -34,0 A34,12 0 1,1 34,0"/></circle>' +
      '<circle r="5" fill="#FF3EA5" style="filter:drop-shadow(0 0 5px #FF3EA5)"><animateMotion dur="12s" repeatCount="indefinite" path="M-52,0 A52,19 0 1,0 52,0 A52,19 0 1,0 -52,0"/></circle>');
    var svg = $('head');
    if (reduce && svg.pauseAnimations) svg.pauseAnimations();
    requestAnimationFrame(function () { requestAnimationFrame(function () { svg.classList.add('drawn'); }); });
  })();

  /* ════════════════ Apparitions ════════════════ */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      revealIO.unobserve(en.target);
      if (en.target.__onReveal) en.target.__onReveal();
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  function observeReveal(scope) {
    (scope || document).querySelectorAll('[data-reveal]').forEach(function (el) {
      if (reduce) { el.classList.add('in'); if (el.__onReveal) el.__onReveal(); } else revealIO.observe(el);
    });
  }

  /* ════════════════ Ambiance par monde + lien actif dans le menu ════════════════ */
  var body = document.body, hdr = $('hdr');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.hdr-nav a'));
  var worldIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      body.dataset.world = en.target.dataset.world;
      var id = en.target.id;
      navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + id); });
    });
  }, { rootMargin: '-45% 0px -54% 0px' });
  document.querySelectorAll('main > section[data-world]').forEach(function (s) { worldIO.observe(s); });
  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:60px;pointer-events:none';
  body.prepend(sentinel);
  new IntersectionObserver(function (en) { hdr.classList.toggle('solid', !en[0].isIntersecting); }).observe(sentinel);

  /* ════════════════ Menu mobile ════════════════ */
  var menu = $('menu'), menuBtn = $('menuBtn');
  function setMenu(open) {
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add('open'); }); });
    } else {
      menu.classList.remove('open');
      setTimeout(function () { if (!menu.classList.contains('open')) menu.hidden = true; }, reduce ? 0 : 650);
    }
    root.classList.toggle('menu-open', open);
    body.classList.toggle('locked', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  /* ════════════════ Langue ════════════════ */
  $('langToggle').addEventListener('click', function () {
    var next = root.dataset.lang === 'fr' ? 'en' : 'fr';
    root.dataset.lang = next; root.lang = next;
    try { localStorage.setItem('cephalo-lang', next); } catch (e) { /* stockage indisponible : sans conséquence */ }
  });

  /* ════════════════ Portails : légère inclinaison 3D au survol (souris uniquement) ════════════════ */
  if (finePointer && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ════════════════ L'univers de KANTO APLO ════════════════ */
  (function universe() {
    var cosmos = $('cosmos'), svg = $('cosmosSvg'), panel = $('panel'), chips = $('chips'), tourBtn = $('tourBtn');
    var NS = 'http://www.w3.org/2000/svg';
    var star = D.star, obs = D.observer;
    var all = [star].concat(D.bodies, [obs]);
    var byId = {};
    all.forEach(function (b) { byId[b.id] = b; });
    D.bodies.forEach(function (b) { b.parentBody = b.parent ? byId[b.parent] : null; });

    /* Éléments : une orbite SVG par astre, un bouton par astre. */
    var orbitEls = {};
    D.bodies.forEach(function (b) {
      var e = document.createElementNS(NS, 'ellipse');
      e.setAttribute('class', 'orb' + (b.parent ? ' moon-orb' : ''));
      e.style.setProperty('--oc', b.color);
      svg.appendChild(e);
      orbitEls[b.id] = e;
    });
    var gravEls = {};
    var typos = byId.typos;
    (typos.perturbedBy || []).forEach(function (id) {
      var l = document.createElementNS(NS, 'line');
      l.setAttribute('class', 'grav');
      svg.appendChild(l);
      gravEls[id] = l;
    });
    var gaze = document.createElementNS(NS, 'line');
    gaze.setAttribute('class', 'gaze');
    svg.appendChild(gaze);

    function makeBody(b, cls) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'body ' + (cls || '') + (b.massive ? ' massive' : '');
      el.style.setProperty('--c', b.color);
      el.setAttribute('aria-label', b.latin + ' — ' + b.title.fr);
      el.dataset.id = b.id;
      el.innerHTML = (cls === 'eye'
        ? '<span class="sph"></span><svg viewBox="-20 -20 40 40" aria-hidden="true"><circle r="17" class="eye-ring"/><path d="M-13,0 Q0,-11 13,0 Q0,11 -13,0 Z" fill="rgba(230,214,168,.12)" stroke="#E6D6A8" stroke-width="1.2"/><circle r="4.2" fill="#E6D6A8"/><circle r="1.6" fill="#05040d"/></svg>'
        : '<span class="sph"></span>') +
        '<span class="lbl">' + esc(b.latin) + '</span>';
      cosmos.appendChild(el);
      b.el = el;
      return el;
    }
    makeBody(star, 'star');
    D.bodies.forEach(function (b) { makeBody(b, b.parent ? 'moon' : 'planet'); });
    makeBody(obs, 'eye');

    /* Puces : accès direct (clavier, mobile, lecteurs d'écran). */
    var tourOrder = ['kanto', 'hephaistos', 'tekton', 'typos', 'logos', 'skopos', 'mantis', 'synergos', 'kairos', 'hermes', 'skhema', 'epoptes'];
    chips.innerHTML = tourOrder.map(function (id) {
      var b = byId[id];
      return '<button type="button" class="chip" role="tab" aria-selected="false" data-id="' + id + '" style="--c:' + b.color + '"><i></i>' + esc(b.latin) + '</button>';
    }).join('');

    /* Géométrie de la scène */
    var W = 0, H = 0, cx = 0, cy = 0, R = 0, tilt = 0.38, k = 1;
    function layout() {
      W = cosmos.clientWidth; H = cosmos.clientHeight;
      cx = W / 2; cy = H / 2;
      R = Math.min(W / 2 - 26, (H / 2 - 30) / 0.42);
      tilt = Math.min(0.6, (H / 2 - 34) / R);
      k = Math.max(0.62, Math.min(1.25, R / 420));
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      all.forEach(function (b) {
        var s = b === star ? 64 : b === obs ? 40 : b.size;
        b.el.style.setProperty('--s', Math.round(s * k) + 'px');
      });
      D.bodies.forEach(function (b) {
        if (b.parent) return;
        var e = orbitEls[b.id];
        e.setAttribute('cx', cx); e.setAttribute('cy', cy);
        e.setAttribute('rx', b.orbit.a * R); e.setAttribute('ry', b.orbit.a * R * tilt);
      });
      obs.x = W - 40 * k; obs.y = 40 * k;
      gaze.setAttribute('x1', obs.x); gaze.setAttribute('y1', obs.y);
      gaze.setAttribute('x2', cx); gaze.setAttribute('y2', cy);
    }

    /* Position d'un astre à l'instant t (secondes, temps de la scène). */
    function place(b, t) {
      var o = b.orbit, ang = o.p + (Math.PI * 2 * t) / o.T;
      var px = cx, py = cy, a = o.a * R, depth;
      if (b.parentBody) { px = b.parentBody.x; py = b.parentBody.y; }
      var u = Math.cos(ang) * a, v = Math.sin(ang) * a * tilt;
      if (b === typos) {
        // Orbite ovale instable : plus Mantis ou Synergos s'approchent, plus elle s'étire vers eux.
        var pull = 0, dirX = 0, dirY = 0;
        typos.perturbedBy.forEach(function (id) {
          var p = byId[id], dx = p.x - px, dy = p.y - py, dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var f = Math.max(0, 1 - dist / (0.62 * R));
          pull += f; dirX += dx / dist * f; dirY += dy / dist * f;
          var l = gravEls[id];
          l.setAttribute('x1', p.x); l.setAttribute('y1', p.y);
          l.setAttribute('x2', b.x || px); l.setAttribute('y2', b.y || py);
          l.style.opacity = (0.08 + f * 0.6).toFixed(2);
        });
        pull = Math.min(1, pull);
        var phi = Math.atan2(dirY, dirX);
        var rx = a * (1 + 0.9 * pull), ry = a * tilt * (1.6 - 0.9 * pull);
        var lu = Math.cos(ang) * rx, lv = Math.sin(ang) * ry;
        u = lu * Math.cos(phi) - lv * Math.sin(phi);
        v = lu * Math.sin(phi) + lv * Math.cos(phi);
        var e = orbitEls.typos;
        e.setAttribute('cx', px); e.setAttribute('cy', py); e.setAttribute('rx', rx); e.setAttribute('ry', ry);
        e.setAttribute('transform', 'rotate(' + (phi * 180 / Math.PI).toFixed(1) + ' ' + px.toFixed(1) + ' ' + py.toFixed(1) + ')');
        depth = (b.parentBody.depth || 0) + Math.sin(ang) * 0.3;
      } else if (b.parentBody) {
        var me = orbitEls[b.id];
        me.setAttribute('cx', px); me.setAttribute('cy', py); me.setAttribute('rx', a); me.setAttribute('ry', a * tilt);
        depth = (b.parentBody.depth || 0) + Math.sin(ang) * 0.3;
      } else {
        depth = Math.sin(ang);
      }
      b.x = px + u; b.y = py + v; b.depth = depth;
      var sc = b.parentBody ? 1 : 0.8 + 0.3 * (depth + 1) / 2;
      b.el.style.transform = 'translate3d(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ')';
      var z = Math.round(20 + depth * 10);
      if (b.z !== z) { b.z = z; b.el.style.zIndex = z; }
      b.el.style.opacity = (b.parentBody ? 1 : 0.72 + 0.28 * (depth + 1) / 2).toFixed(2);
    }

    var t = 0, speed = 1, target = 1, last = 0, raf = 0, visible = false, hovering = false;
    function frame(now) {
      raf = 0;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      speed += (target - speed) * Math.min(1, dt * 3);
      t += dt * speed;
      render();
      if (visible && !document.hidden && !reduce) raf = requestAnimationFrame(frame);
    }
    function render() {
      star.x = cx; star.y = cy;
      star.el.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      star.el.style.zIndex = 20;
      // Planètes d'abord, puis lunes, puis satellites : chacun suit son parent.
      D.bodies.filter(function (b) { return !b.parent; }).forEach(function (b) { place(b, t); });
      D.bodies.filter(function (b) { return b.parent && !byId[b.parent].parent; }).forEach(function (b) { place(b, t); });
      D.bodies.filter(function (b) { return b.parent && byId[b.parent].parent; }).forEach(function (b) { place(b, t); });
      obs.el.style.transform = 'translate3d(' + obs.x + 'px,' + obs.y + 'px,0)';
    }
    function start() { if (!raf && !reduce) { last = 0; raf = requestAnimationFrame(frame); } }

    /* Fiche de l'astre sélectionné */
    var STATUS = {
      live: L('Démo en ligne', 'Live demo'),
      compose: L('En composition', 'In composition'),
      office: L('Back-office · équipe Cephalo Sophie', 'Back office · Cephalo Sophie team')
    };
    var current = null;
    function showPanel(b) {
      var tags = '<span class="tag ' + b.status + '">' + bi(STATUS[b.status]) + (b.version ? ' · ' + esc(b.version) : '') + '</span>';
      if (b.internal) tags += '<span class="tag">' + bi(L('Atelier interne', 'In-house workshop')) + '</span>';
      if (b.fresh) tags += '<span class="tag">' + bi(L('Nouveau', 'New')) + '</span>';
      var link = b.url ? b.url : b.page ? D.links.kanto + '/#ed-' + b.page : '';
      panel.style.setProperty('--pc', b.color);
      panel.innerHTML = '<div class="pn">' +
        '<div class="pn-top"><span class="pn-title">' + bi(b.title) + '</span><span class="pn-tags">' + tags + '</span></div>' +
        '<h3 class="pn-greek">' + esc(b.greek) + '</h3>' +
        '<p class="pn-latin">' + esc(b.latin) + '</p>' +
        '<p class="pn-mean">' + bi(b.meaning) + '</p>' +
        '<p class="pn-desc">' + bi(b.desc) + '</p>' +
        '<p class="pn-place"><b>' + bi(L("Dans l'univers", 'In the universe')) + '</b>' + bi(b.place) + '</p>' +
        (b.shot ? '<figure class="pn-shot"><img src="assets/img/kanto/' + b.shot + '.webp" alt="' + esc(b.latin) + '" loading="lazy" decoding="async"/></figure>' : '') +
        (link ? '<a class="pn-link" href="' + esc(link) + '" target="_blank" rel="noopener">' + bi(L('Voir sur kantoaplo.com', 'See it on kantoaplo.com')) + ' ↗</a>' : '') +
        '</div>';
    }
    function select(id, fromUser) {
      var b = byId[id];
      if (!b || b === current) return;
      if (current) current.el.classList.remove('sel');
      Object.keys(orbitEls).forEach(function (k2) { orbitEls[k2].classList.toggle('on', k2 === id); });
      current = b;
      b.el.classList.add('sel');
      chips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-selected', String(c.dataset.id === id)); });
      showPanel(b);
      if (fromUser) setTour(false);
    }

    /* Visite guidée : un astre toutes les 6,5 s tant que personne n'a choisi. */
    var tourOn = !reduce, tourTimer = 0, tourIdx = 0;
    function setTour(on) {
      tourOn = on;
      tourBtn.setAttribute('aria-pressed', String(on));
      clearInterval(tourTimer);
      if (on) tourTimer = setInterval(function () {
        if (!visible || document.hidden) return;
        tourIdx = (tourOrder.indexOf(current ? current.id : 'kanto') + 1) % tourOrder.length;
        select(tourOrder[tourIdx]);
      }, 6500);
    }
    tourBtn.addEventListener('click', function () { setTour(!tourOn); });

    cosmos.addEventListener('click', function (e) {
      var el = e.target.closest('.body');
      if (el) select(el.dataset.id, true);
    });
    chips.addEventListener('click', function (e) {
      var el = e.target.closest('.chip');
      if (el) select(el.dataset.id, true);
    });
    cosmos.addEventListener('pointerover', function (e) { if (e.target.closest('.body')) { hovering = true; target = 0.15; } });
    cosmos.addEventListener('pointerout', function (e) { if (e.target.closest('.body')) { hovering = false; target = 1; } });

    layout();
    select('kanto');
    render();
    setTour(tourOn);
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) start();
    }, { threshold: 0.05 }).observe(cosmos);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && visible) start(); });
    var rz = 0;
    window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { layout(); render(); }, 120); });
  })();

  /* Poème, chemin, capacités */
  $('poem').innerHTML = D.poem.fr.map(function (line, i) {
    return '<p style="--i:' + i + '">' + bi({ fr: line, en: D.poem.en[i] }) + '</p>';
  }).join('');
  var bodiesById = {};
  D.bodies.forEach(function (b) { bodiesById[b.id] = b; });
  $('path').innerHTML = D.path.map(function (s, i) {
    var b = bodiesById[s.id];
    return '<li style="--i:' + i + ';--c:' + b.color + '"><span class="nd">' + esc(b.greek.charAt(0)) + '</span>' +
      '<span class="vb">' + bi(s) + '</span><span class="ed">' + esc(b.latin) + '</span></li>';
  }).join('');
  var GREEK = 'αβγδεζηθικλμνξοπρστυφχψω';
  $('caps').innerHTML = D.capabilities.map(function (c, i) {
    return '<li class="cap" data-reveal style="--d:' + (i % 4) * 80 + 'ms"><span class="gl">' + GREEK.charAt(i) + '</span>' +
      '<h4>' + bi(c) + '</h4><p>' + bi(L(c.d_fr, c.d_en)) + '</p></li>';
  }).join('');

  /* ════════════════ Kýdos ════════════════ */
  var K = D.kydos;
  var MASCOT = function (m) { return 'assets/img/kydos/mascots/' + m + '.svg'; };
  $('crew').innerHTML = ['robot-jaune', 'robot-magenta', 'robot-champion', 'robot-cyan', 'robot-vert'].map(function (m, i) {
    return '<img class="bot' + (i === 2 ? ' mid' : '') + '" src="' + MASCOT(m) + '" alt="" width="120" height="300" loading="lazy" style="--d:' + (i * 0.12).toFixed(2) + 's"/>';
  }).join('');
  $('crew').setAttribute('data-reveal', '');

  var fanAngles = [-14, -7, 0, 7, 14], fanY = [34, 9, 0, 9, 34], fanX = [-2, -1, 0, 1, 2];
  $('fan').innerHTML = K.cards.map(function (c, i) {
    var pc = c.red ? '#FF3EA5' : '#22E1FF';
    return '<article class="pcard' + (c.red ? ' red' : '') + '" tabindex="0" style="--i:' + i + ';--r:' + fanAngles[i] + 'deg;--y:' + fanY[i] + 'px;--pc:' + pc +
      ';left:calc(50% + ' + fanX[i] + ' * clamp(160px,15vw,206px))">' +
      '<span class="pc-corner pc-tl">' + c.rank + '<small>' + c.suit + '</small></span>' +
      '<span class="pc-suit" aria-hidden="true">' + c.suit + '</span>' +
      '<div class="pc-body"><h4>' + bi(c) + '</h4><p>' + bi(L(c.d_fr, c.d_en)) + '</p></div>' +
      '<span class="pc-corner pc-br" aria-hidden="true">' + c.rank + '<small>' + c.suit + '</small></span></article>';
  }).join('');
  // Au toucher, une carte se lève (le survol n'existe pas sur mobile).
  $('fan').addEventListener('click', function (e) {
    var card = e.target.closest('.pcard');
    if (!card) return;
    $('fan').querySelectorAll('.pcard').forEach(function (c) { c.classList.toggle('up', c === card && !c.classList.contains('up')); });
  });

  $('formats').innerHTML = K.formats.map(function (f, i) {
    return '<article class="fmt" data-reveal data-suit="' + f.suit + '" style="--fc:' + f.color + ';--d:' + i * 110 + 'ms">' +
      '<p class="fmt-tag">' + f.suit + ' ' + bi(f.tag) + '</p><h4>' + bi(f.name) + '</h4><p class="comp">' + bi(f.comp) + '</p>' +
      '<div class="seats" aria-hidden="true">' + f.seats.map(function (m) { return '<img src="' + MASCOT(m) + '" alt="" loading="lazy"/>'; }).join('') + '</div>' +
      '<p>' + bi(f.text) + '</p></article>';
  }).join('');

  /* Écrans de l'application : fondu enchaîné, défilement automatique quand visible. */
  (function screens() {
    var view = $('screenView'), cap = $('screenCap'), thumbs = $('screenThumbs');
    var shot = function (s) { return 'assets/img/kydos/screens/' + s.file + '.webp'; };
    view.innerHTML = '<img class="on" src="' + shot(K.screens[0]) + '" alt="" loading="lazy" decoding="async"/><img alt="" decoding="async"/>';
    thumbs.innerHTML = K.screens.map(function (s, i) {
      return '<button type="button" data-i="' + i + '" aria-label="' + esc(s.fr) + '"><img src="' + shot(s) + '" alt="" loading="lazy"/></button>';
    }).join('');
    var layers = view.querySelectorAll('img'), cur = 0, pos = 0, timer = 0, visible = false, user = false, token = 0;
    function caption() {
      var s = K.screens[pos];
      cap.innerHTML = '<span>' + bi(L(s.fr, s.en)) + '</span>';
      layers[cur].alt = s.fr;
      thumbs.querySelectorAll('button').forEach(function (b, i) { b.classList.toggle('on', i === pos); });
    }
    function go(i) {
      pos = (i + K.screens.length) % K.screens.length;
      var tk = ++token, inc = layers[1 - cur], out = layers[cur];
      inc.src = shot(K.screens[pos]);
      var swap = function () {
        if (tk !== token) return;
        out.classList.remove('on'); inc.classList.add('on'); cur = 1 - cur; caption();
      };
      if (inc.decode) inc.decode().then(swap, swap); else inc.onload = swap;
    }
    function play() { if (!timer && !user && !reduce) timer = setInterval(function () { if (visible && !document.hidden) go(pos + 1); }, 4200); }
    thumbs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      user = true; clearInterval(timer); timer = 0; go(+b.dataset.i);
    });
    view.addEventListener('click', function () { openLb(shot(K.screens[pos]), K.screens[pos].fr); });
    caption();
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) play(); }, { threshold: 0.4 }).observe(view);
  })();

  $('forge').innerHTML = K.forge.map(function (f) { return '<li><b>' + bi(f) + '</b><span>' + bi(L(f.d_fr, f.d_en)) + '</span></li>'; }).join('');
  $('kyStats').innerHTML = K.stats.map(function (s) { return '<li><b data-count="' + s.v + '">' + (reduce ? s.v : '0') + '</b>' + bi(s, 'span') + '</li>'; }).join('');
  document.querySelector('.proof').__onReveal = function () {
    if (reduce) return;
    document.querySelectorAll('#kyStats b').forEach(function (b) {
      var end = +b.dataset.count, t0 = 0;
      (function step(now) {
        if (!t0) t0 = now;
        var p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
        b.textContent = Math.round(end * e);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  };

  /* Visionneuse */
  var lb = $('lb'), lbImg = $('lbImg');
  function openLb(src, alt) {
    lbImg.src = src; lbImg.alt = alt || '';
    lb.hidden = false; body.classList.add('locked');
    requestAnimationFrame(function () { lb.classList.add('open'); });
    $('lbClose').focus({ preventScroll: true });
  }
  function closeLb() {
    lb.classList.remove('open'); body.classList.remove('locked');
    setTimeout(function () { lb.hidden = true; }, reduce ? 0 : 300);
  }
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* ════════════════ Studio ════════════════ */
  $('skills').innerHTML = D.expertise.map(function (s) { return '<li>' + bi(s) + '</li>'; }).join('');
  $('clients').innerHTML = D.clients.map(function (c, i) {
    return '<li data-reveal style="--d:' + (i % 4) * 70 + 'ms"><b>' + esc(c.name) + '</b><span>' + bi(c) + '</span></li>';
  }).join('');

  observeReveal();
})();
