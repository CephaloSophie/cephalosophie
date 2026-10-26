# Visuels de la page Facebook — Cephalo Sophie

Sept thèmes, un dossier chacun. Les images sont prêtes à être déposées telles quelles sur
Facebook ; le site vitrine en affiche un, choisi par un paramètre public (voir plus bas).
Fabriqués par `tools/studio` (`node render.mjs`).

```
assets/visuels/<thème>/
  couverture.jpg        1640 × 924   photo de couverture
  profil.jpg            1080 × 1080  photo de profil
  logo.png              1600 × 1600  logo + nom, fond transparent
  editeurs/<id>.jpg     1080 × 1350  une affiche par éditeur (portrait 4:5)
  mini/…                             vignettes WebP du site
```

| Thème | Nom |
|---|---|
| `psephide` | Ψηφιδωτό — Mosaïque (**par défaut**) |
| `chrysos` | Χρυσός Οὐρανός — Constellation d'or |
| `marmaron` | Μάρμαρον — Marbre & néon |
| `keramikos` | Κεραμική — Figures rouges |
| `antikythera` | Ἀντικύθηρα — Le mécanisme |
| `architekton` | Ἀρχιτέκτων — L'épure |
| `iris` | Ἶρις — Prisme |

Les 13 affiches : Skopos, Héphaïstos, Zeugma, Psèphos, Typos, Tektôn, Logos, Skhêma, Kýdos,
Mantis, Kairos, Synergos, Hermès.

## Sur Facebook

- **Couverture** : Facebook affiche la bande centrale (1640 × 624) sur ordinateur et l'image
  entière sur mobile. Tout ce qui compte est dans cette bande ; le bas à gauche reste dégagé
  pour la photo de profil.
- **Profil** : composé pour un cercle ; rien d'important dans les coins.
- **Affiches** : le format 4:5 occupe le plus de place dans le fil. Une publication par
  éditeur, ou un carrousel par thème.

## Le thème du site vitrine

Il n'apparaît nulle part dans l'interface. Le thème par défaut est le paramètre public
`theme` de `assets/js/data.js`. On ne le change que depuis la console du navigateur ; le
choix est gardé dans le `localStorage` :

```js
cephalo.theme()             // liste des thèmes et thème actif
cephalo.theme('marmaron')   // change de thème et le garde
cephalo.theme(null)         // oublie le choix : retour au thème par défaut
```
