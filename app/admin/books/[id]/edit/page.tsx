import { prisma } from '@/lib/prisma';
import { toId } from '@/lib/format';
import BookForm from '../../BookForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = toId(id);
  if (!bookId) notFound();

  const [book, categories] = await Promise.all([
    prisma.book.findUnique({ where: { id: bookId } }),
    prisma.category.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
  ]);

  if (!book) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/books" className="flex items-center gap-2 text-sm text-gray-500 hover:text-graphite mb-4">
          <ArrowLeft className="w-4 h-4" /> Nazad na knjige
        </Link>
        <h1 className="text-2xl font-semibold text-graphite">Uredi knjigu</h1>
        <p className="text-gray-500 mt-1">{book.title}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <BookForm book={{ ...book, price: Number(book.price) }} categories={categories} />
      </div>
    </div>
  );
}
