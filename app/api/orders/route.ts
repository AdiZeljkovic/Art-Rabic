import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { sendOrderConfirmation, sendOrderNotification } from '@/lib/email'

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  try {
    const body = await req.json()
    const { bookId, firstName, lastName, email, phone, address, city, zip, note } = body

    if (!bookId || !firstName || !lastName || !email || !phone || !address || !city || !zip) {
      return NextResponse.json({ error: 'Sva obavezna polja moraju biti popunjena' }, { status: 400 })
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Unesite ispravnu email adresu' }, { status: 400 })
    }
    if (isNaN(Number(bookId)) || Number(bookId) <= 0) {
      return NextResponse.json({ error: 'Nevažeći ID knjige' }, { status: 400 })
    }

    const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } })
    if (!book) return NextResponse.json({ error: 'Knjiga nije pronađena' }, { status: 404 })

    const bookPrice = Number(book.price)
    const deliveryFee = 7.00
    const totalPrice = bookPrice + deliveryFee

    const order = await prisma.order.create({
      data: {
        bookId: parseInt(bookId),
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

    const orderData = { ...order, bookPrice: Number(order.bookPrice), deliveryFee: Number(order.deliveryFee), totalPrice: Number(order.totalPrice) }
    const bookData = { title: book.title, author: book.author }
    await Promise.allSettled([
      sendOrderConfirmation(orderData, bookData),
      sendOrderNotification(orderData, bookData),
    ])

    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Greška pri kreiranju narudžbe' }, { status: 500 })
  }
}
