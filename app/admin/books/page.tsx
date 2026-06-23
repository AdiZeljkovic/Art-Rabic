import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DeleteBookButton from './DeleteBookButton';

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-graphite">Knjige</h1>
        <Link
          href="/admin/books/new"
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Dodaj knjigu
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Knjiga</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategorija</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cijena</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Na stanju</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Istaknuta</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 relative flex-shrink-0 border border-gray-200 overflow-hidden">
                        <Image
                          src={book.imageUrl || '/book-placeholder.svg'}
                          alt={book.title}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-graphite line-clamp-1">{book.title}</p>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{book.category?.title ?? '—'}</td>
                  <td className="px-4 py-3 text-graphite font-medium">{formatPrice(book.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${book.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {book.inStock ? 'Da' : 'Ne'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${book.featured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                      {book.featured ? 'Da' : 'Ne'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/books/${book.id}/edit`}
                        className="p-1.5 text-gray-500 hover:text-brand-red transition-colors"
                        title="Uredi"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteBookButton bookId={book.id} bookTitle={book.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Nema knjiga</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
