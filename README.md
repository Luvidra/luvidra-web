# Luvidra Web

The public marketing and waitlist website for Luvidra, an intelligent trading copilot for plan review, risk understanding and decision journaling.

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Supabase Postgres for waitlist storage
- Vercel-ready deployment

## Local setup

1. Install Node.js 20 or newer and pnpm 11.
2. Install dependencies with `pnpm install`.
3. Copy `.env.example` to `.env.local` and provide the Supabase values.
4. Apply `supabase/migrations/20260921000000_create_waitlist_entries.sql` to the Luvidra Supabase project.
5. Start the site with `pnpm dev`.

## Environment variables

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical production URL for metadata and the sitemap |
| `SUPABASE_URL` | Server only | Luvidra Supabase project URL |
| `SUPABASE_ANON_KEY` | Server only | Optional override for the public insert-only waitlist key |
| `WAITLIST_RATE_LIMIT_SECRET` | Server only | HMAC secret for privacy-preserving waitlist rate limiting |

Never commit `.env.local` or the rate-limit secret. The waitlist stores only an HMAC fingerprint of the request IP and permits five attempts per 15-minute window.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Waitlist data

The browser posts to `/api/waitlist`. The route validates and normalizes the email, checks the honeypot field, then writes through Supabase's server-side REST API. Duplicate emails are ignored safely by the database uniqueness constraint.

Luvidra provides analytical and educational decision support. It is not financial advice and does not guarantee trading outcomes.
