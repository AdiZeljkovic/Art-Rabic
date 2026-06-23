import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { sendContactNotification } from '@/lib/email'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(req: NextRequest) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const { searchParams } = new URL(req.url)
    const unread = searchParams.get('unread') === 'true'

    const messages = await prisma.contactMessage.findMany({
      where: unread ? { isRead: false } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json({ error: 'Greška pri dohvatu poruka' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Sva polja su obavezna' }, { status: 400 })
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Unesite ispravnu email adresu' }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Poruka je predugačka (max 5000 znakova)' }, { status: 400 })
    }

    const msg = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    })

    await sendContactNotification({ name, email, subject, message }).catch(() => null)

    return NextResponse.json(msg, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Greška pri slanju poruke' }, { status: 500 })
  }
}
