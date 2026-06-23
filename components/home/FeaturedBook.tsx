'use client';

import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight, BookOpen, Calendar, Layers, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { BookUI } from '@/lib/format';

export default function FeaturedBook({ book }: { book: BookUI | null }) {
  if (!book) return null;

  return (
    <section className="py-24 relative overflow-hidden flex items-center min-h-[80vh]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/featured-bg.png"
          alt="Featured Image Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper/95 via-paper/80 to-transparent lg:w-2/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center lg:order-1"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-red mb-4 block">
              Istaknuto izdanje
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-graphite mb-2 leading-[1.1]">
              {book.title}
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-muted font-serif italic mb-8">
              {book.author}
            </p>

            <p className="text-graphite/80 leading-relaxed max-w-lg mb-10">
              {book.description}
            </p>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 text-sm text-graphite font-medium">
              {book.pages && (
                <div className="flex flex-col gap-2 border-t border-border-fine pt-4">
                  <BookOpen className="w-5 h-5 text-brand-red" strokeWidth={1.5} />
                  <span>{book.pages} strana</span>
                </div>
              )}
              {book.year && (
                <div className="flex flex-col gap-2 border-t border-border-fine pt-4">
                  <Calendar className="w-5 h-5 text-brand-red" strokeWidth={1.5} />
                  <span>{book.year}.</span>
                </div>
              )}
              {book.format && (
                <div className="flex flex-col gap-2 border-t border-border-fine pt-4">
                  <Layers className="w-5 h-5 text-brand-red" strokeWidth={1.5} />
                  <span>{book.format}</span>
                </div>
              )}
              <div className="flex flex-col gap-2 border-t border-border-fine pt-4">
                <Globe className="w-5 h-5 text-brand-red" strokeWidth={1.5} />
                <span>Bosanski jezik</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-4">
              <span className="font-serif text-3xl font-bold text-brand-red">
                {book.price}
              </span>

              <div className="flex items-center gap-4">
                <Link
                  href={`/checkout/${book.id}`}
                  className="bg-brand-dark hover:bg-brand-red text-white px-8 py-3.5 text-sm font-medium tracking-wide transition-colors flex items-center justify-center gap-2 flex-grow sm:flex-grow-0"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Naruči
                </Link>
                <Link
                  href={`/knjige/${book.id}`}
                  className="text-graphite hover:text-brand-red text-sm font-semibold transition-colors flex items-center gap-2 group whitespace-nowrap"
                >
                  Pročitaj više
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end lg:order-2 relative z-10"
          >
            <div className="relative z-10 aspect-[3/4] w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src={book.image}
                alt={book.title}
                fill
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 30vw"
                className="object-cover"
              />
              <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 md:-bottom-6 md:-left-6 md:right-auto lg:-left-8 w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 bg-brand-red rounded-full flex items-center justify-center text-white text-xs font-bold font-serif uppercase tracking-widest leading-tight text-center -rotate-12 shadow-lg border-2 border-paper z-20">
                Novo <br /> izdanje
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
