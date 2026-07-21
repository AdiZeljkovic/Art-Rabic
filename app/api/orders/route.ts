import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { getClientIp } from '@/lib/ip'
import { rateLimit } from '@/lib/rate-limit'
import { sendOrderConfirmation, sendOrderNotification } from '@/lib/email'

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[+\d][\d\s\-/()]{7,19}$/

/** Očisti i skrati string na maksimalnu dužinu kolone u bazi. */
function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function GET(req: NextRequest) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const orders = await prisma.order.findMany({
      where: status && VALID_STATUSES.includes(status)
        ? { status: status as 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' }
        : undefined,
      include: { book: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Greška pri dohvatu narudžbi' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`order:${getClientIp(req)}`, 5, 60 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Previše narudžbi u kratkom roku. Pokušajte ponovo kasnije.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    )
  }

  try {
    const body = await req.json()

    const bookId = Number(body?.bookId)
    const firstName = str(body?.firstName, 60)
    const lastName = str(body?.lastName, 60)
    const email = str(body?.email, 180)
    const phone = str(body?.phone, 30)
    const address = str(body?.address, 180)
    const city = str(body?.city, 80)
    const zip = str(body?.zip, 20)
    const note = str(body?.note, 1000)

    if (!firstName || !lastName || !email || !phone || !address || !city || !zip) {
      return NextResponse.json({ error: 'Sva obavezna polja moraju biti popunjena' }, { status: 400 })
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Unesite ispravnu email adresu' }, { status: 400 })
    }
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Unesite ispravan broj telefona' }, { status: 400 })
    }
    if (!Number.isInteger(bookId) || bookId <= 0) {
      return NextResponse.json({ error: 'Nevažeći ID knjige' }, { status: 400 })
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } })
    if (!book) return NextResponse.json({ error: 'Knjiga nije pronađena' }, { status: 404 })
    if (!book.inStock) {
      return NextResponse.json({ error: 'Knjiga trenutno nije na stanju' }, { status: 409 })
    }

    // Ista knjiga + isti email unutar minute = dupli submit, vrati postojeću narudžbu
    const recent = await prisma.order.findFirst({
      where: { bookId, email, createdAt: { gt: new Date(Date.now() - 60_000) } },
    })
    if (recent) return NextResponse.json(recent, { status: 200 })

    const bookPrice = Number(book.price)
    const deliveryFee = 7.00
    const totalPrice = bookPrice + deliveryFee

    const order = await prisma.order.create({
      data: {
        bookId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        zip,
        bookPrice,
        deliveryFee,
        totalPrice,
        note: note || null,
      },
    })

    // Email je best-effort — narudžba je već spremljena, ne blokiraj odgovor kupcu
    const orderData = { ...order, bookPrice: Number(order.bookPrice), deliveryFee: Number(order.deliveryFee), totalPrice: Number(order.totalPrice) }
    const bookData = { title: book.title, author: book.author }
    void Promise.allSettled([
      sendOrderConfirmation(orderData, bookData),
      sendOrderNotification(orderData, bookData),
    ]).then(results => {
      for (const r of results) {
        if (r.status === 'rejected') console.error('[email] narudžba', order.id, r.reason)
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error('[orders] POST', err)
    return NextResponse.json({ error: 'Greška pri kreiranju narudžbe' }, { status: 500 })
  }
}
