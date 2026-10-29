# Ryan Cowan · Living Profile (`empty-night-583f`)

Personal living-hero profile site for **Ryan Cowan**, wired to public GitHub data for [`@ryanehsacoza`](https://github.com/ryanehsacoza) and deployed on Cloudflare Workers.

## Live

https://empty-night-583f.ryanpcowan-f96.workers.dev/

## Local

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

Authenticate with `wrangler login` or set `CLOUDFLARE_API_TOKEN` in the process environment only — never commit tokens or R2 keys.

## Stack

- Workers + Static Assets (`public/`)
- `/api/github` — cached GitHub profile + repos
- Interactive living hero (improved from Living Hero 2.0.0)
