import type { Metadata } from 'next';
import HeroEditorial from '@/components/home/HeroEditorial';

export const metadata: Metadata = {
  title: 'Art Rabic | Izdavačka kuća Sarajevo',
  description: 'Art Rabic – izdavačka kuća Gorana Mikulića. 28 godina afirmacije kulturnog nasljeđa BiH kroz kvalitetna izdanja, monografije i knjige.',
  openGraph: {
    title: 'Art Rabic | Izdavačka kuća Sarajevo',
    description: 'Art Rabic – 28 godina afirmacije kulturnog nasljeđa BiH kroz kvalitetna izdanja i monografije.',
  },
};
import LatestReleases from '@/components/home/LatestReleases';
import FeaturedBook from '@/components/home/FeaturedBook';
import BenefitsBar from '@/components/home/BenefitsBar';
import PublisherStory from '@/components/home/PublisherStory';
import Newsletter from '@/components/home/Newsletter';
import { prisma } from '@/lib/prisma';
import { bookToUI } from '@/lib/format';

export const revalidate = 3600;

export default async function Home() {
  const [allBooks, featuredBook] = await Promise.all([
    prisma.book.findMany({
      where: { inStock: true },
      select: {
        id: true, title: true, author: true, price: true, imageUrl: true,
        category: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.book.findFirst({
      where: { featured: true },
      select: {
        id: true, title: true, author: true, price: true, imageUrl: true,
        description: true, isbn: true, pages: true, format: true, year: true,
        category: { select: { title: true } },
      },
    }),
  ]);

  const books = allBooks.map(bookToUI);
  const featured = featuredBook ? bookToUI(featuredBook) : null;

  return (
    <>
      <HeroEditorial />
      <LatestReleases books={books} />
      <FeaturedBook book={featured} />
      <BenefitsBar />
      <PublisherStory />
      <Newsletter />
    </>
  );
}
