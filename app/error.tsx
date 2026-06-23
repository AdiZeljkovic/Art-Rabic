'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-8xl font-serif text-brand-red/20 mb-6 select-none">500</p>
        <h1 className="text-3xl md:text-4xl font-serif text-graphite mb-4">Nešto je pošlo po krivu</h1>
        <p className="text-muted mb-10">
          Došlo je do neočekivane greške. Pokušajte ponovo ili se vratite na početnu stranicu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold tracking-widest uppercase bg-brand-red text-white hover:bg-[#8A1612] transition-colors"
          >
            Pokušaj ponovo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold tracking-widest uppercase border border-graphite text-graphite hover:bg-graphite hover:text-white transition-colors"
          >
            Početna stranica
          </Link>
        </div>
      </div>
    </div>
  );
}
