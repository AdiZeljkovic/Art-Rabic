/**
 * Pre-optimizacija korica knjiga.
 *
 * Originalne skenirane korice su prosječno 600 KB (najveća 4.3 MB, 17 MP).
 * Next.js ih optimizuje on-demand preko sharpa, što znači ~60-90 MB RAM-a i
 * do 2.4 s CPU-a PO SLICI. Sa 167 knjiga na jednoj stranici to obara proces.
 *
 * Korice se nigdje ne prikazuju šire od ~650 CSS px, pa je 800px izvor dovoljan
 * i za DPR 2. Rezultat: ~97 MB -> ~10 MB, i sharp radi 2.5x brže.
 *
 * `failOn: 'none'` je namjeran — tri fajla imaju truncated scan segmente
 * (76.jpg, 30.jpg, 70 prvi dio.jpg). Rekompresija ih usput popravi.
 *
 * Pokreni jednom i commituj rezultat:  node scripts/optimize-images.js
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const dir = path.resolve(__dirname, '../public/images/knjige')
const MAX_WIDTH = 800
const QUALITY = 82

/** Razmaci u imenu fajla znače %20 u URL-u — problem za nginx i Content-Disposition. */
function slugifyFilename(name) {
  const ext = path.extname(name)
  const base = path.basename(name, ext)
  return base.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9._-]/g, '') + '.webp'
}

async function main() {
  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png)$/i.test(f))
  console.log(`Pronađeno ${files.length} slika\n`)

  const renames = []
  let sourceBytes = 0
  let outputBytes = 0
  let failed = 0

  for (const file of files) {
    const src = path.join(dir, file)
    const outName = slugifyFilename(file)
    const out = path.join(dir, outName)

    try {
      const before = fs.statSync(src).size
      const buffer = await sharp(fs.readFileSync(src), { failOn: 'none' })
        .rotate()
        .resize(MAX_WIDTH, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer()

      fs.writeFileSync(out, buffer)
      if (out !== src) fs.unlinkSync(src)

      sourceBytes += before
      outputBytes += buffer.length
      renames.push({ from: `/images/knjige/${file}`, to: `/images/knjige/${outName}` })
    } catch (err) {
      console.error(`PAO: ${file} — ${err.message}`)
      failed++
    }
  }

  const mb = n => (n / 1024 / 1024).toFixed(1)
  console.log(`\nObrađeno: ${renames.length}, neuspjelo: ${failed}`)
  console.log(`Prije:  ${mb(sourceBytes)} MB`)
  console.log(`Poslije: ${mb(outputBytes)} MB  (${(sourceBytes / outputBytes).toFixed(1)}x manje)`)

  // SQL za ažuriranje postojeće baze
  const sqlPath = path.resolve(__dirname, '../migrate-image-paths.sql')
  const lines = [
    '-- Ažuriranje putanja slika nakon pre-optimizacije (jpg -> webp)',
    '-- Pokreni na bazi koja već ima uvezene knjige:',
    '--   mysql -u KORISNIK -p BAZA < migrate-image-paths.sql',
    '',
    ...renames
      .filter(r => r.from !== r.to)
      .map(r => `UPDATE \`Book\` SET imageUrl = '${r.to}' WHERE imageUrl = '${r.from.replace(/'/g, "''")}';`),
  ]
  fs.writeFileSync(sqlPath, lines.join('\n') + '\n', 'utf8')
  console.log(`\nSQL za postojeću bazu: ${sqlPath}`)

  return renames
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
