import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return NextResponse.json({ error: 'Nevažeći ID' }, { status: 400 })
    }

    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    })
    if (!book) return NextResponse.json({ error: 'Knjiga nije pronađena' }, { status: 404 })
    return NextResponse.json(book)
  } catch {
    return NextResponse.json({ error: 'Greška pri dohvatu knjige' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const { id } = await params
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return NextResponse.json({ error: 'Nevažeći ID' }, { status: 400 })
    }

    const body = await req.json()
    const { title, author, price, categoryId, imageUrl, description, isbn, pages, format, year, inStock, featured } = body

    // Ažuriraj SAMO polja koja su stvarno poslana. Ranije je ovdje svako
    // izostavljeno polje bilo postavljeno na null, pa je uređivanje naslova
    // brisalo ISBN, broj stranica, format, godinu i kategoriju.
    const data: Record<string, unknown> = {}

    if (title !== undefined) {
      if (!String(title).trim()) return NextResponse.json({ error: 'Naslov je obavezan' }, { status: 400 })
      data.title = String(title).trim().slice(0, 190)
    }
    if (author !== undefined) {
      if (!String(author).trim()) return NextResponse.json({ error: 'Autor je obavezan' }, { status: 400 })
      data.author = String(author).trim().slice(0, 190)
    }
    if (price !== undefined) {
      const parsed = parseFloat(price)
      if (isNaN(parsed) || parsed < 0) {
        return NextResponse.json({ error: 'Nevažeća cijena' }, { status: 400 })
      }
      data.price = parsed
    }
    if (imageUrl !== undefined) {
      const value = imageUrl ? String(imageUrl).trim() : ''
      if (value && !value.startsWith('/')) {
        return NextResponse.json({ error: 'URL slike mora biti lokalna putanja (npr. /images/knjige/1.jpg)' }, { status: 400 })
      }
      data.imageUrl = value || null
    }
    if (categoryId !== undefined) data.categoryId = categoryId ? parseInt(categoryId) : null
    if (description !== undefined) data.description = description || null
    if (isbn !== undefined) data.isbn = isbn || null
    if (pages !== undefined) data.pages = pages ? parseInt(pages) : null
    if (format !== undefined) data.format = format || null
    if (year !== undefined) data.year = year ? parseInt(year) : null
    if (inStock !== undefined) data.inStock = Boolean(inStock)
    if (featured !== undefined) data.featured = Boolean(featured)

    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data,
      include: { category: true },
    })

    revalidatePath('/')
    revalidatePath('/knjige')
    revalidatePath(`/knjige/${id}`)

    return NextResponse.json(book)
  } catch {
    return NextResponse.json({ error: 'Greška pri ažuriranju knjige' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const { id } = await params
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return NextResponse.json({ error: 'Nevažeći ID' }, { status: 400 })
    }

    const bookId = parseInt(id)

    // Foreign key je ON DELETE RESTRICT — brisanje puca i za isporučene i
    // otkazane narudžbe, ne samo za aktivne. Zato brojimo sve.
    const orderCount = await prisma.order.count({ where: { bookId } })
    if (orderCount > 0) {
      return NextResponse.json(
        { error: `Knjiga ima ${orderCount} povezanih narudžbi i ne može se obrisati. Označite je kao "nije na stanju" umjesto brisanja.` },
        { status: 409 }
      )
    }

    await prisma.book.delete({ where: { id: bookId } })

    revalidatePath('/')
    revalidatePath('/knjige')

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Greška pri brisanju knjige' }, { status: 500 })
  }
}
