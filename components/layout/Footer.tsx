import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-paper border-t border-border-fine pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex mb-6 group">
              <Image
                src="/main-logo.png"
                alt="Art Rabic"
                width={110}
                height={44}
                className="h-11 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-muted max-w-sm leading-relaxed">
              Po mišljenju struke i široke čitalačke publike, Goran Mikulić vlasnik izdavačke kuće Art Rabic, zaslužuje epitet iznimno cijenjenog izdavača. Posebna vrijednost je u tome što je u 28 godina postojanja na najbolji način afirmirao kulturno nasljeđe BiH i njenog glavnog grada.
            </p>
          </div>

          {/* Menu Col */}
          <div>
            <h4 className="font-bold text-graphite mb-5 text-sm">Meni</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Početna', href: '/' },
                { label: 'O nama', href: '/o-nama' },
                { label: 'Naše knjige', href: '/knjige' },
                { label: 'Kontakt', href: '/kontakt' }
              ].map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-muted hover:text-brand-red transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Information/Legal Col */}
          <div>
            <h4 className="font-bold text-graphite mb-5 text-sm">Informacije</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'O kupovini', href: '/o-kupovini' },
                { label: 'Uslovi kupovine', href: '/uslovi-kupovine' },
                { label: 'Pravila korištenja', href: '/pravila-koristenja' },
              ].map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-muted hover:text-brand-red transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-fine flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} Art Rabic. Sva prava zadržana.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-brand-red">♥</span> by <a href="https://luminor.solutions" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">Luminor.solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
