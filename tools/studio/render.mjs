/* ═══════════════════════════════════════════════════════════════════════
   STUDIO VISUELS — rendu des images (Chromium via Playwright + ImageMagick)

   node render.mjs                         tous les thèmes, toutes les images
   node render.mjs psephide marmaron       seulement ces thèmes
   node render.mjs psephide --kind=poster --id=zeugma --out=/tmp/essai

   Sortie (par défaut) : ../../assets/visuels/<thème>/
     couverture.jpg   1640 × 924   couverture Facebook (zone sûre : bande centrale 1640 × 624)
     profil.jpg       1080 × 1080  photo de profil (lisible dans un cercle)
     logo.png         1600 × 1600  logo, fond transparent
     editeurs/<id>.jpg 1080 × 1350 une affiche par éditeur (format portrait 4:5 du fil)
     mini/…webp                    vignettes du site vitrine
   ═══════════════════════════════════════════════════════════════════════ */
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));

const ALL = ['psephide', 'chrysos', 'marmaron', 'keramikos', 'antikythera', 'architekton', 'iris'];
const EDITORS = [...readFileSync(join(here, 'content.js'), 'utf8').matchAll(/\{ id: '([a-z]+)', greek:/g)].map((m) => m[1]);
const SIZES = { poster: [1080, 1350], cover: [1640, 924], profile: [1080, 1080], logo: [1600, 1600] };

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const themes = args.filter((a) => !a.startsWith('--'));
const outRoot = resolve(opt.out || join(here, '../../assets/visuels'));

function jobs(theme) {
  const list = [];
  const want = (k) => !opt.kind || opt.kind === k;
  if (want('cover')) list.push({ kind: 'cover', file: 'couverture' });
  if (want('profile')) list.push({ kind: 'profile', file: 'profil' });
  if (want('logo')) list.push({ kind: 'logo', file: 'logo' });
  if (want('poster')) EDITORS.filter((id) => !opt.id || opt.id.split(',').includes(id)).forEach((id) => list.push({ kind: 'poster', id, file: 'editeurs/' + id }));
  return list.map((j) => ({ ...j, theme }));
}

const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const base = pathToFileURL(join(here, 'render.html')).href;
let failed = 0;
for (const theme of themes.length ? themes : ALL) {
  for (const j of jobs(theme)) {
    const [W, H] = SIZES[j.kind];
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => console.error('  page:', e.message));
    await page.goto(`${base}#theme=${theme}&kind=${j.kind}${j.id ? '&id=' + j.id : ''}`);
    await page.waitForFunction(() => window.__done, null, { timeout: 120000 });
    const done = await page.evaluate(() => window.__done);
    if (done !== 'ok') { console.error(`✗ ${theme}/${j.file}\n${done}`); failed++; await page.close(); continue; }
    const dir = join(outRoot, theme);
    const png = join(dir, j.file + '.png');
    mkdirSync(dirname(png), { recursive: true });
    await page.locator('#stage').screenshot({ path: png, omitBackground: j.kind === 'logo' });
    await page.close();
    const mini = join(dir, 'mini', j.file.replace('editeurs/', '') + '.webp');
    mkdirSync(dirname(mini), { recursive: true });
    const miniW = j.kind === 'cover' ? 900 : j.kind === 'poster' ? 480 : 400;
    execFileSync('convert', [png, '-resize', `${miniW}x`, '-quality', '78', '-define', 'webp:method=6', mini]);
    if (j.kind !== 'logo') {
      execFileSync('convert', [png, '-sampling-factor', '4:2:0', '-strip', '-quality', '88', '-interlace', 'JPEG', png.replace(/\.png$/, '.jpg')]);
      execFileSync('rm', [png]);
    } else {
      execFileSync('convert', [png, '-strip', '-define', 'png:compression-level=9', png]);
    }
    console.log(`✓ ${theme}/${j.file}`);
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
