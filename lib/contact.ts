export const CONTACT_FORM_SOURCE = 'landing-page-order-form';

export interface ContactRequestPackage {
  key: string;
  name: string;
}

export interface ContactRequestPayload {
  name: string;
  email: string;
  phone: string;
  requirements: string;
  selectedPackages: ContactRequestPackage[];
  bundle: boolean;
  total: number;
  source: typeof CONTACT_FORM_SOURCE;
}

const emailFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizePackageList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const key = typeof item.key === 'string' ? item.key.trim() : '';
    const name = typeof item.name === 'string' ? item.name.trim() : '';

    if (!key || !name) {
      return [];
    }

    return [{ key, name }];
  });

  return Array.from(new Map(normalized.map((item) => [item.key, item])).values());
}

export function formatUsd(amount: number) {
  return emailFormatter.format(amount);
}

export function formatSubmittedAt(date: Date) {
  return `${date.toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  })} (GMT+7)`;
}

export function summarizeSelection(selectedPackages: ContactRequestPackage[], bundle: boolean) {
  if (bundle) {
    return 'Complete Package Bundle';
  }

  return selectedPackages.map((item) => item.name).join(', ');
}

export function validateContactRequest(input: unknown) {
  if (!isRecord(input)) {
    return { error: 'Invalid request payload.' as const };
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const requirements = typeof input.requirements === 'string' ? input.requirements.trim() : '';
  const selectedPackages = sanitizePackageList(input.selectedPackages);
  const source = typeof input.source === 'string' ? input.source.trim() : '';
  const bundle =
    typeof input.bundle === 'boolean'
      ? input.bundle
      : input.bundle === 'true'
        ? true
        : input.bundle === 'false'
          ? false
          : false;

  const numericTotal =
    typeof input.total === 'number'
      ? input.total
      : typeof input.total === 'string'
        ? Number(input.total)
        : Number.NaN;

  if (!name || !email || !phone) {
    return { error: 'Name, email, and phone are required.' as const };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Please provide a valid email address.' as const };
  }

  if (!selectedPackages.length) {
    return { error: 'Please select at least one package before submitting.' as const };
  }

  if (!Number.isFinite(numericTotal) || numericTotal <= 0) {
    return { error: 'Invalid pricing information. Please refresh and try again.' as const };
  }

  if (source !== CONTACT_FORM_SOURCE) {
    return { error: 'Invalid form source.' as const };
  }

  return {
    data: {
      name,
      email,
      phone,
      requirements,
      selectedPackages,
      bundle,
      total: numericTotal,
      source: CONTACT_FORM_SOURCE,
    } satisfies ContactRequestPayload,
  };
}
