# Ryan Cowan · Living Profile (`empty-night-583f`)

Personal living-hero profile for **Ryan Cowan**, wired to public GitHub data for [`@ryanehsacoza`](https://github.com/ryanehsacoza).

## Live

**https://empty-night-583f.thebridgeaiagency.workers.dev/**

Interactive hero, Git presence, and public repos. Hero image loads from the repo CDN; `/api/github` serves cached profile data.

> Target hostname `empty-night-583f.ryanpcowan-f96.workers.dev` is on account `f9681a1d65755b13127a9ed67b6fab0f`. The API token shared in chat can **read** that Worker but cannot **write**/deploy. To publish there, create an API token with **Workers Scripts Edit** (and optionally Workers KV) on that account, then run `npm run deploy` with `CLOUDFLARE_ACCOUNT_ID=f9681a1d65755b13127a9ed67b6fab0f`.

## Local

```bash
npm install
npm run dev
```

After changing `public/*`, sync KV:

```bash
npx wrangler kv key put --remote --namespace-id=3577f04b88e04971b986b4388b4c3e61 index.html --path=public/index.html
npx wrangler kv key put --remote --namespace-id=3577f04b88e04971b986b4388b4c3e61 styles.css --path=public/styles.css
npx wrangler kv key put --remote --namespace-id=3577f04b88e04971b986b4388b4c3e61 hero.js --path=public/hero.js
npx wrangler kv key put --remote --namespace-id=3577f04b88e04971b986b4388b4c3e61 profile.js --path=public/profile.js
npm run deploy
```

## Stack

- Cloudflare Worker + KV (`SITE`) for HTML/CSS/JS
- `/api/github` — cached GitHub profile + repos
- Living Hero 2.0 hotspots (improved typography, brand overlay, profile sections)
- Hero art via jsDelivr from this repo’s `public/assets/ryan-hero.webp`

## Security

Never commit API tokens or R2 keys. Prefer `wrangler login` or process-env `CLOUDFLARE_API_TOKEN`. Rotate any token that was pasted into chat.
