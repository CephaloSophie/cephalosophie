/* ═══════════════════════════════════════════════════════════════════════
   STUDIO VISUELS — contenu commun à tous les thèmes
   Les treize sujets des affiches (onze éditeurs de KANTO APLO, Kýdos, et
   Psèphos, la pierre de Zeugma), la marque, et les pictogrammes.
   Pictogrammes : viewBox 0 0 100 100, tracés en chemins (pas de <circle>)
   pour que chaque thème puisse les dessiner, les échantillonner ou les
   paver à sa manière.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Un cercle en chemin : deux demi-arcs. */
  function C(cx, cy, r) {
    return 'M' + (cx + r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 1 1 ' + (cx - r) + ' ' + cy +
      ' A' + r + ' ' + r + ' 0 1 1 ' + (cx + r) + ' ' + cy + ' Z';
  }
  function R(x, y, w, h, rx) {
    rx = rx || 0;
    if (!rx) return 'M' + x + ' ' + y + ' H' + (x + w) + ' V' + (y + h) + ' H' + x + ' Z';
    return 'M' + (x + rx) + ' ' + y + ' H' + (x + w - rx) + ' Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + rx) +
      ' V' + (y + h - rx) + ' Q' + (x + w) + ' ' + (y + h) + ' ' + (x + w - rx) + ' ' + (y + h) +
      ' H' + (x + rx) + ' Q' + x + ' ' + (y + h) + ' ' + x + ' ' + (y + h - rx) +
      ' V' + (y + rx) + ' Q' + x + ' ' + y + ' ' + (x + rx) + ' ' + y + ' Z';
  }
  /* Points d'une face de domino (pastilles pleines, petit rayon). */
  function pips(list, r) {
    return list.map(function (p) { return C(p[0], p[1], r || 2.6); }).join(' ');
  }

  /* line : traits ; dots : pastilles pleines (remplies par les thèmes). */
  var ICONS = {
    skopos: {
      line: ['M8 50 Q50 12 92 50 Q50 88 8 50 Z', C(50, 50, 16), 'M50 4 V16 M50 84 V96 M2 50 H10 M90 50 H98', 'M26 24 L20 18 M74 24 L80 18 M26 76 L20 82 M74 76 L80 82'],
      dots: [C(50, 50, 6)]
    },
    hephaistos: {
      line: ['M14 54 H70 Q84 54 92 44 Q86 66 68 66 L62 76 H72 V86 H28 V76 H38 L34 66 Q18 66 14 54 Z',
        'M34 26 L58 50', 'M36.4 7.2 L44.8 15.6 L23.6 37.2 L15.2 28.8 Z', 'M66 40 L74 30 M72 48 L86 42 M60 36 L62 24'],
      dots: [C(76, 26, 2.2), C(88, 32, 1.6)]
    },
    zeugma: {
      line: [R(6, 40, 38, 22, 4), 'M25 40 V62', R(56, 40, 38, 22, 4), 'M75 40 V62', 'M44 51 H56', 'M25 40 Q50 6 75 40'],
      dots: [pips([[15, 51], [34, 46], [34, 56], [65, 51], [84, 45], [84, 51], [84, 57]])]
    },
    psephos: {
      line: [R(32, 8, 36, 84, 9), 'M32 50 H68', 'M14 86 Q20 80 26 86 Q20 92 14 86 Z', 'M76 88 Q83 81 90 88 Q83 95 76 88 Z'],
      dots: [pips([[41, 18], [50, 29], [59, 40], [42, 62], [58, 62], [42, 80], [58, 80]], 3.2)]
    },
    typos: {
      line: [R(14, 14, 72, 72, 3), 'M14 32 H86', 'M38 32 V86', 'M38 60 H86', 'M62 60 V86', 'M6 14 H10 M14 6 V10 M90 86 H94 M86 90 V94'],
      dots: [C(22, 23, 3), C(30, 23, 3)]
    },
    tekton: {
      line: ['M10 34 L50 10 L90 34 Z', 'M12 34 H88 V42 H12 Z', 'M22 46 V80 M30 46 V80', 'M46 46 V80 M54 46 V80', 'M70 46 V80 M78 46 V80', 'M14 80 H86 V86 H14 Z', 'M8 90 H92'],
      dots: [C(50, 26, 3)]
    },
    logos: {
      line: ['M32 12 Q20 12 20 26 V40 Q20 50 10 50 Q20 50 20 60 V74 Q20 88 32 88',
        'M68 12 Q80 12 80 26 V40 Q80 50 90 50 Q80 50 80 60 V74 Q80 88 68 88',
        'M38 36 H62', 'M38 50 H66', 'M38 64 H56'],
      dots: [C(33, 36, 2.6), C(33, 50, 2.6), C(33, 64, 2.6)]
    },
    skhema: {
      line: [R(8, 10, 34, 26, 2), 'M8 20 H42', R(58, 10, 34, 26, 2), 'M58 20 H92', R(33, 64, 34, 26, 2), 'M33 74 H67',
        'M42 23 H58', 'M25 36 V50 H75 V36', 'M50 50 V64', 'M50 64 L46 58 H54 Z'],
      dots: []
    },
    kydos: {
      line: ['M50 26 C42 38 28 44 28 56 C28 66 40 70 47 62 L43 76 H57 L53 62 C60 70 72 66 72 56 C72 44 58 38 50 26 Z',
        'M30 90 Q8 70 16 30', 'M70 90 Q92 70 84 30',
        'M16 40 Q8 36 8 28 Q16 30 16 40 Z', 'M14 54 Q4 52 2 44 Q12 44 14 54 Z', 'M18 68 Q8 68 4 60 Q14 58 18 68 Z', 'M24 80 Q14 82 10 74 Q20 72 24 80 Z',
        'M84 40 Q92 36 92 28 Q84 30 84 40 Z', 'M86 54 Q96 52 98 44 Q88 44 86 54 Z', 'M82 68 Q92 68 96 60 Q86 58 82 68 Z', 'M76 80 Q86 82 90 74 Q80 72 76 80 Z'],
      dots: [C(50, 12, 3)]
    },
    mantis: {
      line: ['M24 48 H76 Q74 66 50 66 Q26 66 24 48 Z', 'M32 62 L20 92 M50 66 V92 M68 62 L80 92', 'M16 92 H84',
        'M50 42 C40 34 60 28 50 20 C42 14 56 8 50 2', 'M38 40 C32 34 42 30 38 24', 'M62 40 C68 34 58 30 62 24'],
      dots: [C(50, 56, 2.8)]
    },
    kairos: {
      line: ['M28 10 H72 M28 90 H72', 'M33 10 Q33 40 50 50 Q67 40 67 10', 'M33 90 Q33 60 50 50 Q67 60 67 90', 'M40 82 Q50 70 60 82 Z',
        'M10 38 L20 50 L10 62', 'M90 38 L80 50 L90 62'],
      dots: [C(50, 58, 1.8), C(50, 64, 1.6), C(50, 70, 1.4)]
    },
    synergos: {
      line: [C(36, 40, 20), C(64, 40, 20), C(50, 64, 20)],
      dots: [C(50, 48, 3)]
    },
    hermes: {
      line: [C(50, 52, 11), 'M39 48 Q24 30 6 34 Q18 40 22 46 Q10 46 4 52 Q18 54 26 54 Q16 60 12 66 Q28 64 40 56',
        'M61 48 Q76 30 94 34 Q82 40 78 46 Q90 46 96 52 Q82 54 74 54 Q84 60 88 66 Q72 64 60 56',
        'M50 63 V92', 'M42 84 L50 92 L58 84', 'M50 41 V10', 'M44 16 L50 10 L56 16'],
      dots: [C(50, 52, 4)]
    }
  };

  /* Captures réelles disponibles (kantoaplo.com/assets/editors/<id>/). */
  var SHOTS = ['hephaistos', 'kydos', 'logos', 'skhema', 'skopos', 'tekton', 'typos', 'zeugma'];

  var EDITORS = [
    { id: 'skopos', greek: 'ΣΚΟΠΟΣ', latin: 'Skopos', accent: '#9BE15D', role: 'Le guetteur', word: 'σκοπός', meaning: 'celui qui observe et vise juste',
      pitch: 'Il observe tes APIs, détecte les anomalies et te prévient avant tes utilisateurs.', status: 'ready', site: 'kantoaplo.com' },
    { id: 'hephaistos', greek: 'ἭΦΑΙΣΤΟΣ', latin: 'Héphaïstos', accent: '#E84A4A', role: 'La forge', word: 'Ἥφαιστος', meaning: 'le dieu forgeron',
      pitch: 'Il forge les blocs visuels que Tektôn assemblera. Sans la forge, rien à bâtir.', status: 'ready', site: 'kantoaplo.com' },
    { id: 'zeugma', greek: 'ΖΕΥΓΜΑ', latin: 'Zeugma', accent: '#4FD1C5', role: 'Le lien', word: 'ζεῦγμα', meaning: 'le joug, ce qui lie deux choses',
      pitch: 'Des pierres de domino pour bâtir sans code éditeurs visuels, workflows et automatisations.', status: 'ready', site: 'kantoaplo.com' },
    { id: 'psephos', greek: 'ΨΗΦΟΣ', latin: 'Psèphos', accent: '#7FE3D3', role: 'La pierre', word: 'ψῆφος', meaning: 'le caillou qui compte et qui vote',
      pitch: 'La pierre de Zeugma : un domino, un bloc. Ses faces disent ses entrées et ses sorties.', status: 'ready', site: 'kantoaplo.com', parent: 'zeugma' },
    { id: 'typos', greek: 'ΤΥΠΟΣ', latin: 'Typos', accent: '#D4A373', role: 'Le moule', word: 'τύπος', meaning: "l'empreinte, le moule",
      pitch: 'Grille, zones, arborescence : le squelette que Tektôn remplira.', status: 'ready', site: 'kantoaplo.com' },
    { id: 'tekton', greek: 'ΤΈΚΤΩΝ', latin: 'Tektôn', accent: '#C9963A', role: 'Le bâtisseur', word: 'τέκτων', meaning: "l'artisan bâtisseur",
      pitch: 'Glisser, déposer : pages, funnels, applications et quiz. Le cœur de KANTO APLO.', status: 'ready', site: 'kantoaplo.com' },
    { id: 'logos', greek: 'ΛΌΓΟΣ', latin: 'Logos', accent: '#3D8EE8', role: 'La règle', word: 'λόγος', meaning: 'la parole, la raison',
      pitch: 'APIs REST, tâches planifiées, règles métier : des services documentés OpenAPI.', status: 'ready', site: 'kantoaplo.com' },
    { id: 'skhema', greek: 'ΣΧΗΜΑ', latin: 'Skhêma', accent: '#8FA2FF', role: 'Le schéma', word: 'σχῆμα', meaning: 'la forme, la figure',
      pitch: "Classes, séquences, entités, cas d'usage : modéliser avant de bâtir.", status: 'ready', site: 'kantoaplo.com' },
    { id: 'kydos', greek: 'ΚΥΔΟΣ', latin: 'Kýdos', accent: '#E6C77A', role: 'La gloire', word: 'κῦδος', meaning: 'la gloire',
      pitch: 'La belote contrée où tes robots jouent aussi. Bâtie sur KANTO APLO.', status: 'app', site: 'kydosbelote.com' },
    { id: 'mantis', greek: 'ΜΆΝΤΙΣ', latin: 'Mantis', accent: '#8B5CF6', role: 'Le prophète', word: 'μάντις', meaning: 'le devin',
      pitch: 'Dashboards interactifs et prédictions en temps réel, sans code.', status: 'pending', site: 'kantoaplo.com' },
    { id: 'kairos', greek: 'ΚΑΙΡΟΣ', latin: 'Kairos', accent: '#F472B6', role: "L'opportunité", word: 'καιρός', meaning: 'le moment juste',
      pitch: 'Tests A/B, significativité calculée, bascule automatique vers le gagnant.', status: 'pending', site: 'kantoaplo.com' },
    { id: 'synergos', greek: 'ΣΥΝΕΡΓΟΣ', latin: 'Synergos', accent: '#2DD4A0', role: 'Le collaborateur', word: 'συνεργός', meaning: 'celui qui œuvre avec',
      pitch: 'Bases de données, APIs tierces, services cloud : un coffre-fort de connecteurs.', status: 'pending', site: 'kantoaplo.com' },
    { id: 'hermes', greek: 'ἙΡΜΗ͂Σ', latin: 'Hermès', accent: '#E8714A', role: 'Le messager', word: 'Ἑρμῆς', meaning: 'le messager, gardien des passages',
      pitch: 'Workflows automatisés et agents IA qui font circuler les données entre les systèmes.', status: 'pending', site: 'kantoaplo.com' }
  ];
  /* En capitales, le grec ne porte ni accent ni esprit : ΤΈΚΤΩΝ s'affiche ΤΕΚΤΩΝ. */
  EDITORS.forEach(function (e) { e.greekFull = e.greek; e.greek = e.greek.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); });
  EDITORS.forEach(function (e, i) { e.n = i + 1; e.icon = ICONS[e.id]; e.shot = SHOTS.indexOf(e.id) >= 0 ? 'shots/' + e.id + '.webp' : null; });

  window.STUDIO = {
    editors: EDITORS,
    byId: EDITORS.reduce(function (m, e) { m[e.id] = e; return m; }, {}),
    brand: {
      latin: 'CEPHALO SOPHIE', greek: 'ΚΕΦΑΛΗ ΣΟΦΙΑ', motto: "L'intelligence qui précède l'action",
      wise: 'La Tête Sage', site: 'cephalosophie.com', worlds: 'KANTO APLO · KÝDOS'
    },
    status: { ready: 'Démo en ligne', app: 'Application', pending: 'En composition' },
    /* La tête-constellation du site (profil grec), même tracé. */
    head: {
      P: [[150, 452], [150, 392], [128, 352], [110, 300], [104, 240], [116, 180], [146, 128], [190, 92], [246, 76], [298, 86],
        [336, 116], [352, 160], [356, 198], [350, 214], [368, 250], [386, 284], [364, 296], [370, 316], [362, 330],
        [364, 352], [358, 374], [338, 394], [304, 404], [296, 452]],
      eye: [330, 224], ear: [[198, 228], [222, 234], [228, 262], [210, 286], [192, 264]], mind: [232, 178]
    },
    C: C, R: R
  };
})();
