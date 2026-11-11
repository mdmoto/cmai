# Chiang Mai AI Center

Business infrastructure for international companies entering Thailand — not a coworking space.

**Live:** [lazzor.com](https://lazzor.com)

## What it is

A 5-floor / 40+ unit enterprise hub in Chiang Mai, built for foreign companies
that need a real operating base in Thailand: a legal business address, private
offices, enterprise networking, and the local compliance layer that normally
takes months to assemble on your own.

- 5 km to Chiang Mai International Airport
- Prime business district location
- Enterprise-grade internet throughout

## Services

| Service | Notes |
| --- | --- |
| Private offices | Fully furnished, for startups and international teams |
| Business address | Registered address for company setup |
| Mail handling | Business mail and parcels |
| Meeting facilities | Meeting rooms and training space |
| Enterprise internet | Business-grade connectivity |
| Dedicated IP & VPN | Enterprise networking (self-hosted ocserv, see `install_ocserv.sh`) |
| Business registration support | Delivered through local partners |
| Local business support | Accounting, legal, tax, visa and translation partners |
| Community | Networking events and startup activities |

The AI Decision Sandbox linked from the site navbar runs on a separate service
at [ai.lazzor.com](https://ai.lazzor.com).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · TailwindCSS v4 ·
Radix UI · Framer Motion. Static export (`next build`) deployed to
Cloudflare Pages.

## SEO / GEO

- `src/app/sitemap.ts` and `src/app/robots.ts` generate crawl artifacts at build time
- `RealEstateAgent` JSON-LD schema
- Bilingual English / Thai metadata and on-page copy
- Audited against Google's crawl → index → render model plus AI-search (GEO)
  practice; see `SEO_GEO_AUDIT.md`

## Compliance

The shareholder-matching service was deliberately removed to stay clear of Thai
nominee-shareholder regulations. Do not reintroduce nominee arrangements.

## Local development

```bash
npm install
npm run dev
```

Environment variables are read from `.env.local` and are gitignored:

```
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=
SMTP_HOST= SMTP_PORT= SMTP_USER= SMTP_PASS=
SMTP_FROM= ADMIN_EMAIL=
```

## Status

Live and serving traffic. The office-availability, online-booking, interactive
floor-plan and CMS features in the original spec are still unbuilt — see
`Chiang_Mai_AI_Center_Website_Spec.md`.

> **Verify before publishing figures:** `src/components/About.tsx` currently
> states 1,600 m² while `Chiang_Mai_AI_Center_Website_Spec.md` says 600 m².
> Confirm the real area before this number is quoted anywhere externally.
