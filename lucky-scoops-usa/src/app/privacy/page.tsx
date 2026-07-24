import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Lucky Scoops USA collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      sections={[
        {
          heading: '1. Information We Collect',
          body: [
            'When you place an order we collect your name, email, shipping address, and phone number. Payment details are processed directly and securely by Stripe — Lucky Scoops USA never sees or stores your full card number.',
            'When you join our newsletter we collect only your email address. We also collect standard analytics data (pages visited, device type) to improve the store.',
          ],
        },
        {
          heading: '2. How We Use Your Information',
          body: [
            'We use your information to fulfill orders, send order updates, respond to support requests, and — only if you opt in — send news about drops and promotions. We never sell your personal information.',
          ],
        },
        {
          heading: '3. Children’s Privacy',
          body: [
            'Our products delight kids, but our store is intended for use by adults. We do not knowingly collect personal information from children under 13. If you believe a child has provided us information, contact us and we will delete it promptly.',
          ],
        },
        {
          heading: '4. Cookies',
          body: [
            'We use a small number of cookies and local storage to keep your cart working and to understand how the site is used. You can clear these at any time in your browser settings.',
          ],
        },
        {
          heading: '5. Your Rights',
          body: [
            'You may request access to, correction of, or deletion of your personal data at any time by emailing hello@luckyscoopsusa.com. We will respond within 30 days.',
          ],
        },
        {
          heading: '6. Contact',
          body: ['Questions about this policy? Email hello@luckyscoopsusa.com.'],
        },
      ]}
    />
  );
}
