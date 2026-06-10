import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Attempt a simple query
    const contactCount = await prisma.contact.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      contactCount,
      envState: {
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        hasTursoAuthToken: !!process.env.TURSO_AUTH_TOKEN,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDatabaseAuthToken: !!process.env.DATABASE_AUTH_TOKEN,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Database connection failed!",
      error: error.message || String(error),
      stack: error.stack,
      envState: {
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        hasTursoAuthToken: !!process.env.TURSO_AUTH_TOKEN,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDatabaseAuthToken: !!process.env.DATABASE_AUTH_TOKEN,
        nodeEnv: process.env.NODE_ENV,
        tursoUrlSnippet: process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.substring(0, 15) + "..." : undefined,
        databaseUrlSnippet: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + "..." : undefined,
      }
    }, { status: 500 });
  }
}
