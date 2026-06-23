import { NextRequest, NextResponse } from 'next/server'
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

    if (!title || !author || !price) {
      return NextResponse.json({ error: 'Obavezna polja nedostaju' }, { status: 400 })
    }

    const book = await prisma.book.create({
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
        inStock: inStock ?? true,
        featured: featured ?? false,
      },
      include: { category: true },
    })
    return NextResponse.json(book, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Greška pri kreiranju knjige' }, { status: 500 })
  }
}
