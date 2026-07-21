'use client';

import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PublisherStory() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[280px] sm:h-[320px] md:h-[380px] w-full rounded-md shadow-md overflow-hidden flex"
          >
            {/* Left Side: Bookshelf Image */}
            <div className="w-[35%] sm:w-[40%] relative">
               <Image
                  src="/hero-bg.webp"
                  alt="Biblioteka Art Rabic"
                  fill
                  sizes="(max-width: 640px) 35vw, 40vw"
                  className="object-cover object-right brightness-50"
                />
            </div>
            
            {/* Right Side: Logo & Text */}
            <div className="w-[65%] sm:w-[60%] bg-[#E0D0BB] relative flex flex-col items-center justify-center p-4 sm:p-8">
               {/* Very subtle paper grain overlay */}
               <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
               
               <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-[#4A3D39] mb-4" strokeWidth={1} />
               <div className="font-serif text-3xl md:text-5xl tracking-tight text-[#A91B24] leading-none mb-6 md:mb-8 flex items-center justify-center">
                 <span className="font-medium">art</span>
                 <span className="font-bold ml-1 md:ml-1.5">rabic</span>
               </div>
               <span className="uppercase text-[9px] md:text-[11px] tracking-[0.25em] md:tracking-[0.4em] text-[#5C524E] font-medium text-center">
                 Izdavaštvo s dušom
               </span>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-red mb-6 block">
              O Art Rabicu
            </span>
            
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-graphite mb-6 leading-tight max-w-lg">
              Izdavaštvo s dušom. <br />Knjige s razlogom.
            </h2>
            
            <p className="text-muted leading-relaxed max-w-lg mb-10">
              Art Rabic je izdavačka kuća posvećena kvalitetnim izdanjima koja obogaćuju um i duh. Naš cilj je očuvanje kulture, znanja i pisane riječi za buduće generacije. 
              Od pažljivog odabira autora do tipografskog perfekcionizma, svako naše izdanje je malo remek-djelo.
            </p>

            <Link href="/o-nama" className="text-graphite hover:text-brand-red text-sm font-semibold transition-colors flex items-center gap-2 group w-max border-b border-graphite hover:border-brand-red pb-1">
              Upoznajte izdavača
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
