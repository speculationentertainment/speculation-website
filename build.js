/* ============================================================
   GALLERY MANIFEST BUILDER
   Runs automatically on every Netlify deploy. It looks inside
   assets/gallery, lists every image it finds, and writes that
   list to assets/gallery/manifest.json. The website reads that
   file to build the photo carousel.

   You never need to run or edit this. To change the gallery,
   just add or remove image files in assets/gallery.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'assets', 'gallery');
const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

let files = [];
try {
  files = fs.readdirSync(galleryDir)
    .filter(f => imageExts.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
} catch (err) {
  console.warn('Could not read gallery folder:', err.message);
}

fs.writeFileSync(
  path.join(galleryDir, 'manifest.json'),
  JSON.stringify(files, null, 2) + '\n'
);

console.log(`Gallery manifest written with ${files.length} photo(s): ${files.join(', ') || '(none)'}`);
