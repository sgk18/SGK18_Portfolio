import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', // Use your verified domain later
      to: ['suryachalam18@gmail.com'],
      subject: `New Message from ${name}`,
      replyTo: email,
      text: message,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
