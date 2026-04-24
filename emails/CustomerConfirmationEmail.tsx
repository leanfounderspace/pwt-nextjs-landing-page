import { Section, Text } from '@react-email/components';
import * as React from 'react';

import type { ContactRequestPackage } from '@/lib/contact';
import { formatUsd } from '@/lib/contact';

import { PwtEmailLayout } from './_components/PwtEmailLayout';

export interface CustomerConfirmationEmailProps {
  name: string;
  email: string;
  phone: string;
  requirements: string;
  selectedPackages: ContactRequestPackage[];
  bundle: boolean;
  total: number;
}

export function CustomerConfirmationEmail({
  name,
  email,
  phone,
  requirements,
  selectedPackages,
  bundle,
  total,
}: CustomerConfirmationEmailProps) {
  const firstName = name.split(' ')[0] || name;
  const selectedServices = selectedPackages.map((item) => item.name);

  return (
    <PwtEmailLayout
      preview="We received your request - PwT Tech Solutions"
      title={`Thank you, ${firstName}`}
      intro="We received your request and our team is reviewing it now. A specialist will follow up within 24 hours."
    >
      <Section style={styles.panel}>
        <Text style={styles.label}>Selected services</Text>
        <Text style={styles.value}>
          {bundle ? 'Complete Package Bundle' : selectedServices.join(', ')}
        </Text>

        <Text style={styles.label}>Estimated total</Text>
        <Text style={styles.value}>{formatUsd(total)}</Text>

        <Text style={styles.label}>Submitted contact details</Text>
        <Text style={styles.value}>
          {name}
          <br />
          {email}
          <br />
          {phone}
        </Text>

        {requirements ? (
          <>
            <Text style={styles.label}>Additional requirements</Text>
            <Text style={styles.value}>{requirements}</Text>
          </>
        ) : null}
      </Section>

      <Text style={styles.body}>
        Next step: Our team will review your request and contact you within 24
        hours.
      </Text>
      <Text style={styles.note}>
        This email confirms that we received your request. It is not an invoice
        or payment receipt.
      </Text>
    </PwtEmailLayout>
  );
}

CustomerConfirmationEmail.PreviewProps = {
  name: 'Nguyen Van A',
  email: 'nguyen.van.a@example.com',
  phone: '+84 912 345 678',
  requirements:
    'We need a 5-page landing site plus Shopify integration, targeting launch in 3 weeks.',
  selectedPackages: [
    { key: 'brand', name: 'Brand Identity Package' },
    { key: 'web', name: 'Website Development' },
  ],
  bundle: false,
  total: 4800,
} satisfies CustomerConfirmationEmailProps;

export default CustomerConfirmationEmail;

export function getCustomerConfirmationText({
  name,
  email,
  phone,
  requirements,
  selectedPackages,
  bundle,
  total,
}: CustomerConfirmationEmailProps) {
  const selectedServices = bundle
    ? 'Complete Package Bundle'
    : selectedPackages.map((item) => item.name).join(', ');

  return [
    `Hi ${name},`,
    '',
    'We received your request and our team is reviewing it now.',
    '',
    `Selected services: ${selectedServices}`,
    `Estimated total: ${formatUsd(total)}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    requirements ? `Additional requirements: ${requirements}` : null,
    '',
    'Next step: Our team will review your request and contact you within 24 hours.',
    'This email confirms that we received your request. It is not an invoice or payment receipt.',
    '',
    'PwT Tech Solutions',
    'pwttech.com',
  ]
    .filter(Boolean)
    .join('\n');
}

const styles = {
  panel: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    padding: '24px',
  },
  label: {
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    margin: '0 0 6px',
    textTransform: 'uppercase' as const,
  },
  value: {
    color: '#111827',
    fontSize: '16px',
    lineHeight: '1.7',
    margin: '0 0 18px',
  },
  body: {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '1.7',
    margin: '24px 0 12px',
  },
  note: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.7',
    margin: 0,
  },
} as const;
