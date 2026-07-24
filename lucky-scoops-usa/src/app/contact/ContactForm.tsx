'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('failed');
      form.reset();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <p role="status" className="text-center font-bold text-lavender-600">
        Message sent! We&apos;ll get back to you within 1 business day. 🎉
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="font-bold text-grape">Name</label>
          <input id="contact-name" name="name" required maxLength={100} autoComplete="name" className="input mt-1" />
        </div>
        <div>
          <label htmlFor="contact-email" className="font-bold text-grape">Email</label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" className="input mt-1" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="font-bold text-grape">Subject</label>
        <select id="contact-subject" name="subject" className="input mt-1">
          <option>Order question</option>
          <option>Returns</option>
          <option>Wholesale & partnerships</option>
          <option>Press</option>
          <option>Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="font-bold text-grape">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={2000}
          rows={5}
          className="input mt-1 rounded-3xl"
        />
      </div>
      {status === 'error' && (
        <p role="alert" className="text-sm font-semibold text-blush-600">
          Something went wrong — please try again or email hello@luckyscoopsusa.com.
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
