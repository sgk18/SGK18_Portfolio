import { Resend } from 'resend';

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: 'Email service is not configured.' },
      { status: 500 }
    );
  }

  if (!name || !email || !message) {
    return Response.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', // Use your verified domain later
      to: ['suryachalam18@gmail.com'],
      subject: `New Message from ${name}`,
      replyTo: email,
      text: message,
    });

    return Response.json(data);
  } catch {
    return Response.json(
      { error: 'Failed to send email.' },
      { status: 500 }
    );
  }
}
