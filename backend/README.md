# MangaVault Backend

Hono.js API on Cloudflare Workers. Handles scraping, caching, and image proxying. Downloads are client-side only unless R2/Queues are configured.

## Local development

```bash
pnpm install
pnpm dev
```

## D1 migrations

```bash
wrangler d1 migrations apply mangavault --local
wrangler d1 migrations apply mangavault
```

## Deploy

```bash
wrangler deploy
```
