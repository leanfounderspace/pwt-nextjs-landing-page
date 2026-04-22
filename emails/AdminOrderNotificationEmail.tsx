import { Section, Text } from '@react-email/components';
import * as React from 'react';

import type { ContactRequestPackage } from '@/lib/contact';
import { formatUsd } from '@/lib/contact';

import { PwtEmailLayout } from './_components/PwtEmailLayout';

export interface AdminOrderNotificationEmailProps {
  name: string;
  email: string;
  phone: string;
  requirements: string;
  selectedPackages: ContactRequestPackage[];
  bundle: boolean;
  total: number;
  source: string;
  submittedAt: string;
}

export function AdminOrderNotificationEmail({
  name,
  email,
  phone,
  requirements,
  selectedPackages,
  bundle,
  total,
  source,
  submittedAt,
}: AdminOrderNotificationEmailProps) {
  const selectedServices = selectedPackages.map((item) => item.name).join(', ');

  return (
    <PwtEmailLayout
      preview={`New order request from ${name}`}
      title="New order request"
      intro="A new landing page contact form submission is ready for review."
    >
      <Section style={styles.panel}>
        <Text style={styles.label}>Requester</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Contact</Text>
        <Text style={styles.value}>
          {email}
          <br />
          {phone}
        </Text>

        <Text style={styles.label}>Selection</Text>
        <Text style={styles.value}>
          {bundle ? 'Complete Package Bundle' : selectedServices}
        </Text>

        <Text style={styles.label}>Estimated total</Text>
        <Text style={styles.value}>{formatUsd(total)}</Text>

        <Text style={styles.label}>Submitted at</Text>
        <Text style={styles.value}>{submittedAt}</Text>

        <Text style={styles.label}>Source</Text>
        <Text style={styles.value}>{source}</Text>

        <Text style={styles.label}>Requirements</Text>
        <Text style={styles.value}>
          {requirements || 'No additional requirements provided.'}
        </Text>
      </Section>
    </PwtEmailLayout>
  );
}

AdminOrderNotificationEmail.PreviewProps = {
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
  source: 'landing-page-order-form',
  submittedAt: 'April 22, 2026 at 9:15 PM (GMT+7)',
} satisfies AdminOrderNotificationEmailProps;

export default AdminOrderNotificationEmail;

export function getAdminOrderNotificationText({
  name,
  email,
  phone,
  requirements,
  selectedPackages,
  bundle,
  total,
  source,
  submittedAt,
}: AdminOrderNotificationEmailProps) {
  const selectedServices = bundle
    ? 'Complete Package Bundle'
    : selectedPackages.map((item) => item.name).join(', ');

  return [
    `New order request: ${name}`,
    '',
    `Requester: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Selection: ${selectedServices}`,
    `Estimated total: ${formatUsd(total)}`,
    `Submitted at: ${submittedAt}`,
    `Source: ${source}`,
    `Requirements: ${requirements || 'No additional requirements provided.'}`,
  ].join('\n');
}

const styles = {
  panel: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
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
} as const;
