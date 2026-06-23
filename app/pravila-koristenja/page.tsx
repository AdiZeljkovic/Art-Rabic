import Link from 'next/link';

export const metadata = {
  title: 'Pravila korištenja | Art Rabic',
  description: 'Pravila korištenja i politika privatnosti web stranice Art Rabic.',
};

export default function PravilaKoristenjaPage() {
  return (
    <div className="bg-white min-h-screen pt-24">
      <section className="bg-[url('/hero-kontakt.png')] bg-cover bg-center py-14 sm:py-20 md:py-28 text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-16 h-1 bg-brand-red mx-auto mb-8"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-graphite mb-6">Pravila korištenja</h1>
          <p className="text-lg text-graphite/70 font-light">Politika privatnosti i uslovi korištenja stranice.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-10">

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">1. Korištenje stranice</h2>
          <p className="text-muted leading-relaxed">
            Korištenjem web stranice mikulicknjige.com pristajete na ova pravila. Stranica je namijenjena informisanju posjetilaca o izdanjima i aktivnostima izdavačke kuće Art Rabic te omogućavanju narudžbi knjiga.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">2. Prikupljanje podataka</h2>
          <p className="text-muted leading-relaxed">
            Putem stranice prikupljamo samo podatke koje nam dobrovoljno dostavite – ime, prezime, email adresu, broj telefona i adresu za dostavu. Ovi podaci koriste se isključivo za obradu narudžbi i komunikaciju s kupcima.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">3. Newsletter</h2>
          <p className="text-muted leading-relaxed">
            Ukoliko se pretplatite na naš newsletter, vaša email adresa bit će korištena za slanje obavijesti o novim izdanjima i promocijama. Pretplatu možete otkazati u svakom trenutku klikom na link za odjavu u svakom emailu.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">4. Zaštita podataka</h2>
          <p className="text-muted leading-relaxed">
            Art Rabic se obavezuje da neće prodavati, iznajmljivati niti dijeliti vaše osobne podatke s trećim stranama, osim u slučajevima koji su neophodni za realizaciju narudžbe (npr. kurirska služba). Podaci se čuvaju u sigurnom okruženju u skladu s važećim propisima.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">5. Autorska prava</h2>
          <p className="text-muted leading-relaxed">
            Sav sadržaj na ovoj stranici – tekstovi, slike, logotip i dizajn – vlasništvo je izdavačke kuće Art Rabic i zaštićen je autorskim pravima. Nije dozvoljeno kopiranje, reproduciranje ni distribucija sadržaja bez pismene dozvole.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">6. Izmjene pravila</h2>
          <p className="text-muted leading-relaxed">
            Art Rabic zadržava pravo izmjene ovih pravila u bilo koje vrijeme. Izmjene stupaju na snagu objavom na stranici. Preporučujemo povremenu provjeru ove stranice.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-graphite mb-4">7. Kontakt</h2>
          <p className="text-muted leading-relaxed">
            Za sva pitanja vezana za zaštitu vaših podataka ili korištenje stranice, obratite nam se putem <Link href="/kontakt" className="text-brand-red hover:underline">kontakt obrasca</Link>.
          </p>
        </div>

        <div className="pt-4 border-t border-border-fine">
          <p className="text-sm text-muted">Datum posljednje izmjene: juni 2024.</p>
        </div>

      </section>
    </div>
  );
}
