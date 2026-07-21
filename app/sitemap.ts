import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Bez ovoga se sitemap prerenderuje tokom builda i `next build` pada
// ako baza nije dostupna — deploy postaje nemoguć dok baza ne odgovori.
export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mikulicknjige.com'

  let books: { id: number; updatedAt: Date }[] = []
  try {
    books = await prisma.book.findMany({
      where: { inStock: true },
      select: { id: true, updatedAt: true },
    })
  } catch (err) {
    console.error('[sitemap] baza nedostupna, vraćam samo statične rute', err)
  }

  const bookUrls = books.map((book) => ({
    url: `${baseUrl}/knjige/${book.id}`,
    lastModified: book.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/knjige`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/o-nama`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/kontakt`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/o-kupovini`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/uslovi-kupovine`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/pravila-koristenja`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...bookUrls,
  ]
}
