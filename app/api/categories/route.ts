import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { title: 'asc' } })
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Greška pri dohvatu kategorija' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const { title, slug, description } = await req.json()
    if (!title || !slug) return NextResponse.json({ error: 'title i slug su obavezni' }, { status: 400 })

    const category = await prisma.category.create({ data: { title, slug, description } })
    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Greška pri kreiranju kategorije' }, { status: 500 })
  }
}
