import { NextRequest, NextResponse } from 'next/server'
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

    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        title,
        author,
        price: parseFloat(price),
        categoryId: categoryId ? parseInt(categoryId) : null,
        imageUrl: imageUrl || null,
        description: description || null,
        isbn: isbn || null,
        pages: pages ? parseInt(pages) : null,
        format: format || null,
        year: year ? parseInt(year) : null,
        inStock: Boolean(inStock),
        featured: Boolean(featured),
      },
      include: { category: true },
    })
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
    const pendingOrders = await prisma.order.count({
      where: { bookId, status: { in: ['PENDING', 'CONFIRMED', 'SHIPPED'] } },
    })

    if (pendingOrders > 0) {
      return NextResponse.json({ error: 'Knjiga ima aktivne narudžbe i ne može se obrisati' }, { status: 409 })
    }

    await prisma.book.delete({ where: { id: bookId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Greška pri brisanju knjige' }, { status: 500 })
  }
}
