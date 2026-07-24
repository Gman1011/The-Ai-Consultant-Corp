import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping methods, timelines, and costs for Lucky Scoops USA orders.',
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping"
      updated="July 2026"
      sections={[
        {
          heading: 'Where We Ship',
          body: ['We currently ship to all 50 U.S. states. International shipping is coming soon — join the newsletter to be the first to know!'],
        },
        {
          heading: 'Processing Time',
          body: ['Orders ship within 1–2 business days. During limited-edition drops, processing may take up to 4 business days.'],
        },
        {
          heading: 'Shipping Rates & Timelines',
          body: [
            'Standard (3–6 business days): $5.95, free on orders over $50.',
            'Expedited (2–3 business days): $12.95.',
            'Rates and options are calculated at checkout.',
          ],
        },
        {
          heading: 'Tracking',
          body: ['Every order receives a tracking number by email as soon as it ships.'],
        },
        {
          heading: 'Lost or Damaged Packages',
          body: ['If your package arrives damaged or goes missing, email hello@luckyscoopsusa.com within 14 days and we will make it right.'],
        },
      ]}
    />
  );
}
