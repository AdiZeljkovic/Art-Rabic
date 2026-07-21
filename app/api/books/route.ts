import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      where: { inStock: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(books)
  } catch {
    return NextResponse.json({ error: 'Greška pri dohvatu knjiga' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const body = await req.json()
    const { title, author, price, categoryId, imageUrl, description, isbn, pages, format, year, inStock, featured } = body

    if (!String(title ?? '').trim() || !String(author ?? '').trim()) {
      return NextResponse.json({ error: 'Naslov i autor su obavezni' }, { status: 400 })
    }

    // `!price` bi odbacilo i cijenu 0, pa provjeravamo eksplicitno
    const parsedPrice = parseFloat(price)
    if (price === undefined || price === null || price === '' || isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: 'Nevažeća cijena' }, { status: 400 })
    }

    const cleanImageUrl = imageUrl ? String(imageUrl).trim() : ''
    if (cleanImageUrl && !cleanImageUrl.startsWith('/')) {
      return NextResponse.json(
        { error: 'URL slike mora biti lokalna putanja (npr. /images/knjige/1.jpg)' },
        { status: 400 }
      )
    }

    const book = await prisma.book.create({
      data: {
        title: String(title).trim().slice(0, 190),
        author: String(author).trim().slice(0, 190),
        price: parsedPrice,
        categoryId: categoryId ? parseInt(categoryId) : null,
        imageUrl: cleanImageUrl || null,
        description: description || null,
        isbn: isbn || null,
        pages: pages ? parseInt(pages) : null,
        format: format || null,
        year: year ? parseInt(year) : null,
        inStock: inStock ?? true,
        featured: featured ?? false,
      },
      include: { category: true },
    })

    revalidatePath('/')
    revalidatePath('/knjige')

    return NextResponse.json(book, { status: 201 })
  } catch (err) {
    console.error('[books] POST', err)
    return NextResponse.json({ error: 'Greška pri kreiranju knjige' }, { status: 500 })
  }
}
