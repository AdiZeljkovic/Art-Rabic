import { PrismaClient } from '@/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

function createPrisma() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL nije postavljen')

  const parsed = new URL(url)

  // Bez eksplicitnog pool-a mariadb driver drži 10 TRAJNO otvorenih konekcija
  // (connectionLimit i minimumIdle su oba 10 po defaultu). Na dijeljenom serveru
  // sa više aplikacija to brzo pojede MariaDB `max_connections` (default 151).
  // Ova app ima par upita po stranici — 5 je više nego dovoljno.
  const adapter = new PrismaMariaDb({
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    connectionLimit: 5,
    minimumIdle: 1,
    idleTimeout: 60,
    acquireTimeout: 10_000,
  })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? createPrisma()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
