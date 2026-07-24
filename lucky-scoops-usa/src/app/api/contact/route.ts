import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact form endpoint. Swap the console.log for your ticketing/email
// integration (Resend, SendGrid, Zendesk, etc.).
export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim().slice(0, 100);
  const email = String(body.email ?? '').trim().toLowerCase();
  const message = String(body.message ?? '').trim().slice(0, 2000);

  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please fill out all fields.' }, { status: 400 });
  }

  console.log(`Contact form: ${name} <${email}> — ${String(body.subject ?? '')}`);
  return NextResponse.json({ ok: true });
}
