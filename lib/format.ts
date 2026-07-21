export type BookUI = {
  id: string
  title: string
  author: string
  category: string
  price: string
  image: string
  description?: string
  isbn?: string
  pages?: number
  format?: string
  year?: number
}

/**
 * Pretvori URL segment u ID baze. Vraća null za sve što nije pozitivan cijeli broj.
 *
 * Bez ove provjere `parseInt('abc')` daje NaN, Prisma ga odbije kao nedostajući
 * argument i stranica vrati 500 umjesto 404 — što pogađa i Googlebot i skenere.
 */
export function toId(raw: string): number | null {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

export function formatPrice(price: unknown): string {
  let num: number
  if (price === null || price === undefined) return '0,00 KM'
  if (typeof price === 'number') {
    num = price
  } else if (typeof price === 'object' && 'toNumber' in (price as object)) {
    num = (price as { toNumber(): number }).toNumber()
  } else {
    num = parseFloat(String(price).replace(',', '.').replace(/[^0-9.]/g, ''))
  }
  if (isNaN(num)) return '0,00 KM'
  return `${num.toFixed(2).replace('.', ',')} KM`
}

export function bookToUI(book: {
  id: number
  title: string
  author: string
  price: unknown
  imageUrl?: string | null
  description?: string | null
  isbn?: string | null
  pages?: number | null
  format?: string | null
  year?: number | null
  category?: { title: string } | null
}): BookUI {
  return {
    id: String(book.id),
    title: book.title,
    author: book.author,
    category: book.category?.title.toUpperCase() ?? '',
    price: formatPrice(book.price),
    image: book.imageUrl || '/book-placeholder.svg',
    description: book.description ?? undefined,
    isbn: book.isbn ?? undefined,
    pages: book.pages ?? undefined,
    format: book.format ?? undefined,
    year: book.year ?? undefined,
  }
}
