# cephalosophie.com

Site vitrine de **Cephalo Sophie** (ΚΕΦΑΛΗ ΣΟΦΙΑ), éditeur de KANTO APLO et de Kýdos.
Site statique, sans étape de compilation : GitHub Pages sert `index.html`.

| Fichier | Rôle |
|---|---|
| `index.html` | Structure des sections (ouverture, nom, mondes, KANTO APLO, Kýdos, galerie, studio, équipe, contact) |
| `assets/js/data.js` | **Tout le contenu** FR/EN : astres de l'univers KANTO APLO (dont Zeugma et ses psèphoi), poème, chemin, capacités, Kýdos, thèmes visuels, clients |
| `assets/js/site.js` | Comportement : ciel, tête-constellation, univers animé, ambiances, Kýdos, thème visuel et galerie |
| `assets/css/site.css` | Styles, trois ambiances (cephalo · kanto · kydos) |
| `assets/img/` | Captures des éditeurs (kantoaplo.com) et visuels Kýdos (kydosbelote.com) |
| `assets/visuels/` | **Visuels de la page Facebook** : 7 thèmes × (couverture, profil, logo, 13 affiches) — voir son README |
| `tools/studio/` | Le studio qui fabrique ces visuels (`node render.mjs`) |

## Thème visuel

Sept thèmes : `psephide` (Ψηφιδωτό, mosaïque — **par défaut**), `chrysos`, `marmaron`,
`keramikos`, `antikythera`, `architekton`, `iris`. Le thème choisit les images de la galerie
et l'affiche montrée dans la fiche de chaque astre.

Aucun menu ne l'expose. Le défaut est le paramètre public `theme` de `assets/js/data.js` ; on
ne le redéfinit que depuis la console du navigateur, et le choix est gardé dans le
`localStorage` (clé `cephalo-theme`) :

```js
cephalo.theme()             // liste des thèmes et thème actif
cephalo.theme('marmaron')   // change de thème et le garde
cephalo.theme(null)         // oublie le choix : retour au thème par défaut
```

## Ajouter un éditeur à l'univers

Ajouter une entrée dans `bodies` (`assets/js/data.js`) : nom grec, couleur, orbite
(`a` rayon, `T` période, `p` phase), `parent` pour une lune, `status`, textes FR/EN.
`page` renvoie vers la section de l'éditeur sur kantoaplo.com (`#ed-<page>`) ;
`psephoi: true` lui donne un anneau de pierres de domino (Zeugma).
Puis ses affiches : voir `tools/studio/README.md`.

## Lancer en local

```bash
python3 -m http.server 8000
```
