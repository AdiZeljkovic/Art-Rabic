import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { bookToUI, toId } from '@/lib/format';
import BookDetailContent from '@/components/books/BookDetailContent';
import { notFound } from 'next/navigation';

export const revalidate = 3600;
export const dynamicParams = true;

// React cache spaja upit iz generateMetadata i iz komponente u jedan.
// Next memoizuje samo fetch(), ne Prisma pozive.
const getBook = cache((id: number) =>
  prisma.book.findUnique({ where: { id }, include: { category: true } })
);

export async function generateStaticParams() {
  try {
    const books = await prisma.book.findMany({
      where: { inStock: true },
      select: { id: true },
    });
    return books.map(b => ({ id: String(b.id) }));
  } catch {
    // Baza nedostupna tokom builda — stranice se generišu on-demand
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) return { title: 'Knjiga nije pronađena' };

  const book = await getBook(bookId);
  if (!book) return { title: 'Knjiga nije pronađena' };
  return {
    title: `${book.title} | Art Rabic`,
    description: book.description ?? undefined,
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) notFound();

  const book = await getBook(bookId);
  if (!book) notFound();

  return <BookDetailContent book={bookToUI(book)} />;
}
