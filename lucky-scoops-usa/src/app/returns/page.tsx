import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Our 30-day happiness guarantee — returns and refunds at Lucky Scoops USA.',
};

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Returns & Refunds"
      updated="July 2026"
      sections={[
        {
          heading: 'Our 30-Day Happiness Guarantee',
          body: [
            'If you are not smiling, we are not done. Unused items in original packaging can be returned within 30 days of delivery for a full refund.',
          ],
        },
        {
          heading: 'Mystery Items',
          body: [
            'Because the surprise is the product, opened mystery scoops and mystery boxes are not eligible for return — but if anything arrives damaged or incomplete, we will replace it free of charge.',
          ],
        },
        {
          heading: 'How to Start a Return',
          body: [
            'Email hello@luckyscoopsusa.com with your order number and the item(s) you would like to return. We will send a prepaid return label within 1 business day.',
          ],
        },
        {
          heading: 'Refund Timing',
          body: [
            'Refunds are issued to your original payment method within 5–7 business days of receiving your return.',
          ],
        },
      ]}
    />
  );
}
