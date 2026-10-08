# cephalosophie.com

Site vitrine de **Cephalo Sophie** (ΚΕΦΑΛΗ ΣΟΦΙΑ), éditeur de KANTO APLO et de Kýdos.
Site statique, sans étape de compilation : GitHub Pages sert `index.html`.

| Fichier | Rôle |
|---|---|
| `index.html` | Structure des sections (ouverture, nom, mondes, KANTO APLO, Kýdos, studio, équipe, contact) |
| `assets/js/data.js` | **Tout le contenu** FR/EN : astres de l'univers KANTO APLO, poème, chemin, capacités, Kýdos, clients |
| `assets/js/site.js` | Comportement : ciel, tête-constellation, univers animé, ambiances, Kýdos |
| `assets/css/site.css` | Styles, trois ambiances (cephalo · kanto · kydos) |
| `assets/img/` | Captures des éditeurs (kantoaplo.com) et visuels Kýdos (kydosbelote.com) |

## Ajouter un éditeur à l'univers

Ajouter une entrée dans `bodies` (`assets/js/data.js`) : nom grec, couleur, orbite
(`a` rayon, `T` période, `p` phase), `parent` pour une lune, `status`, textes FR/EN.
`page` renvoie vers la section de l'éditeur sur kantoaplo.com (`#ed-<page>`).

## Lancer en local

```bash
python3 -m http.server 8000
```
