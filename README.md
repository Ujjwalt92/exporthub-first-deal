# ExportHub — First Deal OS (SaaS)

Multi-tenant export workspace with **auth, workspaces, multi-deal CRM, team invites, plan limits, and cloud sync**.

Live app: https://ujjwalt92.github.io/exporthub-first-deal/

## What “full SaaS” includes

| Capability | Status |
|---|---|
| Email/password auth | ✅ |
| Workspaces + members | ✅ |
| Multi-deal dashboard | ✅ |
| Cloud deal sync API | ✅ (`server/`) |
| Local SaaS vault fallback | ✅ (works offline / without API host) |
| Plan limits (Free / Founding / Pro) | ✅ |
| In-app billing activation | ✅ (Razorpay/Stripe webhook-ready) |
| Team invites | ✅ |
| Marketing + pricing site | ✅ |
| Deal playbook cockpit | ✅ |

## Product URLs

- Marketing: `/#/`
- Pricing: `/#/pricing`
- Sign up / Sign in: `/#/signup` · `/#/login`
- SaaS dashboard: `/#/app`
- Billing / Team: `/#/app/billing` · `/#/app/team`
- Deal cockpit: `/#/workspace` (requires active deal)

## Run locally

### Frontend
```bash
npm install
npm run dev
```

### API
```bash
cd server
npm install
npm start
# health: http://localhost:8787/health
```

Optional frontend env:
```bash
echo 'VITE_API_URL=http://localhost:8787' > .env.local
```

Or set the API URL later in **Settings → Cloud API endpoint**.

## Deploy API (production cloud)

`render.yaml` is included. One-click options:

1. Create a Render Web Service from `/server`
2. Set `CORS_ORIGINS=https://ujjwalt92.github.io`
3. Paste the public API URL into the app Settings (or `VITE_API_URL` at build time)

```bash
cd server && npm start
```

API routes:
- `POST /auth/register` `POST /auth/login` `GET /auth/me`
- `GET/POST /deals` `GET/PUT/DELETE /deals/:id`
- `POST /workspace/plan` `POST /workspace/invites`
- `GET /billing/plans` `GET /health`

## Plans

- **Free** — 1 deal, 1 seat
- **Founding** — ₹14,999 one-time · unlimited deals · 3 seats
- **Pro** — ₹4,999/mo · unlimited deals · 20 seats

## Demo deal

Teja S17 Stemless · 1×20ft · 12,000 kg · FOB JNPT → Jebel Ali · LC at Sight

## Honest note

Checkout buttons activate plans in-app (SaaS-ready). Before collecting real money, attach Razorpay/Stripe webhooks to `POST /workspace/plan`. Persist API data on a durable host (Render disk / Postgres) — the JSON file DB is perfect for MVP.
