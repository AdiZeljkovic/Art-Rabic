'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type BookData = {
  id?: number;
  title?: string;
  author?: string;
  price?: string | number;
  imageUrl?: string | null;
  description?: string | null;
  inStock?: boolean;
  featured?: boolean;
};

export default function BookForm({ book }: { book?: BookData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const isEdit = !!book?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;

    const data = {
      title: (form.querySelector('[name=title]') as HTMLInputElement).value,
      author: (form.querySelector('[name=author]') as HTMLInputElement).value,
      price: (form.querySelector('[name=price]') as HTMLInputElement).value,
      imageUrl: (form.querySelector('[name=imageUrl]') as HTMLInputElement).value || null,
      description: (form.querySelector('[name=description]') as HTMLTextAreaElement).value || null,
      inStock: (form.querySelector('[name=inStock]') as HTMLInputElement).checked,
      featured: (form.querySelector('[name=featured]') as HTMLInputElement).checked,
    };

    const url = isEdit ? `/api/books/${book.id}` : '/api/books';
    const method = isEdit ? 'PUT' : 'POST';

    startTransition(async () => {
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d.error || 'Greška pri snimanju');
          return;
        }
        router.push('/admin/books');
        router.refresh();
      } catch {
        setError('Greška pri snimanju. Pokušajte ponovo.');
      }
    });
  };

  const priceValue = book?.price !== undefined
    ? typeof book.price === 'object'
      ? (book.price as { toNumber(): number }).toNumber().toFixed(2)
      : String(book.price)
    : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-600">Naslov *</label>
          <input name="title" required defaultValue={book?.title} className="w-full px-3 py-2 border border-gray-300 focus:border-brand-red focus:outline-none text-graphite" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-600">Autor *</label>
          <input name="author" required defaultValue={book?.author} className="w-full px-3 py-2 border border-gray-300 focus:border-brand-red focus:outline-none text-graphite" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-600">Cijena (KM) *</label>
          <input name="price" type="number" step="0.01" min="0" required defaultValue={priceValue} className="w-full px-3 py-2 border border-gray-300 focus:border-brand-red focus:outline-none text-graphite" />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-600">URL slike</label>
          <input name="imageUrl" defaultValue={book?.imageUrl ?? ''} className="w-full px-3 py-2 border border-gray-300 focus:border-brand-red focus:outline-none text-graphite" placeholder="/knjige/slika.jpg" />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-600">Opis</label>
          <textarea name="description" rows={5} defaultValue={book?.description ?? ''} className="w-full px-3 py-2 border border-gray-300 focus:border-brand-red focus:outline-none text-graphite resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <input name="inStock" type="checkbox" id="inStock" defaultChecked={book?.inStock ?? true} className="w-4 h-4 accent-brand-red" />
          <label htmlFor="inStock" className="text-sm font-medium text-gray-700">Na stanju</label>
        </div>
        <div className="flex items-center gap-3">
          <input name="featured" type="checkbox" id="featured" defaultChecked={book?.featured ?? false} className="w-4 h-4 accent-brand-red" />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">Istaknuta knjiga</label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-brand-red text-white text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-70"
        >
          {isPending ? 'Snimanje...' : isEdit ? 'Spremi izmjene' : 'Dodaj knjigu'}
        </button>
        <a href="/admin/books" className="text-sm text-gray-500 hover:text-graphite transition-colors">Odustani</a>
      </div>
    </form>
  );
}
