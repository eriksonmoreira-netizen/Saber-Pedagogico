// import { PrismaClient } from '@prisma/client';

/**
 * Mocking PrismaClient because the client library is not generated in this environment.
 * Run `npx prisma generate` to generate the client and uncomment the import above.
 */
class PrismaClient {
  constructor(options?: any) {}
  $connect() { return Promise.resolve(); }
  $disconnect() { return Promise.resolve(); }
  [key: string]: any;
}

// Padrão Singleton para evitar múltiplas instâncias do Prisma Client no Hot Reload do Next.js
// Isso previne o erro "Too many connections" no banco de dados em desenvolvimento e produção.

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

/**
 * DICA DEVOPS:
 * Na Railway, certifique-se de que sua DATABASE_URL nas variáveis de ambiente inclua:
 * ?sslmode=no-verify  (ou require, dependendo da configuração do Postgres)
 * e ?connection_limit=5 (para pool connections em serverless)
 */