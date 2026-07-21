import BooksListContent from '@/components/books/BooksListContent';
import { prisma } from '@/lib/prisma';
import { bookToUI } from '@/lib/format';

export const metadata = {
  title: 'Naše knjige | Art Rabic',
  description: 'Pregledajte sva izdanja izdavačke kuće Art Rabic.',
};

export const revalidate = 3600;

export default async function BooksPage() {
  const dbBooks = await prisma.book.findMany({
    where: { inStock: true },
    select: {
      id: true, title: true, author: true, price: true, imageUrl: true,
      category: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const books = dbBooks.map(bookToUI);
  return <BooksListContent books={books} />;
}
