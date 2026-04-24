import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PwtEmailLayoutProps {
  preview: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}

export function PwtEmailLayout({
  preview,
  title,
  intro,
  children,
}: PwtEmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.shell}>
            <Text style={styles.brand}>PwT Tech Solutions</Text>
            <Hr style={styles.rule} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.intro}>{intro}</Text>
            {children}
            <Hr style={styles.footerRule} />
            <Text style={styles.footer}>
              PwT Tech Solutions
              <br />
              Building Supreme Customer Experience - Digital and Beyond
            </Text>
            <Text style={styles.footerLink}>
              <Link href="https://pwttech.com/" style={styles.link}>
                pwttech.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    margin: 0,
    padding: '32px 16px',
  },
  container: {
    margin: '0 auto',
    maxWidth: '640px',
    width: '100%',
  },
  shell: {
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '20px',
    padding: '32px',
  },
  brand: {
    color: '#111827',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.3em',
    margin: '0 0 12px',
    textTransform: 'uppercase' as const,
  },
  rule: {
    borderColor: '#111827',
    borderStyle: 'solid',
    borderWidth: '2px 0 0',
    margin: '0 0 24px',
  },
  title: {
    color: '#111827',
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1.2',
    margin: '0 0 12px',
  },
  intro: {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '1.7',
    margin: '0 0 24px',
  },
  footerRule: {
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
    borderWidth: '1px 0 0',
    margin: '32px 0 20px',
  },
  footer: {
    color: '#6b7280',
    fontSize: '13px',
    lineHeight: '1.7',
    margin: '0 0 8px',
  },
  footerLink: {
    margin: 0,
  },
  link: {
    color: '#111827',
    textDecoration: 'underline',
  },
} as const;
