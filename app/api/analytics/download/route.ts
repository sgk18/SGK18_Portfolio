import { db } from '@/lib/db';

export async function POST() {
  try {
    await db.trackDownload();
    return Response.json({ success: true });
  } catch (err) {
    console.error('Download tracking error:', err);
    return Response.json({ error: 'Failed to track download.' }, { status: 500 });
  }
}
