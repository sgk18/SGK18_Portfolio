import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();
    if (!projectId) {
      return Response.json({ error: 'projectId required.' }, { status: 400 });
    }
    await db.trackProjectView(projectId);
    return Response.json({ success: true });
  } catch (err) {
    console.error('Project view tracking error:', err);
    return Response.json({ error: 'Failed to track project view.' }, { status: 500 });
  }
}
