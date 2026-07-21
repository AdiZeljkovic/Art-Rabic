import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { getClientIp } from '@/lib/ip'
import { rateLimit } from '@/lib/rate-limit'
import { sendContactNotification } from '@/lib/email'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

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
  const limit = rateLimit(`contact:${getClientIp(req)}`, 3, 60 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Previše poruka u kratkom roku. Pokušajte ponovo kasnije.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    )
  }

  try {
    const body = await req.json()
    const name = str(body?.name, 100)
    const email = str(body?.email, 180)
    const subject = str(body?.subject, 150)
    const message = str(body?.message, 5000)

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Sva polja su obavezna' }, { status: 400 })
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Unesite ispravnu email adresu' }, { status: 400 })
    }

    const msg = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    })

    // Email je best-effort — poruka je već spremljena u bazi
    void sendContactNotification({ name, email, subject, message })
      .catch(err => console.error('[email] kontakt', msg.id, err))

    return NextResponse.json(msg, { status: 201 })
  } catch (err) {
    console.error('[contact] POST', err)
    return NextResponse.json({ error: 'Greška pri slanju poruke' }, { status: 500 })
  }
}
