import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

// Prevent multiple Prisma Client instances during Next.js hot reload in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL || (process.env.DATABASE_URL?.startsWith('libsql:') || process.env.DATABASE_URL?.startsWith('https:') ? process.env.DATABASE_URL : undefined);
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  if (process.env.NODE_ENV === 'production' && !tursoUrl) {
    console.warn('Warning: TURSO_DATABASE_URL or DATABASE_URL is not set. Serverless SQLite fallback might fail on Vercel.');
  }

  const adapter = new PrismaLibSql({
    url: tursoUrl || `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`,
    authToken: tursoUrl ? authToken : undefined,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
