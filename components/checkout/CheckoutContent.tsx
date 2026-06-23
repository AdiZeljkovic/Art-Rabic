'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { BookUI } from '@/lib/format';

export default function CheckoutContent({ book }: { book: BookUI }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const priceNum = parseFloat(book.price.replace(',', '.').replace(' KM', ''));
  const total = (priceNum + 7).toFixed(2).replace('.', ',') + ' KM';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const data = {
      bookId: book.id,
      firstName: (form.querySelector('#firstName') as HTMLInputElement).value,
      lastName: (form.querySelector('#lastName') as HTMLInputElement).value,
      email: (form.querySelector('#email') as HTMLInputElement).value,
      phone: (form.querySelector('#phone') as HTMLInputElement).value,
      address: (form.querySelector('#address') as HTMLInputElement).value,
      city: (form.querySelector('#city') as HTMLInputElement).value,
      zip: (form.querySelector('#zip') as HTMLInputElement).value,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Greška pri slanju narudžbe');
      setIsSuccess(true);
    } catch {
      setError('Došlo je do greške. Molimo pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle2 className="w-20 h-20 text-brand-red mx-auto mb-8" strokeWidth={1} />
          <h1 className="text-4xl md:text-5xl font-serif text-graphite mb-6">Uspješna narudžba</h1>
          <p className="text-lg text-muted mb-12">
            Zahvaljujemo na povjerenju. Vaša narudžba za knjigu <strong>{book.title}</strong> je uspješno zaprimljena.
            Potvrdu ste dobili na e-mail. Kontaktirat ćemo vas u roku od 24 sata.
          </p>
          <Link
            href="/knjige"
            className="inline-flex items-center justify-center px-10 py-4 text-xs font-bold tracking-widest uppercase bg-graphite text-white hover:bg-black transition-colors"
          >
            Nazad na katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="bg-ivory border-b border-border-fine py-4 px-6 relative z-10 mb-12">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link
            href={`/knjige/${book.id}`}
            className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Nazad na knjigu
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">

          {/* Order Summary */}
          <div className="md:col-span-5 md:order-last">
            <div className="bg-ivory p-8 border border-border-fine sticky top-32">
              <h2 className="text-sm font-bold tracking-widest uppercase text-graphite mb-8">Vaša narudžba</h2>

              <div className="flex gap-6 mb-8 pb-8 border-b border-border-fine">
                <div className="w-24 h-36 relative flex-shrink-0 border border-border-fine overflow-hidden">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-graphite mb-1">{book.title}</h3>
                  <p className="text-sm text-muted mb-4">{book.author}</p>
                  <p className="text-xl font-serif text-graphite">{book.price}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between text-muted">
                  <span>Iznos knjige</span>
                  <span>{book.price}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Dostava</span>
                  <span>7,00 KM</span>
                </div>
              </div>

              <div className="flex justify-between font-serif text-2xl text-graphite pt-6 border-t border-border-fine">
                <span>Ukupno</span>
                <span>{total}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="md:col-span-7">
            <h1 className="text-3xl md:text-4xl font-serif text-graphite mb-8">Podaci za dostavu</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-xs font-bold tracking-widest uppercase text-muted">Ime</label>
                  <input required type="text" id="firstName" className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-xs font-bold tracking-widest uppercase text-muted">Prezime</label>
                  <input required type="text" id="lastName" className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold tracking-widest uppercase text-muted">E-mail adresa</label>
                <input required type="email" id="email" className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-xs font-bold tracking-widest uppercase text-muted">Broj telefona</label>
                <input required type="tel" id="phone" className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-xs font-bold tracking-widest uppercase text-muted">Adresa</label>
                <input required type="text" id="address" className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-xs font-bold tracking-widest uppercase text-muted">Grad</label>
                  <input required type="text" id="city" className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="zip" className="block text-xs font-bold tracking-widest uppercase text-muted">Poštanski broj</label>
                  <input required type="text" id="zip" className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors" />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-10 py-5 text-xs font-bold tracking-widest uppercase transition-all bg-brand-red text-white hover:bg-[#8A1612] disabled:opacity-70"
                >
                  {isSubmitting ? 'Obrada...' : 'Potvrdi narudžbu'}
                </button>
                <p className="text-center text-xs text-muted mt-4">
                  Plaćanje se vrši pouzećem prilikom preuzimanja pošiljke.
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
