import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { bookToUI, toId } from '@/lib/format';
import CheckoutContent from '@/components/checkout/CheckoutContent';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) return { title: 'Checkout' };

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { category: true },
  });
  if (!book) return { title: 'Checkout' };
  return { title: `Kupovina: ${book.title} | Art Rabic` };
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) notFound();

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { category: true },
  });

  // Knjiga koja nije na stanju ne smije imati checkout stranicu
  if (!book || !book.inStock) notFound();

  return <CheckoutContent book={bookToUI(book)} />;
}
