import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import fs from 'fs'
import path from 'path'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

const HTML_DIR = path.resolve('C:/Users/adize/Documents/Projekti/ART RABIC/mikulicknjige')
const IMAGES_SRC = path.join(HTML_DIR, 'images/knjige')
const IMAGES_DEST = path.join(process.cwd(), 'public/knjige')

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseTitle(html: string): string {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  return m ? stripTags(m[1]) : ''
}

function parseAuthor(html: string): string {
  const m = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)
  if (!m) return ''
  return stripTags(m[1]).replace(/^[Aa]utor:\s*/i, '').trim()
}

function parsePrice(html: string): number {
  const m = html.match(/class="price-colored"[^>]*>([\s\S]*?)<\/span>/i)
  if (!m) return 0
  const raw = stripTags(m[1])
  const numMatch = raw.match(/(\d+)[.,](\d+)/)
  if (!numMatch) {
    const intMatch = raw.match(/(\d+)\s*KM/)
    return intMatch ? parseInt(intMatch[1]) : 0
  }
  return parseFloat(`${numMatch[1]}.${numMatch[2]}`)
}

function parseDescription(html: string): string {
  const priceIdx = html.indexOf('price-colored')
  if (priceIdx === -1) return ''
  const afterPrice = html.slice(priceIdx)
  const m = afterPrice.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  return m ? stripTags(m[1]) : ''
}

function parseImageFile(html: string): string | null {
  const m = html.match(/src="images\/knjige\/([^"]+)"/i)
  return m ? m[1] : null
}

async function main() {
  // Obriši prethodni pokušaj importa (knjige bez kategorije) da izbjegnemo duplikate
  const existing = await prisma.book.count({ where: { categoryId: null } })
  if (existing > 0) {
    console.log(`Brišem ${existing} prethodno uvezenih knjiga...`)
    await prisma.book.deleteMany({ where: { categoryId: null } })
  }

  fs.mkdirSync(IMAGES_DEST, { recursive: true })

  const files = fs.readdirSync(HTML_DIR)
    .filter((f: string) => /^knjiga\d+\.html$/i.test(f))
    .sort((a: string, b: string) => {
      const na = parseInt(a.match(/\d+/)![0])
      const nb = parseInt(b.match(/\d+/)![0])
      return na - nb
    })

  console.log(`Pronađeno ${files.length} HTML fajlova.`)

  let count = 0
  let errors = 0
  const errorFiles: string[] = []

  for (const file of files) {
    const html = fs.readFileSync(path.join(HTML_DIR, file), 'utf8')
    const title = parseTitle(html)
    const author = parseAuthor(html)
    const price = parsePrice(html)
    const description = parseDescription(html)
    const imgFile = parseImageFile(html)

    if (!title || price <= 0) {
      console.warn(`⚠  ${file}: naslov="${title}" cijena=${price}`)
      errorFiles.push(file)
      errors++
      continue
    }

    let imageUrl: string | null = null
    if (imgFile) {
      const src = path.join(IMAGES_SRC, imgFile)
      if (fs.existsSync(src)) {
        const dest = path.join(IMAGES_DEST, imgFile)
        if (!fs.existsSync(dest)) fs.copyFileSync(src, dest)
        imageUrl = `/knjige/${imgFile}`
      } else {
        console.warn(`⚠  ${file}: slika nije pronađena: ${imgFile}`)
      }
    }

    await prisma.book.create({
      data: {
        title,
        author,
        price,
        description: description || null,
        imageUrl,
        inStock: true,
        featured: false,
      },
    })
    count++
    if (count % 20 === 0) console.log(`  ... ${count} knjiga uvezeno`)
  }

  console.log(`\nZavršeno! Uvezeno: ${count} knjiga. Greške: ${errors}`)
  if (errorFiles.length > 0) {
    console.log('Problematični fajlovi:', errorFiles.join(', '))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
