import Image from 'next/image';
import { BookOpen, Award, Globe, Heart } from 'lucide-react';

export default function AboutContent() {
  return (
    <div className="bg-paper min-h-screen pt-24 pb-16">
      
      {/* 1. Header / Intro & Biography */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-24 items-start">
          
          <div className="lg:col-span-5">
            <div className="relative z-10 aspect-[3/4] w-full max-w-md mx-auto shadow-2xl">
              <Image
                src="/goran.webp"
                alt="Goran Mikulić"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-dark rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold font-serif uppercase tracking-widest leading-none text-center rotate-12 shadow-lg border-4 border-paper z-20 p-4">
                <span>Osnivač</span>
                <span className="mt-1 pb-1 border-b border-brand-red">Direktor</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-brand-red text-xs font-bold tracking-widest uppercase mb-4 block">
              Naša priča
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-graphite mb-8">
              Izdavaštvo posvećeno kulturi i sjećanju.
            </h1>
            
            <div className="space-y-6 text-muted leading-relaxed">
              <p>
                <strong>Goran Mikulić</strong> rođen je u Sarajevu 16.10.1949. godine od oca Maria i majke Nade. 
                Osnovnu i srednju školu, gimnaziju, završio 1968. godine u rodnom gradu. Građevinski fakultet 
                završio u Sarajevu 1975. godine.
              </p>
              
              <div className="pl-6 border-l-2 border-brand-red space-y-4 my-8">
                <div>
                  <span className="font-bold text-graphite">1991.</span> 
                  <span className="ml-2">Osniva privatno građevinsko preduzeće „Rabic“. Dobrovoljno pristupa 06.04.1992. godine odbrambenim snagama grada Sarajeva i do konačnog oslobođenja učestvuje u odbrani grada i države. 1993. godine biva teško ranjen.</span>
                </div>
                <div>
                  <span className="font-bold text-graphite">1994.</span> 
                  <span className="ml-2">Osniva novinsko-izdavačku kuću „Sezam“ u saradnji sa dva ortaka, Mesud Malkoč i Emir Vučijak.</span>
                </div>
                <div>
                  <span className="font-bold text-graphite">1995.</span> 
                  <span className="ml-2">Pokreće izdavaštvo pod nazivom „Rabic“, biblioteka CIVIS u okviru koje knjiga prvijenac Izeta Sarajlića „Knjiga oproštaja“ doživljava tri izdanja, prevedena na 13 jezika i objavljana u 53 zemlje svijeta.</span>
                </div>
                <div>
                  <span className="font-bold text-graphite">2016.</span> 
                  <span className="ml-2">Izdavačka kuća dobija novo ime, „Art Rabic“.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Banner Section */}
      <section className="bg-brand-dark py-20 px-6 my-12 relative overflow-hidden">
        {/* Simple pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lines_banner" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lines_banner)" className="text-white"/>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Award className="w-12 h-12 text-brand-red mx-auto mb-6" strokeWidth={1} />
          <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed text-white">
            Po mišljenju struke i široke čitalačke publike, Goran Mikulić vlasnik izdavačke kuće Art Rabic, zaslužuje epitet iznimno cijenjenog izdavača. Posebna vrijednost je u tome što je u 28 godina postojanja na najbolji način afirmirao kulturno nasljeđe BiH i njenog glavnog grada.
          </p>
        </div>
      </section>

      {/* 3. Legacy and Acclaim */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 item-start">
          <div className="prose prose-lg prose-headings:font-serif prose-headings:text-graphite prose-p:text-muted">
            <h3 className="text-2xl font-bold mb-4">Reprezentativna Izdanja</h3>
            <p>
              Najmonumentalnije je faksimilno izdanje čuvene <strong>„Sarajevske Hagade“</strong>, koja je ne samo vrhunski izdavački projekt, prepoznat i nagrađivan od struke na svjetskim sajmovima knjiga, nego je promocijama u svjetskim kulturnim metropolama podigla ugled naše sredine u svijetu.
            </p>
            <p>
              Tu su i druge fotomonografije među kojima i <strong>„Stećci“</strong> na našem i engleskom jeziku zahvaljujući kojoj BiH zajedno s tri druge susjedne države kandidira za UNESCO-vu listu zaštićenih spomenika. I ta je fotomonogorafija prezentirana u desetak najvažnijih centara u regiji i Europi.
            </p>
            <p>
              Uz fotomonografiju <strong>„Fojnički grbovnik“</strong> Rabic je objavio i monografije: „Sarajevo“, „Staro Sarajevo“, „Arhitektura starih palača“, „Mario Mikulić – crteži“, „Zbogom Bosno, odoh u Sarajevo“, „Sevdalinka – alhemija duše“, te „Sarajevo atentat 100 godina poslije“.
            </p>
            <p>
              Posebno mjesto zaslužuje knjiga <strong>„Sarajevo, moj grad“</strong>, edicija od 10 knjiga. I u drugim bibliotekama ogledali su se mnogi eminentni autori (Izet Sarajlić, Tin Ujević, Ivan Lovrenović, fra Petar Anđelović, Dubravko Lovrenović i mnogi drugi).
            </p>
          </div>

          <div className="bg-ivory p-8 md:p-12 border border-border-fine rounded-sm shadow-sm">
            <BookOpen className="w-8 h-8 text-brand-red mb-6" />
            <h3 className="font-serif text-2xl font-bold text-graphite mb-4">Analitičko-kritička misao</h3>
            <p className="text-muted mb-6 leading-relaxed">
              Govoriti o Rabicu, znači govoriti o nekome ko je pomodno-vašarsku pompu idejno-puzećeg izdavaštva, podredio ozbiljnosti i trezvenosti javnog djelovanja. 
            </p>
            <p className="text-muted mb-6 leading-relaxed">
              Riječ je o izdavačkoj kući koja je logiku tiražnog klero-etničkog hajkanja zamijenila ozbiljnom analitičko-kritičkom riječju svojih autora. Riječju onih koji se, držeći do najviših civilizacijskih vrijednosti, ne libe javno izgovoriti ili napisati da su dva i dva – četiri.
            </p>
            <div className="mt-8 pt-8 border-t border-border-fine">
              <span className="text-brand-red font-bold uppercase tracking-widest text-xs mb-2 block">Smeđa biblioteka</span>
              <p className="font-serif text-graphite text-lg italic">
                &quot;Jedna od najhrabrijih edicija u regionu, za koju se zna i van granica bivše Jugoslavije.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Events & Trophies */}
      <section className="bg-white py-20 border-y border-border-fine mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-graphite mb-4">Posebni događaji i priznanja</h2>
            <p className="text-muted">
              U profesionalno poslovični specifikum Rabica spadaju posebne, kontekstualno, tematsko-scenski aranžirane promocije, često prave kulturno-umjetničke svečanosti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-border-fine flex flex-col items-center text-center hover:border-brand-red/50 transition-colors">
              <Heart className="w-8 h-8 text-brand-red mb-4" strokeWidth={1.5} />
              <h4 className="font-bold text-graphite mb-3">Svečane Promocije</h4>
              <p className="text-sm text-muted">
                Baletne predstave, koncerti (Jovan Kolundžija, Arsen Dedić), gudački kvarteti i spletovi narodnih igara kao prateći dio književnih događaja.
              </p>
            </div>
            
            <div className="p-8 border border-border-fine flex flex-col items-center text-center hover:border-brand-red/50 transition-colors">
              <Award className="w-8 h-8 text-brand-red mb-4" strokeWidth={1.5} />
              <h4 className="font-bold text-graphite mb-3">Međunarodne Nagrade</h4>
              <p className="text-sm text-muted">
                &quot;Sarajevska Hagada&quot; osvaja specijalna priznanja na sajmovima. Monografija &quot;Sarajevo&quot; osvaja prve nagrade za najljepšu knjigu i fotografiju u Beogradu.
              </p>
            </div>

            <div className="p-8 border border-border-fine flex flex-col items-center text-center hover:border-brand-red/50 transition-colors">
              <Globe className="w-8 h-8 text-brand-red mb-4" strokeWidth={1.5} />
              <h4 className="font-bold text-graphite mb-3">Globalni Doseg</h4>
              <p className="text-sm text-muted">
                Preko 370 naslova, ugovor sa parištom kućom „Flammarion“ i prezentacije izdanja širom Europe, od Londona i Washingtona do Madrida i Osla. 
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-px bg-brand-red mx-auto mb-8"></div>
            <p className="text-lg text-graphite font-medium">
              Težnje, planovi i ambicije IK «Art Rabic» i njenog vlasnika, Gorana Mikulića, su da nastavi i dalje sa novim uspjesima i dostignućima u branši.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
