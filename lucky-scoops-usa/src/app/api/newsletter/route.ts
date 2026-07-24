import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Newsletter signup endpoint. Swap the console.log for your email service
// provider (Mailchimp, Klaviyo, Resend audiences, etc.) — keep provider API
// keys in environment variables, never in code.
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  console.log(`Newsletter signup: ${email}`);
  return NextResponse.json({ ok: true });
}
