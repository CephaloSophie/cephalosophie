# Studio visuels — Cephalo Sophie

Fabrique les visuels de la page Facebook officielle et du site : **7 thèmes**, chacun avec
une couverture, une photo de profil, un logo et **13 affiches** (onze éditeurs de KANTO APLO,
Kýdos, et Psèphos, la pierre de Zeugma). Tout est dessiné en code (SVG, Canvas) puis rendu
par Chromium : aucune image générée ailleurs, aucune police chargée depuis un CDN.

```bash
cd tools/studio
npm install                       # polices @fontsource (latin + grec)
node render.mjs                   # tout : 7 thèmes × 16 images → ../../assets/visuels/
node render.mjs marmaron iris     # seulement ces thèmes
node render.mjs psephide --kind=poster --id=zeugma,psephos --out=/tmp/essai
```

Playwright et Chromium doivent être disponibles (`require('playwright')`), ainsi qu'ImageMagick
(`convert`) pour les JPEG et les vignettes WebP.

| Fichier | Rôle |
|---|---|
| `content.js` | Les 13 sujets (nom grec, rôle, étymologie, phrase), la marque, les pictogrammes |
| `lib.js` | Outils partagés : hasard reproductible, bruit, méandre, engrenage, **mosaïque** |
| `themes/<id>.js` | Un thème = `poster`, `cover`, `profile`, `logo` |
| `render.html` | Page de rendu : `render.html#theme=…&kind=…&id=…` |
| `render.mjs` | Rendu Playwright, conversion JPEG + vignettes |
| `shots/` | Captures réelles des éditeurs (copiées de kantoaplo.com) |

## Les sept thèmes

| id | Nom | Concept |
|---|---|---|
| `psephide` | Ψηφιδωτό — Mosaïque | **Thème par défaut.** ψηφίς, la tesselle, vient de ψῆφος : chaque image est une mosaïque byzantine de milliers de psèphoi, fond d'or posé en anneaux autour du médaillon. |
| `chrysos` | Χρυσός Οὐρανός — Constellation d'or | Gravure à l'or fin sur la nuit : chaque éditeur est une constellation dans une sphère armillaire ; la tête-constellation signe la couverture. |
| `marmaron` | Μάρμαρον — Marbre & néon | Marbre noir de Portoro veiné d'or, calculé pixel par pixel, et l'éditeur en tube de néon. |
| `keramikos` | Κεραμική — Figures rouges | Céramique attique : glaçure noire, figure couleur d'argile au fond d'une coupe, méandres, palmettes, inscriptions sur le bord. |
| `antikythera` | Ἀντικύθηρα — Le mécanisme | Le premier calculateur grec : cadrans de bronze gradués, roues dentées, patine vert-de-gris. |
| `architekton` | Ἀρχιτέκτων — L'épure | Planche d'architecte au bleu de Prusse : tracés de construction, cotes, cartouche, capture réelle tirée en cyanotype. |
| `iris` | Ἶρις — Prisme | La messagère arc-en-ciel : lumière holographique, verre dépoli, lettres chromées, captures dans des fenêtres de verre. |

## Ajouter un éditeur

1. Une entrée dans `EDITORS` (`content.js`) et son pictogramme dans `ICONS` (viewBox 100 × 100,
   uniquement des chemins : `line` pour les traits, `dots` pour les pastilles).
2. Sa capture dans `shots/<id>.webp` s'il en a une (et son id dans `SHOTS`).
3. `node render.mjs`, puis l'ajouter à `visuals.editors` dans `assets/js/data.js`.
