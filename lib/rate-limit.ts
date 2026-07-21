type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()
const MAX_ENTRIES = 20_000

function sweep(now: number): void {
  for (const [key, entry] of buckets) {
    if (now > entry.resetAt) buckets.delete(key)
  }
}

/**
 * In-memory rate limiter. Ključ treba sadržavati i namjenu i IP,
 * npr. `order:1.2.3.4`, da se limiti različitih ruta ne miješaju.
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; retryAfter: number } {
  const now = Date.now()

  if (buckets.size > MAX_ENTRIES) {
    sweep(now)
    // Ako je i nakon čišćenja mapa puna, odbij zahtjev umjesto rasta memorije
    if (buckets.size > MAX_ENTRIES) {
      return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) }
    }
  }

  const entry = buckets.get(key)
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { allowed: true, retryAfter: 0 }
}

export function resetRateLimit(key: string): void {
  buckets.delete(key)
}
