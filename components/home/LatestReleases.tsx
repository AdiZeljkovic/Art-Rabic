'use client';

import { motion } from 'motion/react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { BookUI } from '@/lib/format';

export default function LatestReleases({ books }: { books: BookUI[] }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-graphite mb-4">
              Izdanja koja ostaju
            </h2>
            <p className="text-muted">
              Od historijskih monografija do savremenih zapisa, svaka knjiga nosi vlastiti trag.
            </p>
          </div>
          <Link href="/knjige" className="flex items-center gap-2 text-sm font-semibold text-graphite hover:text-brand-red transition-colors whitespace-nowrap">
            Pogledaj sve knjige
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col"
            >
              {/* Image Container */}
              <Link href={`/knjige/${book.id}`} className="relative aspect-[3/4] mb-6 bg-paper border border-border-fine overflow-hidden block">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
                />
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent mix-blend-multiply pointer-events-none" />
              </Link>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                {book.category && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2 block">
                    {book.category}
                  </span>
                )}
                <Link href={`/knjige/${book.id}`}>
                <h3 className="font-serif text-lg font-semibold text-graphite leading-tight mb-1 group-hover:text-brand-red transition-colors line-clamp-2">
                  {book.title}
                </h3>
                </Link>
                <p className="text-sm text-muted mb-4">{book.author}</p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-fine">
                  <span className="font-semibold text-brand-red">{book.price}</span>
                  <Link
                    href={`/knjige/${book.id}`}
                    className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-paper hover:bg-brand-red hover:text-white text-graphite transition-colors border border-border-fine hover:border-brand-red"
                    aria-label={`Pogledaj ${book.title}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
