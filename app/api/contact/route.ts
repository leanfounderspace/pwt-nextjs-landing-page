import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const CONTACT_BUCKET_MAX = 3;
const CONTACT_REFILL_MS = 10 * 60_000;
const CONTACT_BUCKET_TTL_MS = 24 * 60 * 60_000;
const CONTACT_BUCKET_MAX_KEYS = 10_000;

type ContactBucket = {
  tokens: number;
  last: number;
};

const contactBuckets = new Map<string, ContactBucket>();

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

  if (forwardedFor) {
    return forwardedFor;
  }

  const realIp = request.headers.get('x-real-ip')?.trim();

  if (realIp) {
    return realIp;
  }

  return null;
}

function cleanupContactBuckets(now: number): void {
  for (const [key, bucket] of contactBuckets.entries()) {
    if (now - bucket.last > CONTACT_BUCKET_TTL_MS) {
      contactBuckets.delete(key);
    }
  }

  if (contactBuckets.size <= CONTACT_BUCKET_MAX_KEYS) {
    return;
  }

  const overflowCount = contactBuckets.size - CONTACT_BUCKET_MAX_KEYS;
  let removed = 0;

  for (const key of contactBuckets.keys()) {
    contactBuckets.delete(key);
    removed += 1;

    if (removed >= overflowCount) {
      break;
    }
  }
}

function consumeContactToken(rateKey: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  cleanupContactBuckets(now);

  const bucket = contactBuckets.get(rateKey) ?? { tokens: CONTACT_BUCKET_MAX, last: now };
  bucket.tokens = Math.min(
    CONTACT_BUCKET_MAX,
    bucket.tokens + (now - bucket.last) / CONTACT_REFILL_MS
  );
  bucket.last = now;
  contactBuckets.set(rateKey, bucket);

  if (bucket.tokens < 1) {
    const retryAfterSeconds = Math.max(1, Math.ceil(CONTACT_REFILL_MS / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  bucket.tokens -= 1;

  return { allowed: true, retryAfterSeconds: 0 };
}

function buildContactRateKeys(request: Request, email: string): string[] {
  const normalizedEmail = email.trim().toLowerCase();
  const clientIp = getClientIp(request);

  if (!clientIp) {
    return [`email:${normalizedEmail}`];
  }

  return [`ip:${clientIp}`, `ip:${clientIp}:email:${normalizedEmail}`];
}

function consumeRateLimitKeys(rateKeys: string[]): { allowed: boolean; retryAfterSeconds: number } {
  let maxRetryAfterSeconds = 0;

  for (const rateKey of rateKeys) {
    const result = consumeContactToken(rateKey);

    if (!result.allowed) {
      maxRetryAfterSeconds = Math.max(maxRetryAfterSeconds, result.retryAfterSeconds);
    }
  }

  if (maxRetryAfterSeconds > 0) {
    return { allowed: false, retryAfterSeconds: maxRetryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function checkContactRateLimit(request: Request, email: string): NextResponse | null {
  const rateKeys = buildContactRateKeys(request, email);
  const result = consumeRateLimitKeys(rateKeys);

  if (result.allowed) {
    return null;
  }

  return buildRateLimitErrorResponse(result.retryAfterSeconds);
}


function buildRateLimitErrorResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      ok: false,
      error: 'Too many contact requests. Please wait a few minutes before trying again.',
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}

import {
  ContactRequestPayload,
  formatSubmittedAt,
  validateContactRequest,
} from '@/lib/contact';
import {
  AdminOrderNotificationEmail,
  getAdminOrderNotificationText,
} from '@/emails/AdminOrderNotificationEmail';
import {
  CustomerConfirmationEmail,
  getCustomerConfirmationText,
} from '@/emails/CustomerConfirmationEmail';

export const runtime = 'nodejs';

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const adminEmail = process.env.RESEND_ADMIN_EMAIL;
  const replyToEmail = process.env.RESEND_REPLY_TO_EMAIL;

  if (!apiKey || !fromEmail || !adminEmail) {
    return null;
  }

  return {
    apiKey,
    fromEmail,
    adminEmail,
    replyToEmail,
  };
}

function buildCustomerEmail(payload: ContactRequestPayload) {
  return {
    subject: 'We received your request - PwT Solutions',
    react: CustomerConfirmationEmail(payload),
    text: getCustomerConfirmationText(payload),
  };
}

function buildAdminEmail(payload: ContactRequestPayload, submittedAt: string) {
  const adminProps = { ...payload, submittedAt };

  return {
    subject: `New order request: ${payload.name}`,
    react: AdminOrderNotificationEmail(adminProps),
    text: getAdminOrderNotificationText(adminProps),
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  const parsed = validateContactRequest(body);

  if ('error' in parsed) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: 400 }
    );
  }

  const rateLimitResponse = checkContactRateLimit(request, parsed.data.email);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const config = getEmailConfig();

  if (!config) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Email delivery is not configured yet. Please try again shortly.',
      },
      { status: 500 }
    );
  }

  const resend = new Resend(config.apiKey);
  const submittedAt = formatSubmittedAt(new Date());
  const customerEmail = buildCustomerEmail(parsed.data);
  const adminEmail = buildAdminEmail(parsed.data, submittedAt);

  try {
    const [customerResult, adminResult] = await Promise.all([
      resend.emails.send({
        from: `PwT Solutions <${config.fromEmail}>`,
        to: parsed.data.email,
        subject: customerEmail.subject,
        react: customerEmail.react,
        text: customerEmail.text,
        replyTo: config.replyToEmail || config.fromEmail,
      }),
      resend.emails.send({
        from: `PwT Solutions <${config.fromEmail}>`,
        to: config.adminEmail,
        subject: adminEmail.subject,
        react: adminEmail.react,
        text: adminEmail.text,
        replyTo: parsed.data.email,
      }),
    ]);

    if (customerResult.error || adminResult.error) {
      console.error('Resend email delivery failed.', {
        customerError: customerResult.error,
        adminError: adminResult.error,
      });

      return NextResponse.json(
        {
          ok: false,
          error: 'We could not send the confirmation email. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        'Thank you. Your request has been submitted and a confirmation email is on its way.',
    });
  } catch (error) {
    console.error('Contact email request failed.', error);

    return NextResponse.json(
      {
        ok: false,
        error: 'Something went wrong while sending your request. Please try again.',
      },
      { status: 500 }
    );
  }
}
