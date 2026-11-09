# Aurelia Estates

A premium editorial real-estate website starter built with the App Router, TypeScript, and responsive CSS. The current branch contains an interactive **demo experience**, not a production-ready full-stack brokerage platform. All displayed property entries are fictional sample data.

## What's implemented

- Responsive, premium-style home/catalogue, property details, anchors, metadata and security headers.
- Client-side location, buy/rent, category and maximum-price filters; sorting; empty state; saved listing toggles; capped compare selection.
- Inquiry form with server-side input validation and in-memory demo rate limiting. It explicitly tells visitors that no message is delivered or stored.
- Initial Supabase PostgreSQL schema with the requested core entities, indexes, updated-at triggers and starter RLS policies. Review the migration carefully before production use.

## Not implemented / not connected

Authentication, real Supabase reads/writes, storage upload, dashboards, CRM operations, property approval UI, appointment scheduling, persistent favourites/compare, email, maps, AI, analytics, article/FAQ pages, and production-grade rate limiting are not connected in this demo. The form endpoint intentionally does not store or send personal data. Do not use it to receive customer enquiries.

## Run locally

Requires Node.js 20.9+ and npm.

```sh
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. No secrets are needed for the demo. Install generates a lockfile; commit that generated `package-lock.json` for reproducible installs. This environment cannot run npm or generate the lockfile, so none is included yet.

## Supabase setup (not wired to the website yet)

1. Create a Supabase project.
2. In the Supabase SQL editor or using Supabase CLI, run `supabase/migrations/202611090001_initial_schema.sql`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` / the hosting environment only when implementing a browser-safe client.
4. Store `SUPABASE_SERVICE_ROLE_KEY` only as a server-side secret. Never expose it with a `NEXT_PUBLIC_` prefix or send it to a browser.
5. The migration deliberately has no public anonymous inquiry-write policy. Add a server-side submission path with abuse controls before collecting real enquiries. Review all RLS policies with a security professional; this migration is a starting point, not a compliance or security guarantee.

Map, AI and email variables are placeholders only; no provider integration exists. Keep private provider keys server-side.

## Checks and deployment

Dependency versions are pinned for Next.js 16.4.5 and React 19.3.1, chosen against the official GitHub latest-release metadata available at build time. Before deployment, run:

```sh
npm ci
npm audit
npm run typecheck
npm run lint
npm run build
```

Resolve audit findings and build/test failures before deployment. No install, audit, browser test, production build, Supabase migration, or deployment has been run from this GitHub-only environment. Consequently there is no verified preview or production URL. For Vercel: import the GitHub repository, select the `build/aurila-estate-website` branch, add only required environment variables in project settings, and deploy only after all checks pass. Use a configured Supabase project and review the schema/policies before exposing any real customer data.

## Demo content

Property names, prices, specifications, descriptions and locations are fictional illustrative records. Images are replaceable remote Unsplash URLs and require network availability. Do not present demo inventory as agency listings. Replace with licensed assets and verified data.
