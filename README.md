# PwT Tech

## Overview

This project is the public-facing landing website for PwT Tech, with integrated lead capture, automated email workflows, and an AI-powered chat experience.

In addition to the marketing pages, the app includes an admin chat dashboard and legal pages required for production use.

## Core Features

- Marketing landing page for service presentation and conversion
- Contact/order form with:
  - Customer confirmation email
  - Admin notification email
  - Delivery via Resend + React Email templates
- Live chat experience powered by DeepSeek AI
- Telegram forwarding fallback when AI takeover is disabled
- Admin conversation management at `/admin/chat` (protected by Basic Auth)
- Legal pages (privacy policy, terms of service, refund policy, etc.)

## Tech Stack

- Framework: Next.js 16
- UI: React 19 + Tailwind CSS 4
- Language: TypeScript
- Data storage: SQLite (`better-sqlite3`)
- Email: Resend + `@react-email/components`

## Requirements

- Node.js >= 20
- pnpm >= 10

## Getting Started

Install dependencies and initialize environment variables:

```bash
pnpm install
cp .env.example .env
```

Then update `.env` with your real keys and addresses.

## Environment Variables

Use `.env.example` as the source of truth.

### AI Chat

- `DEEPSEEK_API_KEY`

### Email (Resend)

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_ADMIN_EMAIL`
- `RESEND_REPLY_TO_EMAIL` (optional but recommended for reply handling)

### Telegram Fallback

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_CHAT_ID_NEW_MESSAGE`

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build production app
pnpm start        # Run production server
pnpm lint         # Run ESLint
pnpm email:dev    # Preview email templates locally (port 3001)
pnpm email:build  # Build email templates
pnpm email:export # Export rendered email output
```

## Local Development

Start the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

Build and run:

```bash
pnpm build
pnpm start
```

## Admin Access

Admin chat is available at:

- `/admin/chat`

Access is protected via Basic Auth configured in `middleware.ts`.
