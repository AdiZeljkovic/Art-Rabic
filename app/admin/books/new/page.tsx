import { prisma } from '@/lib/prisma';
import BookForm from '../BookForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewBookPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/books" className="flex items-center gap-2 text-sm text-gray-500 hover:text-graphite mb-4">
          <ArrowLeft className="w-4 h-4" /> Nazad na knjige
        </Link>
        <h1 className="text-2xl font-semibold text-graphite">Dodaj novu knjigu</h1>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <BookForm categories={categories} />
      </div>
    </div>
  );
}
