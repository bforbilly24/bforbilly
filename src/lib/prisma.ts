import { PrismaClient } from '@prisma/client'
import { ENV } from '@/types/environment'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with error handling
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: ENV.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (ENV.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
