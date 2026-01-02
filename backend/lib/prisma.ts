let prisma: any;

try {
  // Dynamic import to handle cases where Prisma Client isn't generated yet
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined;
  };

  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
} catch {
  console.warn('⚠️  Prisma Client not generated. Run: npx prisma generate && npx prisma db push');
  prisma = null;
}

export { prisma };
