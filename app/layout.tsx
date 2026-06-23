import type {Metadata} from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { headers } from 'next/headers';

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

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="bs">
      <body className={`${playfair.variable} ${inter.variable} flex flex-col min-h-screen`} suppressHydrationWarning>
        {!isAdmin && <Header />}
        <main className={isAdmin ? '' : 'flex-1'}>
          {children}
        </main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
