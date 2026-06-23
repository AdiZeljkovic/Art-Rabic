'use client';

import { PenTool } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="w-full bg-brand-dark relative overflow-hidden flex items-center min-h-[300px]">
      {/* Background Texture/Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lines" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" className="text-white"/>
        </svg>
      </div>

      <div className="absolute left-0 lg:left-32 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <PenTool className="w-72 h-72 text-white transform -rotate-12" strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 xl:px-24 py-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-sans text-2xl sm:text-3xl md:text-[40px] text-white mb-2 md:mb-3 font-medium tracking-tight">
            Primajte izdavačke bilješke.
          </h2>
          <p className="text-white/80 text-sm md:text-base font-normal">
            Nove knjige, posebna izdanja i preporuke direktno u vaš inbox.
          </p>
        </div>

        <div className="w-full md:w-auto flex-1 max-w-xl md:max-w-none">
          {status === 'success' ? (
            <p className="text-white font-medium text-center md:text-left">
              Hvala! Uspješno ste se prijavili na newsletter.
            </p>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-0" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Vaša e-mail adresa"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-grow bg-transparent border border-white/20 text-white placeholder-white/50 px-6 py-4 focus:outline-none focus:border-white/50 transition-colors min-h-[48px]"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-paper text-brand-dark hover:bg-white px-8 py-4 font-medium text-sm transition-colors whitespace-nowrap sm:ml-4 disabled:opacity-70 min-h-[48px]"
              >
                {status === 'loading' ? 'Slanje...' : 'Prijavi se'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-red-300 text-sm mt-2">Greška pri prijavi. Pokušajte ponovo.</p>
          )}
        </div>

      </div>
    </section>
  );
}
