import { prisma } from '@/lib/prisma';
import { bookToUI, toId } from '@/lib/format';
import BookDetailContent from '@/components/books/BookDetailContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) return { title: 'Knjiga nije pronađena' };

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { category: true },
  });
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

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { category: true },
  });

  if (!book) notFound();

  return <BookDetailContent book={bookToUI(book)} />;
}
