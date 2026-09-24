/**
 * Prépare les photos pour le web.
 *
 *   npm run images
 *
 * Lit les originaux dans `photos-sources/`, écrit les versions optimisées
 * (AVIF + WebP + JPEG, plusieurs largeurs) dans `src/assets/img/`, et met à
 * jour `src/_data/photos.json` avec les dimensions et la vignette de
 * préchargement de chaque image.
 *
 * Pour ajouter une photo : la déposer dans `photos-sources/`, l'ajouter à la
 * liste SOURCES ci-dessous, relancer la commande.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';

const SOURCES = [
  { file: 'expo-kiosque.jpg', name: 'expo-kiosque' },
  // Capture d'écran Instagram : on rogne le bandeau bas (icône de profil et
  // pastilles de pagination). À remplacer par la photo d'origine si on la
  // retrouve — la flèche de carrousel reste incrustée au milieu à droite.
  { file: 'expo-chapelle.jpg', name: 'expo-chapelle', cropBottom: 48 },
];

const WIDTHS = [480, 960, 1440, 1920];
const OUT = 'src/assets/img';
const DATA = 'src/_data/photos.json';

mkdirSync(OUT, { recursive: true });
mkdirSync('src/_data', { recursive: true });

const manifest = {};

for (const { file, name, cropBottom } of SOURCES) {
  const src = `photos-sources/${file}`;
  const origin = sharp(src).rotate();
  const meta = await origin.metadata();
  console.log(`${src} — ${meta.width}×${meta.height}, ${(statSync(src).size / 1048576).toFixed(1)} Mo`);

  let pipeline = origin;
  if (cropBottom) {
    pipeline = pipeline.extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: meta.height - cropBottom,
    });
  }

  const source = await pipeline.toBuffer();
  const { width, height } = await sharp(source).metadata();
  const widths = WIDTHS.filter((w) => w <= width);
  if (widths.length === 0) widths.push(width);

  for (const w of widths) {
    const resized = sharp(source).resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 55, effort: 6 }).toFile(`${OUT}/${name}-${w}.avif`);
    await resized.clone().webp({ quality: 74 }).toFile(`${OUT}/${name}-${w}.webp`);
    await resized.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/${name}-${w}.jpg`);
    const kb = (statSync(`${OUT}/${name}-${w}.avif`).size / 1024).toFixed(0);
    console.log(`  ${w}px — avif ${kb} Ko`);
  }

  // Vignette 20px encodée en base64, affichée floutée le temps du chargement.
  const lqip = await sharp(source).resize({ width: 20 }).webp({ quality: 40 }).toBuffer();

  manifest[name] = {
    width,
    height,
    widths,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
}

writeFileSync(DATA, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n→ ${DATA} mis à jour.`);

// Vignette de partage (Facebook, WhatsApp, LinkedIn, Instagram…).
await sharp('photos-sources/expo-kiosque.jpg')
  .rotate()
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(`${OUT}/og.jpg`);
console.log(`→ ${OUT}/og.jpg (1200×630)`);

// Icône iOS, rendue depuis le favicon SVG.
await sharp('src/assets/favicon.svg', { density: 384 })
  .resize(180, 180)
  .png()
  .toFile('src/assets/apple-touch-icon.png');
console.log('→ src/assets/apple-touch-icon.png (180×180)');
