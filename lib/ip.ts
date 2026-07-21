import { NextRequest } from 'next/server'

/**
 * Vraća stvarnu IP adresu klijenta.
 *
 * Nginx (HestiaCP) koristi `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for`,
 * što DODAJE stvarnu adresu na KRAJ liste. Sve prije toga poslao je klijent i može biti lažno.
 * Zato uzimamo zadnji unos, a ne prvi — inače se rate limit zaobilazi slanjem
 * lažnog `X-Forwarded-For` headera pri svakom zahtjevu.
 */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map(s => s.trim()).filter(Boolean)
    const last = parts[parts.length - 1]
    if (last) return last
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}
