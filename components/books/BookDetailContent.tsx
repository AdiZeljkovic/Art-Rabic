import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CornerDownRight } from 'lucide-react';
import ShareButton from './ShareButton';

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string;
  image: string;
  description?: string;
  isbn?: string;
  pages?: number;
  format?: string;
  year?: number;
};

export default function BookDetailContent({ book }: { book: Book }) {

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Top utility bar */}
      <div className="bg-ivory border-b border-border-fine py-4 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/knjige" 
            className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Katalog
          </Link>
          <ShareButton title={book.title} author={book.author} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 xl:gap-32 items-start">
          
          {/* Spine / Image Column */}
          <div className="w-full lg:w-5/12 xl:w-1/2 lg:sticky lg:top-32 flex justify-center lg:justify-end">
            <div className="relative aspect-[2/3] w-full max-w-sm drop-shadow-2xl group">
              <div className="absolute inset-0 bg-white border border-border-fine rounded-r-md rounded-l-sm overflow-hidden z-10">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-[1px] bg-white/40 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent mix-blend-multiply opacity-50 pointer-events-none" />
              </div>
              {/* Pages edge effect under the book */}
              <div className="absolute top-2 -bottom-2 right-1 -left-2 bg-paper border border-border-fine rounded-r-md -z-10" />
              <div className="absolute top-4 -bottom-4 right-2 -left-4 bg-gray-50 border border-border-fine rounded-r-md -z-20" />
            </div>
          </div>
          
          {/* Editorial Content Column */}
          <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col pt-4 lg:pt-8">
            
            <div className="mb-10">
              {book.category && (
                <span className="inline-block border border-border-fine px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-brand-red mb-6">
                  {book.category}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-graphite mb-4 leading-[1.1] tracking-tight">
                {book.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted font-light italic">
                {book.author}
              </p>
            </div>
            
            <div className="mb-12">
              <div className="flex items-center gap-8 mb-6">
                <span className="text-2xl sm:text-3xl md:text-4xl font-serif text-graphite">{book.price}</span>
              </div>
              
              <Link 
                href={`/checkout/${book.id}`}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 text-xs font-bold tracking-widest uppercase transition-all bg-brand-red text-white hover:bg-white hover:text-brand-red border border-brand-red group"
              >
                Kupi knjigu
                <CornerDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              </Link>
            </div>

            {/* Description as an editorial quote/excerpt */}
            <div className="relative mb-16 pl-6 lg:pl-10">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-red opacity-30" />
              <h3 className="text-lg text-graphite font-serif font-medium mb-4">Sadržaj i osvrt</h3>
              <p className="text-muted text-lg leading-relaxed font-light">
                {book.description || 'Opis za ovu knjigu još uvijek nije dostupan.'}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
