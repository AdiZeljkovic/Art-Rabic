import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { bookToUI } from '@/lib/format';
import CheckoutContent from '@/components/checkout/CheckoutContent';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });
  if (!book) return { title: 'Checkout' };
  return { title: `Kupovina: ${book.title} | Art Rabic` };
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });

  if (!book) notFound();

  return <CheckoutContent book={bookToUI(book)} />;
}
