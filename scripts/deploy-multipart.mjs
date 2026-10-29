/**
 * Deploy bundled Worker via classic scripts PUT (bypasses versions/assets APIs).
 * Requires CLOUDFLARE_API_TOKEN with Workers Scripts Edit on account
 * f9681a1d65755b13127a9ed67b6fab0f.
 *
 * Usage:
 *   npx wrangler deploy --dry-run --outdir=dist
 *   node scripts/deploy-multipart.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID || "f9681a1d65755b13127a9ed67b6fab0f";
const script = "empty-night-583f";

if (!token) {
  console.error("Set CLOUDFLARE_API_TOKEN in the environment (do not commit it).");
  process.exit(1);
}

const dry = spawnSync(
  "npx",
  ["wrangler", "deploy", "--dry-run", "--outdir=dist"],
  { cwd: root, shell: true, stdio: "inherit", env: process.env },
);
if (dry.status !== 0) process.exit(dry.status ?? 1);

const dist = path.join(root, "dist");
const indexJs = path.join(dist, "index.js");
if (!fs.existsSync(indexJs)) {
  console.error("dist/index.js missing after dry-run");
  process.exit(1);
}

const modules = fs
  .readdirSync(dist)
  .filter((name) => !name.endsWith(".map") && name !== "README.md")
  .map((name) => {
    const ext = path.extname(name).toLowerCase();
    let type = "text/plain";
    if (name === "index.js") type = "application/javascript+module";
    else if (ext === ".webp" || ext === ".bin" || ext === ".wasm")
      type = "application/octet-stream";
    return { name, type, bytes: fs.readFileSync(path.join(dist, name)) };
  });

const metadata = {
  main_module: "index.js",
  compatibility_date: "2026-10-29",
  observability: { enabled: true, traces: { enabled: true } },
};

const form = new FormData();
form.append(
  "metadata",
  new Blob([JSON.stringify(metadata)], { type: "application/json" }),
);
for (const mod of modules) {
  form.append(mod.name, new Blob([mod.bytes], { type: mod.type }), mod.name);
}

const url = `https://api.cloudflare.com/client/v4/accounts/${account}/workers/scripts/${script}`;
const res = await fetch(url, {
  method: "PUT",
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});
const body = await res.text();
console.log(res.status, body.slice(0, 2000));
if (!res.ok) process.exit(1);

console.log(
  `\nLive: https://empty-night-583f.ryanpcowan-f96.workers.dev/\n`,
);
