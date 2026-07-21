import type {Metadata} from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mikulicknjige.com'),
  title: {
    default: 'Art Rabic | Izdavačka kuća',
    template: '%s | Art Rabic',
  },
  description: 'Art Rabic je izdavačka kuća posvećena kvalitetnim izdanjima koja čuvaju kulturno nasljeđe Bosne i Hercegovine.',
  openGraph: {
    type: 'website',
    locale: 'bs_BA',
    siteName: 'Art Rabic',
    title: 'Art Rabic | Izdavačka kuća',
    description: 'Art Rabic je izdavačka kuća posvećena kvalitetnim izdanjima koja čuvaju kulturno nasljeđe Bosne i Hercegovine.',
    images: [{ url: '/main-logo.png', width: 400, height: 160, alt: 'Art Rabic' }],
  },
  twitter: {
    card: 'summary',
    title: 'Art Rabic | Izdavačka kuća',
    description: 'Art Rabic je izdavačka kuća posvećena kvalitetnim izdanjima koja čuvaju kulturno nasljeđe BiH.',
  },
};

// Root layout namjerno NE poziva headers() — taj poziv forsira dinamički
// rendering cijelog stabla ruta i poništava `revalidate` na svim stranicama.
// Header/Footer se sada renderuju u app/(site)/layout.tsx.
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="bs">
      <body className={`${playfair.variable} ${inter.variable} flex flex-col min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
