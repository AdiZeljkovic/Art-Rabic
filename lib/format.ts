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
