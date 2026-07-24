import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of the Lucky Scoops USA store.',
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 2026"
      sections={[
        {
          heading: '1. Overview',
          body: [
            'By using LuckyScoopsUSA.com you agree to these terms. The store is operated by Lucky Scoops USA ("we", "us"). If you do not agree, please do not use the site.',
          ],
        },
        {
          heading: '2. Orders & Payment',
          body: [
            'All prices are in U.S. dollars. Payment is processed securely by Stripe and supports Apple Pay, Google Pay, Visa, Mastercard, American Express, and debit cards. We may cancel and refund any order due to pricing errors or suspected fraud.',
          ],
        },
        {
          heading: '3. Mystery Products',
          body: [
            'Mystery scoops and boxes contain randomized items. Specific charms or figures are not guaranteed unless explicitly stated. That’s the fun part!',
          ],
        },
        {
          heading: '4. Intellectual Property',
          body: [
            'Lucky™, Dior™, the Lucky Scoops USA name, logo, and all character artwork are original works owned by Lucky Scoops USA. You may not reproduce or resell our artwork without written permission.',
          ],
        },
        {
          heading: '5. Limitation of Liability',
          body: [
            'To the fullest extent permitted by law, our liability for any claim related to a purchase is limited to the amount you paid for that purchase.',
          ],
        },
        {
          heading: '6. Changes',
          body: [
            'We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the new terms.',
          ],
        },
      ]}
    />
  );
}
