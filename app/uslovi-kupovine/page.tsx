import Link from 'next/link';

export const metadata = {
  title: 'Uslovi kupovine | Art Rabic',
  description: 'Uslovi kupovine izdavačke kuće Art Rabic.',
};

export default function UsloviKupovinePage() {
  return (
    <div className="bg-white min-h-screen pt-24">
      <section className="bg-[url('/hero-kontakt.png')] bg-cover bg-center py-14 sm:py-20 md:py-28 text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-16 h-1 bg-brand-red mx-auto mb-8"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-graphite mb-6">Uslovi kupovine</h1>
          <p className="text-lg text-graphite/70 font-light">Molimo pročitajte uslove prije kupovine.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-10">

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">1. Opće odredbe</h2>
          <p className="text-muted leading-relaxed">
            Ovi uslovi kupovine primjenjuju se na sve narudžbe knjiga i publikacija putem web stranice izdavačke kuće Art Rabic. Korištenjem stranice i slanjem narudžbe, kupac prihvata navedene uslove u potpunosti.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">2. Narudžbe i potvrda</h2>
          <p className="text-muted leading-relaxed">
            Narudžba se smatra važećom nakon što kupac primi potvrdu putem emaila ili telefonskog poziva. Art Rabic zadržava pravo odbiti narudžbu u slučaju nedostupnosti naslova ili tehničke greške u prikazu cijena.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">3. Cijene</h2>
          <p className="text-muted leading-relaxed">
            Sve cijene su iskazane u konvertibilnim markama (KM) i uključuju PDV gdje je primjenjivo. Trošak dostave nije uključen u cijenu knjige i naplaćuje se posebno. Art Rabic zadržava pravo izmjene cijena bez prethodne najave.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">4. Plaćanje i dostava</h2>
          <p className="text-muted leading-relaxed">
            Plaćanje se vrši pouzećem pri preuzimanju pošiljke. Dostava se vrši na cijelom području Bosne i Hercegovine putem poštanskih i kurirskih službi. Rok dostave iznosi 2–4 radna dana od slanja pošiljke.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">5. Povrat robe</h2>
          <p className="text-muted leading-relaxed">
            Kupac ima pravo na povrat knjige isključivo u slučaju fizičkog oštećenja ili pogrešne isporuke, i to u roku od 3 dana od prijema. Knjige koje su otvorene ili korištene ne mogu se vratiti. Troškove povrata snosi Art Rabic ukoliko je reklamacija osnovana.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">6. Zaštita podataka</h2>
          <p className="text-muted leading-relaxed">
            Lični podaci kupca prikupljaju se isključivo u svrhu realizacije narudžbe i neće se dijeliti s trećim stranama. Više informacija dostupno je u našim <Link href="/pravila-koristenja" className="text-brand-red hover:underline">Pravilima korištenja</Link>.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">7. Nadležnost</h2>
          <p className="text-muted leading-relaxed">
            Na sve sporove koji mogu nastati iz kupoprodajnog odnosa primjenjuju se propisi Bosne i Hercegovine. Nadležan je sud u Sarajevu.
          </p>
        </div>

        <div className="pt-4 border-t border-border-fine">
          <p className="text-sm text-muted">Datum posljednje izmjene: juni 2024.</p>
        </div>

      </section>
    </div>
  );
}
