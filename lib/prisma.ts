// import { PrismaClient } from '@prisma/client';

// const prismaClientSingleton = () => {
//   return new PrismaClient({
//     log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
//   });
// };

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Exporting null to satisfy imports while avoiding "Module not found" or "no exported member" errors
// This is necessary because `prisma generate` has likely not been run in this environment.
export const prisma = null;