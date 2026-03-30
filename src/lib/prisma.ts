import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaClient = globalForPrisma.prisma

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL nÃ£o configurada')
  }

  const adapter = new PrismaPg({ connectionString })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = createPrismaClient()

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaClient
    }
  }

  return prismaClient
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = Reflect.get(client, prop)

    return typeof value === 'function' ? value.bind(client) : value
  },
})
