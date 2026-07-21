import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { makeAdminToken, setAdminCookie } from '@/lib/auth'
import { getClientIp } from '@/lib/ip'
import { rateLimit, resetRateLimit } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

// Hash nepostojeće lozinke — poredimo i kad korisnik ne postoji, da vrijeme
// odgovora bude isto i ne otkriva postoji li korisničko ime.
const DUMMY_HASH = '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const key = `login:${ip}`
  const limit = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS)

  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Previše neuspjelih pokušaja. Pokušajte ponovo za ${Math.ceil(limit.retryAfter / 60)} minuta.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    )
  }

  try {
    const body = await req.json()
    const username = typeof body?.username === 'string' ? body.username.trim() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!username || !password || username.length > 100 || password.length > 200) {
      return NextResponse.json({ error: 'Korisničko ime i lozinka su obavezni' }, { status: 400 })
    }

    const user = await prisma.adminUser.findUnique({ where: { username } })
    const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)

    if (!user || !valid) {
      return NextResponse.json({ error: 'Pogrešno korisničko ime ili lozinka' }, { status: 401 })
    }

    resetRateLimit(key)

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = await makeAdminToken()
    const res = NextResponse.json({ success: true })
    setAdminCookie(res, token)
    return res
  } catch {
    return NextResponse.json({ error: 'Greška pri prijavi' }, { status: 500 })
  }
}
