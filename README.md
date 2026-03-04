# MangaVault

MangaVault is a full-stack manga scraping and reading platform. It ships a Next.js 15 App Router frontend and a Hono.js backend on Cloudflare Workers with D1, KV, Durable Objects, and Browser Rendering. Downloads run client-side by default; R2/Queues can be added later for server-side packaging.

## Monorepo layout

- `frontend/` Next.js 15 (App Router) + Tailwind + shadcn/ui + TanStack Query + Zustand + PWA + i18n/RTL
- `backend/` Hono.js API on Cloudflare Workers + scrapers + admin APIs

## Requirements

- Node.js 20+
- pnpm 9+
- Cloudflare account (Workers, D1, KV, Durable Objects, Browser Rendering)
- Vercel account

## Quickstart

1) Install dependencies

```bash
pnpm install
```

2) Copy environment templates

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3) Run locally

```bash
pnpm -C backend dev
pnpm -C frontend dev
```

4) Deploy

See `backend/README.md` and `frontend/README.md` for deployment steps.
