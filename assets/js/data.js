/* ═══════════════════════════════════════════════════════════════════════
   CEPHALO SOPHIE — contenu du site
   ───────────────────────────────────────────────────────────────────────
   Tous les textes affichés par le script (univers KANTO APLO, Kýdos,
   studio…) sont ici, en français (fr) et en anglais (en).
   Sources : dépôt DOCUMENTATION (univers, éditeurs, Époptès, présentation),
   vitrine kantoaplo.com (Skopos, Skhêma), dépôt kydos et kydosbelote.com.
   ═══════════════════════════════════════════════════════════════════════ */

window.CEPHALO = {

  links: {
    kanto: 'https://kantoaplo.com',
    kydos: 'https://kydosbelote.com',
    mail: 'contact@cephalosophie.com',
    linkedin: 'https://www.linkedin.com/in/hamdouni-ameur-ba3048a4/',
    facebook: 'https://www.facebook.com/profile.php?id=61575597527246'
  },

  /* ── L'univers de KANTO APLO ─────────────────────────────────────────
     L'étoile au centre, des planètes, des lunes, des satellites.
     orbit.a  : demi-grand axe (fraction du rayon de la scène)
     orbit.T  : période en secondes · orbit.p : phase de départ (radians)
     parent   : l'astre autour duquel il tourne (sinon l'étoile)
     perturbedBy : astres dont la gravité déforme l'orbite (Typos)
     status   : live (démo en ligne) · compose (en composition) · office (back-office)
     page     : ancre de la section sur kantoaplo.com */
  star: {
    id: 'kanto', greek: 'ΚΆΝΤΟ ΑΠΛΌ', latin: 'KANTO APLO', color: '#C9963A',
    title: { fr: "L'étoile", en: 'The star' },
    meaning: { fr: 'κάντο απλό — fais-le, simplement.', en: 'κάντο απλό — do it, simply.' },
    desc: {
      fr: "La plateforme SaaS no-code et low-code multi-tenant de Cephalo Sophie. Le Scripteur — un profil non-développeur doté d'un sens logique — y crée des applications métier complètes : interfaces, APIs, workflows, analytique, connecteurs et expérimentation.",
      en: "Cephalo Sophie's multi-tenant no-code and low-code SaaS platform. The Scripteur — a non-developer with a logical mind — builds complete business applications there: interfaces, APIs, workflows, analytics, connectors and experimentation."
    },
    place: { fr: 'Le soleil autour duquel tout gravite.', en: 'The sun everything revolves around.' },
    status: 'live', url: 'https://kantoaplo.com'
  },

  bodies: [
    { id: 'kairos', greek: 'ΚΑΙΡΟΣ', latin: 'Kairos', color: '#F472B6', size: 18,
      orbit: { a: 0.25, T: 26, p: 0.6 }, status: 'compose', version: 'v2.0.3', page: 'kairos',
      title: { fr: "L'Opportunité", en: 'The Moment' },
      meaning: { fr: "Non pas le temps qui s'écoule (Chronos), mais le moment juste.", en: 'Not the time that flows (Chronos), but the right moment.' },
      desc: { fr: "Expérimentation statistique : tests A/B sur les interfaces bâties dans Tektôn, significativité calculée en temps réel, bascule automatique vers la variante gagnante dès le seuil de confiance atteint.",
              en: 'Statistical experimentation: A/B tests on interfaces built in Tektôn, significance computed in real time, automatic rollout of the winning variant once the confidence threshold is reached.' },
      place: { fr: "Planète la plus proche de l'étoile : elle choisit le bon moment pour agir.", en: 'The planet closest to the star: it picks the right moment to act.' } },

    { id: 'mantis', greek: 'ΜΆΝΤΙΣ', latin: 'Mantis', color: '#8B5CF6', size: 22,
      orbit: { a: 0.39, T: 36, p: 2.4 }, status: 'compose', version: 'v4.1.8', page: 'mantis',
      title: { fr: 'Le Prophète', en: 'The Prophet' },
      meaning: { fr: "L'oracle qui lit les signes invisibles pour annoncer ce qui vient.", en: 'The oracle who reads invisible signs to foretell what comes.' },
      desc: { fr: 'Couche analytique et prédictive : dashboards interactifs, modèles de machine learning entraînés sans code, prédictions en temps réel accessibles depuis les autres éditeurs.',
              en: 'The analytics and prediction layer: interactive dashboards, machine-learning models trained without code, real-time predictions available to every other editor.' },
      place: { fr: "Planète : elle capte les signaux et prédit. Sa gravité déforme l'orbite de Typos.", en: "A planet: it captures signals and predicts. Its gravity bends Typos's orbit." } },

    { id: 'synergos', greek: 'ΣΥΝΕΡΓΟΣ', latin: 'Synergos', color: '#2DD4A0', size: 22,
      orbit: { a: 0.53, T: 48, p: 4.4 }, status: 'compose', version: 'v1.0.3', page: 'synergos',
      title: { fr: 'Le Collaborateur', en: 'The Connector' },
      meaning: { fr: 'σύν + ἔργον — celui qui œuvre avec les autres.', en: 'σύν + ἔργον — the one who works alongside others.' },
      desc: { fr: "Intégration universelle : bases relationnelles et NoSQL, APIs tierces et services cloud, réunis dans un coffre-fort de credentials sécurisé. Chaque source de données devient disponible pour tous les éditeurs.",
              en: 'Universal integration: relational and NoSQL databases, third-party APIs and cloud services, gathered in a secure credentials vault. Every data source becomes available to every editor.' },
      place: { fr: "Planète : elle connecte les ressources de l'univers. Sa gravité déforme l'orbite de Typos.", en: "A planet: it connects the universe's resources. Its gravity bends Typos's orbit." } },

    { id: 'hephaistos', greek: 'ἭΦΑΙΣΤΟΣ', latin: 'Héphaïstos', color: '#E84A4A', size: 34, massive: true,
      orbit: { a: 0.68, T: 84, p: 1.2 }, status: 'live', internal: true, page: 'hephaistos', shot: 'hephaistos',
      title: { fr: 'La Forge', en: 'The Forge' },
      meaning: { fr: "Le dieu forgeron de l'Olympe : il ne bâtit pas, il forge ce avec quoi l'on bâtit.", en: 'The smith god of Olympus: he does not build, he forges what others build with.' },
      desc: { fr: "Éditeur de blocs Blockly : on y conçoit, configure et publie les blocs que Tektôn et Logos assemblent. Sans la forge, le bâtisseur n'a pas de matière première et la règle n'a pas de structure à gouverner.",
              en: 'A Blockly block editor: the blocks Tektôn and Logos assemble are designed, configured and published here. Without the forge, the builder has no raw material and the rule has no structure to govern.' },
      place: { fr: 'Planète massive, avec deux lunes principales : Tektôn et Logos.', en: 'A massive planet with two main moons: Tektôn and Logos.' } },

    { id: 'tekton', greek: 'ΤΈΚΤΩΝ', latin: 'Tektôn', color: '#C9963A', size: 20, parent: 'hephaistos',
      orbit: { a: 0.15, T: 15, p: 0.3 }, status: 'live', page: 'tekton', shot: 'tekton',
      title: { fr: 'Le Bâtisseur', en: 'The Builder' },
      meaning: { fr: "L'artisan qui taille la matière — même racine qu'architecte (ἀρχι-τέκτων).", en: 'The craftsman who shapes matter — the same root as architect (ἀρχι-τέκτων).' },
      desc: { fr: "Glisser-déposer visuel pour assembler pages, funnels, applications et quiz avec les blocs d'Héphaïstos, dans les squelettes de Typos. Le résultat est un artefact déployable, pas un prototype.",
              en: "Visual drag and drop to assemble pages, funnels, apps and quizzes from Héphaïstos's blocks, inside Typos's skeletons. The result is a deployable artefact, not a prototype." },
      place: { fr: "Lune d'Héphaïstos, qui porte son propre satellite : Typos.", en: "A moon of Héphaïstos, carrying a satellite of its own: Typos." } },

    { id: 'logos', greek: 'ΛΌΓΟΣ', latin: 'Logos', color: '#3D8EE8', size: 18, parent: 'hephaistos',
      orbit: { a: 0.24, T: 26, p: 3.6 }, status: 'live', page: 'logos', shot: 'logos',
      title: { fr: 'La Règle', en: 'The Rule' },
      meaning: { fr: 'La raison qui gouverne — pour Aristote, le principe qui organise le monde.', en: 'The reason that governs — for Aristotle, the principle that orders the world.' },
      desc: { fr: "Conception visuelle d'APIs REST et de services : routes, règles métier, authentification, tâches planifiées, transformations. Chaque configuration génère un code propre, documenté OpenAPI. Il partage avec Tektôn le même moteur de blocs.",
              en: 'Visual design of REST APIs and services: routes, business rules, authentication, scheduled jobs, transforms. Every configuration generates clean, OpenAPI-documented code. It shares the same block engine as Tektôn.' },
      place: { fr: "Lune d'Héphaïstos, veillée par son satellite Skopos.", en: 'A moon of Héphaïstos, watched over by its satellite Skopos.' } },

    { id: 'typos', greek: 'ΤΥΠΟΣ', latin: 'Typos', color: '#D4A373', size: 11, parent: 'tekton',
      orbit: { a: 0.065, T: 7, p: 1 }, perturbedBy: ['mantis', 'synergos'],
      status: 'live', internal: true, page: 'typos', shot: 'typos',
      title: { fr: 'Le Moule', en: 'The Mould' },
      meaning: { fr: "L'empreinte, le modèle : la forme qui précède la matière.", en: 'The imprint, the model: the form that comes before matter.' },
      desc: { fr: 'Templates structurels : grille, zones, conteneurs, arborescence et emplacements réservés que Tektôn remplit. Un plan directeur réutilisable, adaptable et cohérent.',
              en: 'Structural templates: grid, zones, containers, tree and reserved slots that Tektôn fills. A reusable, adaptable and consistent master plan.' },
      place: { fr: "Satellite de Tektôn sur une orbite ovale instable : la gravité de Mantis et de Synergos la déforme. Le modèle n'est jamais figé.",
               en: "A satellite of Tektôn on an unstable oval orbit, bent by the gravity of Mantis and Synergos. The model is never frozen." } },

    { id: 'skopos', greek: 'ΣΚΟΠΟΣ', latin: 'Skopos', color: '#9BE15D', size: 10, parent: 'logos',
      orbit: { a: 0.055, T: 9, p: 2 }, status: 'live', fresh: true, page: 'skopos', shot: 'skopos',
      title: { fr: 'Le Guetteur', en: 'The Watcher' },
      meaning: { fr: 'σκοπός — celui qui observe et vise juste.', en: 'σκοπός — the one who watches and aims true.' },
      desc: { fr: "L'observateur, celui qui surveille : il observe tes APIs, détecte les anomalies et prévient avant tes utilisateurs.",
              en: 'The observer, the one who keeps watch: it monitors your APIs, detects anomalies and warns you before your users notice.' },
      place: { fr: 'Satellite de Logos : il veille sur les APIs que la règle gouverne.', en: 'A satellite of Logos: it watches over the APIs the rule governs.' } },

    { id: 'hermes', greek: 'ἙΡΜΗ͂Σ', latin: 'Hermès', color: '#E8714A', size: 19,
      orbit: { a: 0.9, T: 58, p: 5.3 }, status: 'compose', page: 'hermes',
      title: { fr: 'Le Messager', en: 'The Messenger' },
      meaning: { fr: 'Le messager des dieux, gardien des passages et des frontières.', en: 'Messenger of the gods, keeper of passages and borders.' },
      desc: { fr: "Moteur d'orchestration : workflows d'automatisation visuels, agents IA autonomes capables d'utiliser des outils, circulation des données entre systèmes internes et services externes.",
              en: 'The orchestration engine: visual automation workflows, autonomous AI agents able to use tools, data flowing between internal systems and external services.' },
      place: { fr: "Planète rapide sur une orbite lointaine : il fait circuler l'énergie entre les mondes.", en: 'A fast planet on a distant orbit: it carries energy between worlds.' } },

    { id: 'skhema', greek: 'ΣΧΗΜΑ', latin: 'Skhêma', color: '#8FA2FF', size: 20,
      orbit: { a: 1, T: 120, p: 3 }, status: 'live', fresh: true, page: 'skhema', shot: 'skhema',
      title: { fr: 'Le Schéma', en: 'The Schema' },
      meaning: { fr: 'σχῆμα — la forme, la figure.', en: 'σχῆμα — form and figure.' },
      desc: { fr: "Éditeur UML professionnel : classes, séquences, entités-relations, cas d'usage. Modéliser avant de bâtir.",
              en: 'A professional UML editor: classes, sequences, entity-relationship, use cases. Model before you build.' },
      place: { fr: "Orbite extérieure : le plan qui enveloppe tout le système.", en: 'The outer orbit: the plan that wraps the whole system.' } }
  ],

  /* Hors orbite : le back-office qui observe tout le système. */
  observer: {
    id: 'epoptes', greek: 'ἘΠΌΠΤΗΣ', latin: 'Époptès', color: '#E6D6A8', status: 'office',
    title: { fr: 'Celui qui voit tout', en: 'The one who sees all' },
    meaning: { fr: "Dans les mystères d'Éleusis, l'initié suprême : celui qui voit tout, sans intervenir.", en: 'In the Eleusinian mysteries, the highest initiate: the one who sees all, without interfering.' },
    desc: { fr: "Le back-office de pilotage de la plateforme : plans tarifaires, publication des blocs et des templates, supervision des organisations clientes. Il voit tout le système, sans jamais toucher au contenu des clients.",
            en: "The platform's control back office: pricing plans, publishing blocks and templates, supervising client organisations. It sees the whole system, without ever touching client content." },
    place: { fr: 'Hors orbite : il contemple le système entier.', en: 'Beyond the orbits: it contemplates the whole system.' }
  },

  poem: {
    fr: ['La forge précède le bâtisseur.', 'Le bâtisseur précède la règle.', "Et le modèle, enfant du bâtisseur mais influencé par le devin et le collaborateur, danse sur une orbite qui n'appartient qu'à lui.", "Ensemble, ils construisent ce que l'étoile illumine."],
    en: ['The forge comes before the builder.', 'The builder comes before the rule.', 'And the mould, child of the builder yet swayed by the seer and the collaborator, dances on an orbit of its own.', 'Together, they build what the star illuminates.']
  },

  /* De l'idée à l'application : le chemin à travers les éditeurs. */
  path: [
    { id: 'skhema', fr: 'Modéliser', en: 'Model' },
    { id: 'hephaistos', fr: 'Forger', en: 'Forge' },
    { id: 'typos', fr: 'Mouler', en: 'Mould' },
    { id: 'tekton', fr: 'Bâtir', en: 'Build' },
    { id: 'logos', fr: 'Gouverner', en: 'Govern' },
    { id: 'synergos', fr: 'Connecter', en: 'Connect' },
    { id: 'hermes', fr: 'Orchestrer', en: 'Orchestrate' },
    { id: 'skopos', fr: 'Veiller', en: 'Watch' },
    { id: 'mantis', fr: 'Prédire', en: 'Predict' },
    { id: 'kairos', fr: 'Choisir le moment', en: 'Seize the moment' }
  ],

  /* Ce que le Scripteur crée et ce qui distingue la plateforme. */
  capabilities: [
    { fr: 'Pages & landing pages', en: 'Pages & landing pages', d_fr: 'Mises en page professionnelles, médias, appels à l’action.', d_en: 'Professional layouts, media, calls to action.' },
    { fr: 'Funnels de conversion', en: 'Conversion funnels', d_fr: 'Parcours en plusieurs étapes, conditions d’avancement.', d_en: 'Multi-step journeys with progression rules.' },
    { fr: 'Quiz & enquêtes', en: 'Quizzes & surveys', d_fr: 'Branchements conditionnels, scoring, résultats personnalisés.', d_en: 'Conditional branching, scoring, tailored results.' },
    { fr: 'Boutiques single page', en: 'Single-page shops', d_fr: 'Catalogue, page de vente et achat, sans rechargement.', d_en: 'Catalogue, sales page and checkout, no reload.' },
    { fr: 'APIs sécurisées', en: 'Secured APIs', d_fr: 'Restriction IP, OAuth2, clé privée ou accès public, en blocs.', d_en: 'IP allow-lists, OAuth2, private keys or public access, as blocks.' },
    { fr: 'Connecteurs de données', en: 'Data connectors', d_fr: 'REST, WebSocket, fichiers CSV/JSON/XML, bases de données.', d_en: 'REST, WebSocket, CSV/JSON/XML files, databases.' },
    { fr: 'Mobile iOS & Android', en: 'iOS & Android', d_fr: 'Applications natives : caméra, GPS, push, hors ligne.', d_en: 'Native apps: camera, GPS, push, offline.' },
    { fr: 'Self-hosted', en: 'Self-hosted', d_fr: 'Une version légère sur vos serveurs, en une commande.', d_en: 'A light version on your own servers, in one command.' },
    { fr: 'Analytics natifs', en: 'Built-in analytics', d_fr: 'Comportement, abandons, chemins, cohortes : sans outil tiers.', d_en: 'Behaviour, drop-offs, paths, cohorts: no third-party tool.' },
    { fr: 'Tests A/B intégrés', en: 'Built-in A/B tests', d_fr: 'Répartition du trafic et méthodes statistiques rigoureuses.', d_en: 'Traffic splitting and rigorous statistics.' },
    { fr: 'Données 100 % privées', en: '100% private data', d_fr: 'Chaque organisation est un silo étanche.', d_en: 'Every organisation is a sealed silo.' },
    { fr: 'Catalogue de blocs', en: 'Block catalogue', d_fr: 'Officiels, communautaires validés, ou sur mesure.', d_en: 'Official, community-reviewed, or made to measure.' }
  ],

  /* ── Kýdos ───────────────────────────────────────────────────────── */
  kydos: {
    cards: [
      { rank: '9', suit: '♥', red: true, fr: 'Une vraie belote contrée', en: 'Real belote contrée',
        d_fr: 'Enchères, atout, belote-rebelote, dix de der, capot. Sans raccourci, avec un moteur de jeu complet.',
        d_en: 'Bidding, trumps, belote-rebelote, last trick, capot. No shortcuts, with a complete game engine.' },
      { rank: 'A', suit: '♠', fr: 'Des robots que tu élèves', en: 'Robots you raise',
        d_fr: 'Chaque joueur possède une écurie. Ses robots jouent à ses côtés, à sa place, et progressent comme lui.',
        d_en: 'Every player owns a stable. Their robots play beside them, instead of them, and level up like them.' },
      { rank: 'V', suit: '♥', red: true, fr: 'Un cerveau que tu conçois', en: 'A brain you design',
        d_fr: 'Personnalité, cerveau, logique de décision câblée nœud par nœud. Sans une ligne de code.',
        d_en: 'Personality, brain, decision logic wired node by node. Without a line of code.' },
      { rank: '10', suit: '♦', red: true, fr: 'Une arène qui ne dort jamais', en: 'An arena that never sleeps',
        d_fr: 'Matchs rapides, défis, tournois à élimination directe jusqu’à 128 joueurs, spectateurs, classements.',
        d_en: 'Quick matches, challenges, knockout tournaments up to 128 players, spectators, leaderboards.' },
      { rank: 'A', suit: '♣', fr: 'Tout ça, dans ta poche', en: 'All of it, in your pocket',
        d_fr: 'Une application native Android et iOS, pensée en paysage, jouable hors ligne pour s’entraîner.',
        d_en: 'A native Android and iOS app, built for landscape, playable offline for practice.' }
    ],
    formats: [
      { id: 'acier', color: '#8EA2FF', suit: '♠', seats: ['robot-cyan', 'robot-perle', 'robot-rouge', 'robot-titan'],
        name: { fr: 'Duo d’Acier', en: 'Steel Duo' }, comp: { fr: '2 robots × 2', en: '2 robots × 2' }, tag: { fr: '100 % robots', en: '100% robots' },
        text: { fr: 'Aucun humain à la table : la partie se joue côté serveur, immédiatement. On engage ses robots, on récupère le résultat plus tard.',
                en: 'No human at the table: the game runs server-side, instantly. Send your robots in, collect the result later.' } },
      { id: 'hybride', color: '#FF8A3D', suit: '♥', seats: ['joueur-lunettes', 'robot-menthe', 'joueuse-icone', 'robot-magenta'],
        name: { fr: 'Alliance Hybride', en: 'Hybrid Alliance' }, comp: { fr: '1 humain + 1 robot × 2', en: '1 human + 1 robot × 2' }, tag: { fr: 'Toi et ton robot', en: 'You and your robot' },
        text: { fr: 'On fait équipe avec son propre robot face à un autre duo humain-robot. La coopération devient une arme.',
                en: 'Team up with your own robot against another human-robot duo. Cooperation becomes a weapon.' } },
      { id: 'royal', color: '#C77DFF', suit: '♦', seats: ['joueur-archiviste', 'joueur-punk', 'joueuse-icone', 'joueur-lunettes'],
        name: { fr: 'Carré Royal', en: 'Royal Square' }, comp: { fr: '4 humains', en: '4 humans' }, tag: { fr: 'Belote classique', en: 'Classic belote' },
        text: { fr: 'Quatre joueurs, deux équipes, la belote contrée dans sa forme la plus pure, avec deux gagnants.',
                en: 'Four players, two teams, belote contrée in its purest form, with two winners.' } }
    ],
    screens: [
      { file: 'table-pixi', fr: 'La table en temps réel, rendue en WebGL', en: 'The real-time table, rendered in WebGL' },
      { file: 'ecurie', fr: "L'écurie : ses robots, leurs niveaux, leur forme", en: 'The stable: your robots, their levels, their form' },
      { file: 'editeur-strategie', fr: 'Le réglage d’un robot : personnalité et cerveau', en: 'Tuning a robot: personality and brain' },
      { file: 'tableau-tournoi', fr: 'Un tournoi en direct, du huitième à la finale', en: 'A live tournament, from round of 16 to final' },
      { file: 'duo-acier-live', fr: 'Duo d’Acier en direct : seuls les robots jouent', en: 'Steel Duo live: only robots play' },
      { file: 'podium', fr: 'Le podium de fin de tournoi', en: 'The end-of-tournament podium' }
    ],
    /* Ce que réunit un jeu de cartes multijoueur temps réel. */
    forge: [
      { fr: 'Temps réel', en: 'Real time', d_fr: 'Synchronisation d’état entre tous les joueurs.', d_en: 'State sync between every player.' },
      { fr: 'IA décisionnelle', en: 'Decision AI', d_fr: 'Un moteur de robots piloté par des données.', d_en: 'A data-driven robot engine.' },
      { fr: 'Économie virtuelle', en: 'Virtual economy', d_fr: 'Transactions tracées, intégrité garantie.', d_en: 'Traced transactions, guaranteed integrity.' },
      { fr: 'Rendu graphique', en: 'Graphics', d_fr: 'Une table en WebGL, des mascottes paramétriques.', d_en: 'A WebGL table, parametric mascots.' },
      { fr: 'Mobile natif', en: 'Native mobile', d_fr: 'Android et iOS, une seule base de code.', d_en: 'Android and iOS, one codebase.' },
      { fr: 'Back-office', en: 'Back office', d_fr: 'Tout se pilote sans redéploiement.', d_en: 'Everything is tuned without redeploying.' }
    ],
    stats: [
      { v: '641', fr: 'tests automatisés', en: 'automated tests' },
      { v: '146', fr: "endpoints d'API documentés", en: 'documented API endpoints' },
      { v: '24', fr: 'pages de back-office', en: 'back-office pages' },
      { v: '128', fr: 'joueurs par tournoi', en: 'players per tournament' }
    ]
  },

  /* ── Le studio ───────────────────────────────────────────────────── */
  expertise: ['Python', 'SQL', 'NoSQL', 'JavaScript', 'TypeScript', 'BI', { fr: 'IA & machine learning', en: 'AI & machine learning' },
    { fr: 'Mobile natif', en: 'Native mobile' }, { fr: 'Temps réel', en: 'Real time' }, { fr: 'Architecture cloud', en: 'Cloud architecture' }],
  clients: [
    { name: 'IFPEN', fr: 'Recherche & énergie', en: 'Research & energy' },
    { name: 'La Poste', fr: 'Services postaux & logistique', en: 'Postal services & logistics' },
    { name: 'Docaposte', fr: 'Numérique, groupe La Poste', en: 'Digital, La Poste group' },
    { name: 'JCDecaux', fr: 'Communication extérieure', en: 'Outdoor advertising' },
    { name: 'Allianz', fr: 'Assurance', en: 'Insurance' },
    { name: 'Unibet', fr: 'Jeux en ligne', en: 'Online gaming' },
    { name: 'LeadsHook', fr: 'MarTech', en: 'MarTech' },
    { name: 'Softia', fr: 'Services numériques', en: 'Digital services' }
  ]
};
