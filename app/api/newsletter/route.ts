import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { getClientIp } from '@/lib/ip'
import { rateLimit } from '@/lib/rate-limit'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(req: NextRequest) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    })
    return NextResponse.json(subscribers)
  } catch {
    return NextResponse.json({ error: 'Greška pri dohvatu pretplatnika' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`newsletter:${getClientIp(req)}`, 5, 60 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Previše pokušaja. Pokušajte ponovo kasnije.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    )
  }

  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().slice(0, 180) : ''
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Unesite ispravnu email adresu' }, { status: 400 })
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    })
    return NextResponse.json(subscriber, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Greška pri pretplati' }, { status: 500 })
  }
}
