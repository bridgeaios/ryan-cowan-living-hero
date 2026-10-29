# Ryan Cowan · Living Profile (`empty-night-583f`)

Personal living-hero profile for **Ryan Cowan**, wired to public GitHub data for [`@ryanehsacoza`](https://github.com/ryanehsacoza).

## Live

**https://empty-night-583f.thebridgeaiagency.workers.dev/**

Interactive hero, Git presence, and public repos. Hero ships as Worker static assets (`/assets/ryan-hero.webp`) with CDN fallback; `/api/github` serves cached profile data (KV last-good + curated fallback on upstream 403/429).

## Local

```bash
npm install
npm run dev
```

```bash
npm run deploy
```

## Optional: GitHub token (recommended)

Public GitHub API often returns **403** without auth once rate limits are hit. Wire an optional secret (never commit the value):

**PowerShell (Windows)**

```powershell
# Create a classic PAT with public_repo (or fine-grained: read public repos), then:
$env:GITHUB_TOKEN = "ghp_..."   # session only; do not commit
$env:GITHUB_TOKEN | npx wrangler secret put GITHUB_TOKEN
Remove-Item Env:GITHUB_TOKEN
```

**bash**

```bash
read -s GITHUB_TOKEN
printf '%s' "$GITHUB_TOKEN" | npx wrangler secret put GITHUB_TOKEN
unset GITHUB_TOKEN
```

Confirm (boolean only): `curl -s https://empty-night-583f.thebridgeaiagency.workers.dev/api/health` → `githubTokenConfigured: true`.

## Stack

- Cloudflare Worker + static assets (`public/`) + KV (`SITE`) for last-good GitHub bundle
- `/api/github` — edge-cached GitHub profile + repos; curated fallback on failure
- `/api/health` — liveness + whether `GITHUB_TOKEN` is configured
- Living Hero hotspots (`hero.js`) + profile feed (`profile.js`)

## Security

Never commit API tokens or secrets. Prefer `wrangler login` (OAuth) or process-env `CLOUDFLARE_API_TOKEN`. Rotate any token that was pasted into chat.
