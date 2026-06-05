import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 1. Track the download in SQLite
    await db.trackDownload();

    // 2. Serve the resume.pdf file
    const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
    if (!fs.existsSync(filePath)) {
      return new Response('Resume file not found.', { status: 404 });
    }
    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Suryachalam_VM_Resume.pdf"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Download serving/tracking error:', err);
    return new Response('Failed to download resume.', { status: 500 });
  }
}

export async function POST() {
  try {
    await db.trackDownload();
    return Response.json({ success: true });
  } catch (err) {
    console.error('Download tracking error:', err);
    return Response.json({ error: 'Failed to track download.' }, { status: 500 });
  }
}
