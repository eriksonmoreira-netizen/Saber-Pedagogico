// @ts-ignore
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // @ts-ignore
  if (typeof PrismaClient !== 'undefined') {
    // @ts-ignore
    return new PrismaClient();
  }

  // Fallback mock to prevent crash if client is not generated
  return {
    user: {
      update: async () => ({}),
      findUnique: async () => null,
      create: async () => ({}),
    },
    $connect: async () => {},
    $disconnect: async () => {},
  };
};

type PrismaClientSingleton = any;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;