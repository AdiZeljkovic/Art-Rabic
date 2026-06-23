'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const username = (form.querySelector('#username') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Pogrešno korisničko ime ili lozinka');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Greška pri prijavi. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-graphite mb-1">Art Rabic</h1>
          <p className="text-sm text-muted tracking-widest uppercase">Admin Panel</p>
        </div>

        <div className="bg-white border border-border-fine p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xs font-bold tracking-widest uppercase text-graphite">
                Korisničko ime
              </label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors text-graphite"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold tracking-widest uppercase text-graphite">
                Lozinka
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-paper border border-border-fine focus:border-brand-red focus:outline-none transition-colors text-graphite"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-graphite hover:bg-brand-red text-white text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-70"
            >
              {loading ? 'Prijava...' : 'Prijavi se'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Art Rabic Izdavačka kuća &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
