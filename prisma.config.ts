import path from 'node:path';
import { defineConfig } from 'prisma/config';

const databaseUrl =
  process.env.TURSO_DATABASE_URL ||
  (process.env.DATABASE_URL?.startsWith('libsql:') || process.env.DATABASE_URL?.startsWith('https:')
    ? process.env.DATABASE_URL
    : undefined) ||
  `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: databaseUrl,
  },
});
