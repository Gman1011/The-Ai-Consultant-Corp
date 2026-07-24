import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import SocialLinks from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Lucky Scoops USA team.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="mt-10 text-center font-display text-4xl font-bold text-grape">
        We&apos;d Love to Hear From You! 💌
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-grape/80">
        Questions about an order, wholesale, or partnerships? Send us a note and our team will reply
        within 1 business day.
      </p>
      <div className="card mt-8 p-8">
        <ContactForm />
      </div>
      <div className="mt-8 flex flex-col items-center gap-3 pb-4 text-center">
        <p className="text-sm text-grape/70">
          Or email us directly:{' '}
          <a href="mailto:hello@luckyscoopsusa.com" className="font-bold text-blush-500 hover:underline">
            hello@luckyscoopsusa.com
          </a>
        </p>
        <SocialLinks />
      </div>
    </div>
  );
}
