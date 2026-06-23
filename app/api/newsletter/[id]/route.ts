import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const { id } = await params
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return NextResponse.json({ error: 'Nevažeći ID' }, { status: 400 })
    }

    await prisma.newsletterSubscriber.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Greška pri brisanju pretplatnika' }, { status: 500 })
  }
}
