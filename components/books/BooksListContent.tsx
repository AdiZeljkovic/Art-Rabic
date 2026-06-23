import Link from 'next/link';
import Image from 'next/image';
import type { BookUI } from '@/lib/format';

export default function BooksListContent({ books }: { books: BookUI[] }) {
  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Minimal Header */}
      <section className="bg-graphite py-14 sm:py-20 md:py-28 text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-kontakt.png')] bg-cover bg-center"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-16 h-1 bg-brand-red mx-auto mb-8"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-graphite mb-6">
            Naše knjige
          </h1>
          <p className="text-lg md:text-xl text-graphite/70 font-light leading-relaxed">
            Pregledajte sva izdanja izdavačke kuće Art Rabic.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
          {books.map((book) => (
            <div key={book.id} className="group flex flex-col">
              {/* Book Cover */}
              <Link href={`/knjige/${book.id}`} className="block relative aspect-[2/3] mb-6 drop-shadow-md group-hover:drop-shadow-xl transition-all duration-500 transform group-hover:-translate-y-2">
                <div className="absolute inset-0 bg-white border border-border-fine rounded-r-sm overflow-hidden">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                  {/* Spine subtle effect */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-white/30 pointer-events-none" />
                </div>
              </Link>

              {/* Book Info */}
              <div className="flex flex-col flex-grow px-1">
                <Link href={`/knjige/${book.id}`} className="block">
                  <h3 className="font-serif text-xl font-medium text-graphite leading-tight mb-2 group-hover:text-brand-red transition-colors">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted mb-5 tracking-wide">{book.author}</p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="font-serif text-lg text-graphite">{book.price}</span>
                  <Link
                    href={`/knjige/${book.id}`}
                    className="text-xs font-bold tracking-widest uppercase text-brand-red hover:text-white px-4 py-2 border border-brand-red hover:bg-brand-red transition-colors"
                    aria-label={`Kupi ${book.title}`}
                  >
                    Kupi
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border-fine bg-paper">
            <p className="text-xl text-muted font-serif">Trenutno nema dostupnih naslova u katalogu.</p>
          </div>
        )}
      </section>
    </div>
  );
}
