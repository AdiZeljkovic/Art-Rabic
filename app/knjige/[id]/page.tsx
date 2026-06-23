import { prisma } from '@/lib/prisma';
import { bookToUI } from '@/lib/format';
import BookDetailContent from '@/components/books/BookDetailContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });
  if (!book) return { title: 'Knjiga nije pronađena' };
  return {
    title: `${book.title} | Art Rabic`,
    description: book.description,
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });

  if (!book) notFound();

  return <BookDetailContent book={bookToUI(book)} />;
}
