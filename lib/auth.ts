import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'admin_session'
const SUBJECT = 'admin'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

async function hmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Token format: admin.{iat}.{hmac(admin.iat)}
// Each login produces a unique token that expires after SESSION_MAX_AGE
export async function makeAdminToken(): Promise<string> {
  const iat = Math.floor(Date.now() / 1000)
  const payload = `${SUBJECT}.${iat}`
  const sig = await hmacSha256(payload, process.env.COOKIE_SECRET!)
  return `${payload}.${sig}`
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [subject, iatStr, sig] = parts
    if (subject !== SUBJECT) return false

    const iat = parseInt(iatStr, 10)
    const now = Math.floor(Date.now() / 1000)
    if (isNaN(iat) || now - iat > SESSION_MAX_AGE || iat > now + 60) return false

    const payload = `${subject}.${iatStr}`
    const expected = await hmacSha256(payload, process.env.COOKIE_SECRET!)
    return sig === expected
  } catch {
    return false
  }
}

export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  return verifyAdminToken(token)
}

export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const valid = await isAdminRequest(req)
  if (!valid) return NextResponse.json({ error: 'Neovlašteni pristup' }, { status: 401 })
  return null
}

export function setAdminCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
}

export function clearAdminCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
}
