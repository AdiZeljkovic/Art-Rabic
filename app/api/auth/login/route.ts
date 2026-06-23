import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { makeAdminToken, setAdminCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count++
  return { allowed: true }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Previše neuspjelih pokušaja. Pokušajte ponovo za ${Math.ceil((rateLimit.retryAfter ?? 900) / 60)} minuta.` },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
    )
  }

  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Korisničko ime i lozinka su obavezni' }, { status: 400 })
    }

    const user = await prisma.adminUser.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: 'Pogrešno korisničko ime ili lozinka' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Pogrešno korisničko ime ili lozinka' }, { status: 401 })
    }

    // Reset rate limit on successful login
    loginAttempts.delete(ip)

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
