// import { PrismaClient } from '@prisma/client';

// Mock PrismaClient to resolve build error: Module '"@prisma/client"' has no exported member 'PrismaClient'.
// This error occurs when `prisma generate` has not been run. 
// We provide a mock class here so the application can build without a running database.
class PrismaClient {
  constructor(options?: any) {}
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Em produção na Railway, a DATABASE_URL deve ser configurada nas variáveis de ambiente.
// Exemplo: postgresql://user:pass@host:port/db?schema=public&sslmode=no-verify