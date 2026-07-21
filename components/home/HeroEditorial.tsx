'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroEditorial() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-paper">
         <Image
            src="/hero-bg.webp"
            alt="Art Rabic Kompozicija"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_center] lg:object-right opacity-90"
         />
         {/* Subtle gradient overlay to ensure text readability on all screen sizes */}
         <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-transparent lg:w-2/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">

        {/* Text Content */}
        <div className="max-w-2xl flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-brand-red text-xs font-bold tracking-widest uppercase mb-6">
              Art Rabic Izdavačka Kuća
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-graphite mb-6 uppercase">
              SAMO DOBRE<br />KNJIGE
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-md mb-10 leading-relaxed">
              Art Rabic je ugledna izdavačka kuća koja se ističe svojim posvećenjem ljepoti pisane riječi. Naš osnovni cilj je otkrivanje, promocija i podsticanje književnosti koja ispunjava dušu i obogaćuje um. Ova izdavačka kuća je u srcu svog rada posvećena kvalitetnim knjigama koje čitaoce vode na putovanje kroz različite svjetove, misli i emocije.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/knjige" className="bg-brand-dark hover:bg-brand-red text-white px-8 py-3.5 text-sm font-medium tracking-wide transition-colors flex items-center gap-2">
                Naše knjige
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
