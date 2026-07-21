'use client';

import { MapPin, Phone, Mail, Send, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function ContactContent() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const data = {
      name: (form.querySelector('#ime') as HTMLInputElement).value,
      email: (form.querySelector('#email') as HTMLInputElement).value,
      subject: (form.querySelector('#naslov') as HTMLSelectElement).value,
      message: (form.querySelector('#poruka') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'Došlo je do greške. Molimo pokušajte ponovo.');
        return;
      }
      setIsSubmitted(true);
    } catch {
      setError('Došlo je do greške. Molimo pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Simple Clean Hero Section */}
      <section className="bg-graphite py-14 sm:py-20 md:py-28 text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-kontakt.png')] bg-cover bg-center"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-16 h-1 bg-brand-red mx-auto mb-8"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-graphite mb-6">
            Kontakt i podrška
          </h1>
          <p className="text-lg md:text-xl text-graphite/70 font-light leading-relaxed">
            Tu smo za vaša pitanja, narudžbe i prijedloge.
            Slobodno nam se obratite radnim danima.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <h2 className="text-3xl font-serif text-graphite mb-10 pb-4 border-b border-border-fine">Detalji kontakta</h2>

              <div className="space-y-10">
                <div className="group flex items-start gap-6">
                  <div className="p-4 bg-ivory rounded-sm border border-border-fine text-graphite group-hover:text-brand-red group-hover:border-brand-red/30 transition-colors">
                    <MapPin strokeWidth={1.5} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wider text-graphite uppercase mb-2">Glavno sjedište</h3>
                    <p className="text-muted leading-relaxed">
                      Zmaja od Bosne 4<br />
                      71000 Sarajevo,<br /> Bosna i Hercegovina
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-6">
                  <div className="p-4 bg-ivory rounded-sm border border-border-fine text-graphite group-hover:text-brand-red group-hover:border-brand-red/30 transition-colors">
                    <Phone strokeWidth={1.5} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wider text-graphite uppercase mb-2">Telefoni</h3>
                    <a href="tel:+38733123456" className="block text-muted hover:text-brand-red transition-colors leading-relaxed">
                      Centrala: +387 33 123 456
                    </a>
                    <a href="tel:+38761123456" className="block text-muted hover:text-brand-red transition-colors leading-relaxed">
                      Prodaja: +387 61 123 456
                    </a>
                  </div>
                </div>

                <div className="group flex items-start gap-6">
                  <div className="p-4 bg-ivory rounded-sm border border-border-fine text-graphite group-hover:text-brand-red group-hover:border-brand-red/30 transition-colors">
                    <Mail strokeWidth={1.5} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wider text-graphite uppercase mb-2">Elektronska pošta</h3>
                    <a href="mailto:info@artrabic.ba" className="block text-muted hover:text-brand-red transition-colors leading-relaxed">
                      info@artrabic.ba
                    </a>
                    <a href="mailto:prodaja@artrabic.ba" className="block text-muted hover:text-brand-red transition-colors leading-relaxed">
                      prodaja@artrabic.ba
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Zmaja+od+Bosne+4,+Sarajevo,+Bosnia+and+Herzegovina"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-video w-full bg-ivory border border-border-fine rounded-sm overflow-hidden relative flex items-center justify-center group hover:border-brand-red transition-colors"
            >
              <span className="bg-white px-6 py-3 border border-border-fine text-sm font-bold tracking-widest uppercase text-graphite group-hover:text-brand-red transition-colors shadow-sm">
                Prikaži na Google Maps →
              </span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 md:p-12 lg:p-14 border border-border-fine shadow-sm">
              <h2 className="text-2xl font-serif text-graphite mb-2">Pošaljite nam poruku</h2>
              <p className="text-muted mb-10 font-light">
                Popunite formu ispod i naši urednici će Vam se javiti u najkraćem roku.
              </p>

              {isSubmitted ? (
                <div className="bg-ivory border border-border-fine py-16 px-6 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-white border border-border-fine text-brand-red flex items-center justify-center rounded-full mx-auto mb-6 shadow-sm">
                    <Send className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl text-graphite mb-3">Zahvaljujemo se na poruci</h3>
                  <p className="text-muted max-w-md mx-auto">
                    Vaš upit je uspješno proslijeđen nadležnom odjelu. Očekujte naš odgovor ubrzo.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-sm font-bold tracking-widest uppercase text-brand-red hover:text-graphite transition-colors"
                  >
                    Pošalji novu poruku
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="ime" className="block text-xs font-bold tracking-widest uppercase text-graphite">Vaše ime <span className="text-brand-red">*</span></label>
                      <input
                        type="text"
                        id="ime"
                        required
                        className="w-full bg-transparent border-b border-border-fine py-3 text-graphite focus:outline-none focus:border-brand-red focus:ring-0 transition-colors placeholder:text-muted/50"
                        placeholder="Npr. Ivo Andrić"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-bold tracking-widest uppercase text-graphite">Email adresa <span className="text-brand-red">*</span></label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full bg-transparent border-b border-border-fine py-3 text-graphite focus:outline-none focus:border-brand-red focus:ring-0 transition-colors placeholder:text-muted/50"
                        placeholder="vasa.adresa@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="naslov" className="block text-xs font-bold tracking-widest uppercase text-graphite">Predmet <span className="text-brand-red">*</span></label>
                    <div className="relative">
                      <select
                        id="naslov"
                        required
                        defaultValue=""
                        className="w-full bg-transparent border-b border-border-fine py-3 text-graphite focus:outline-none focus:border-brand-red focus:ring-0 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-muted">Odaberite temu upita</option>
                        <option value="izdavastvo">Prijedlog za izdavanje</option>
                        <option value="prodaja">Pitanje o prodaji/distribuciji</option>
                        <option value="mediji">Upit za medije</option>
                        <option value="ostalo">Ostalo / Opšti upit</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="poruka" className="block text-xs font-bold tracking-widest uppercase text-graphite">Sadržaj poruke <span className="text-brand-red">*</span></label>
                    <textarea
                      id="poruka"
                      rows={6}
                      required
                      className="w-full bg-transparent border border-border-fine p-4 pb-0 text-graphite focus:outline-none focus:border-brand-red focus:ring-0 transition-colors resize-none mt-2 placeholder:text-muted/50"
                      placeholder="Upišite Vašu poruku ovdje..."
                    ></textarea>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="pt-4 flex items-center justify-between">
                    <p className="text-xs text-muted">
                      Slanjem poruke pristajete na našu politiku privatnosti.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group bg-graphite hover:bg-brand-red text-white py-4 px-8 font-medium tracking-wide flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-70"
                    >
                      <span>{isSubmitting ? 'Slanje...' : 'Pošalji poruku'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
