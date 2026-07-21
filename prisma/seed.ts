import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

const categoriesData = [
  { slug: 'sarajevo', title: 'Sarajevo', description: 'Knjige posvećene Sarajevu i njegovim pričama.' },
  { slug: 'historija', title: 'Historija', description: 'Historija Bosne i Hercegovine i šireg regiona.' },
  { slug: 'kultura', title: 'Kultura', description: 'Kultura, tradicija, identitet i savremeni zapisi.' },
  { slug: 'monografije', title: 'Monografije', description: 'Monografije, studije i knjige trajne vrijednosti.' },
  { slug: 'eseji', title: 'Eseji', description: 'Eseji, promišljanja i autorske analize društva i vremena.' },
  { slug: 'umjetnost', title: 'Umjetnost', description: 'Umjetnost, arhitektura, dizajn, fotografija i vizuelna kultura.' },
]

const booksRaw = [
  {
    title: 'Sarajevska hagada',
    author: 'Muhamed Enveri',
    categorySlug: 'historija',
    price: 18.00,
    imageUrl: 'https://picsum.photos/seed/hagada/400/600',
    description: 'Jedno od najznačajnijih izdanja koje svjedoči o bogatoj historiji i kulturi na ovim prostorima. Faksimilno izdanje Sarajevske Hagade na koje smo iznimno ponosni.',
    isbn: '978-9958-12-345-6',
    pages: 120,
    format: 'Tvrdi uvez',
    year: 2018,
    featured: false,
  },
  {
    title: 'Stećci – Memento',
    author: 'Ivan Lovrenović',
    categorySlug: 'monografije',
    price: 25.00,
    imageUrl: 'https://picsum.photos/seed/stecci/400/600',
    description: 'Reprezentativna monografija o bosanskohercegovačkim stećcima, srednjovjekovnim nadgrobnim spomenicima koji govore o jedinstvenom duhovnom i kulturnom naslijeđu.',
    isbn: '978-9958-23-456-7',
    pages: 256,
    format: 'Tvrdi uvez',
    year: 2020,
    featured: false,
  },
  {
    title: 'Sarajevo atentat – 100 godina poslije',
    author: 'Hamidija Kreševljaković',
    categorySlug: 'sarajevo',
    price: 48.00,
    imageUrl: 'https://picsum.photos/seed/atentat/400/600',
    description: 'Sveobuhvatan historijski osvrt na događaj koji je promijenio tok svjetske historije. Kroz do sada neobjavljene dokumente, svjedočenja i analize.',
    isbn: '978-9958-34-567-8',
    pages: 340,
    format: 'Tvrdi uvez',
    year: 2014,
    featured: false,
  },
  {
    title: 'Olimpijsko Sarajevo razbibrige – monografija',
    author: 'Midhat Goćo',
    categorySlug: 'monografije',
    price: 60.00,
    imageUrl: 'https://picsum.photos/seed/olimp/400/600',
    description: 'Knjiga posvećena sarajevskoj Olimpijadi \'84, vremenu prosperiteta, entuzijazma i zajedništva.',
    isbn: '978-9958-45-678-9',
    pages: 412,
    format: 'Tvrdi uvez',
    year: 2019,
    featured: false,
  },
  {
    title: 'Duhovnost',
    author: 'Alija Izetbegović',
    categorySlug: 'eseji',
    price: 20.00,
    imageUrl: 'https://picsum.photos/seed/duhovnost/400/600',
    description: 'Zbirka odabranih eseja koji zadiru duboko u pitanja identiteta, etike i ljudskog postojanja.',
    isbn: '978-9958-56-789-0',
    pages: 198,
    format: 'Meki uvez',
    year: 2021,
    featured: false,
  },
  {
    title: 'Sarajevo, moj grad',
    author: 'Izet Sarajlić',
    categorySlug: 'sarajevo',
    price: 15.00,
    imageUrl: 'https://picsum.photos/seed/mojgrad/400/600',
    description: 'Poetsko-prozni zapisi istaknutog bh. pjesnika koji s mnogo ljubavi, nostalgije i kritičkog osvrta piše o svom gradu.',
    isbn: '978-9958-67-890-1',
    pages: 140,
    format: 'Meki uvez',
    year: 2022,
    featured: true,
  },
  {
    title: 'Historijski zapisi',
    author: 'Dubravko Lovrenović',
    categorySlug: 'historija',
    price: 35.00,
    imageUrl: 'https://picsum.photos/seed/zapisi/400/600',
    description: 'Kapitalno djelo koje se bavi srednjovjekovnom Bosnom, njenim vladarima, kulturom i specifičnim crkvenim prilikama.',
    isbn: '978-9958-78-901-2',
    pages: 310,
    format: 'Tvrdi uvez',
    year: 2017,
    featured: false,
  },
  {
    title: 'Vodič kroz savremenu umjetnost',
    author: 'Grupa autora',
    categorySlug: 'umjetnost',
    price: 45.00,
    imageUrl: 'https://picsum.photos/seed/umjetnost/400/600',
    description: 'Pregled najznačajnijih pravaca, autora i djela savremene umjetnosti u Bosni i Hercegovini.',
    isbn: '978-9958-89-012-3',
    pages: 280,
    format: 'Tvrdi uvez',
    year: 2023,
    featured: false,
  },
]

async function main() {
  console.log('Kreiranje kategorija...')
  const categoryMap: Record<string, number> = {}
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categoryMap[cat.slug] = record.id
  }

  console.log('Kreiranje knjiga...')
  for (const book of booksRaw) {
    const { categorySlug, ...bookData } = book
    await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {},
      create: {
        ...bookData,
        categoryId: categoryMap[categorySlug],
      },
    })
  }

  console.log('Kreiranje admin korisnika...')
  const password = process.env.ADMIN_PASSWORD
  if (!password || password.length < 16) {
    throw new Error(
      'ADMIN_PASSWORD nije postavljen ili je kraći od 16 znakova. ' +
      'Seed odbija kreirati admin nalog sa slabom lozinkom.'
    )
  }
  const username = process.env.ADMIN_USERNAME || 'admin'
  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.adminUser.upsert({
    where: { username },
    update: {},
    create: { username, passwordHash },
  })

  console.log('Seed završen!')
  console.log(`Admin korisnik "${username}" je kreiran. Lozinka je ona iz ADMIN_PASSWORD.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
