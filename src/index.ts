export interface Env {
  ASSETS: Fetcher;
  SITE: KVNamespace;
  /** Optional classic/fine-grained PAT — raises GitHub API rate limits / avoids 403. */
  GITHUB_TOKEN?: string;
}

const GITHUB_USER = "ryanehsacoza";
const CACHE_TTL_SECONDS = 600;
const FALLBACK_TTL_SECONDS = 60;
const STALE_KV_KEY = "github:last-good";
const EDGE_CACHE_KEY = "https://empty-night-583f.internal/api/github-bundle-v2";
const HERO_PATH = "/assets/ryan-hero.webp";
const HERO_CDN =
  "https://cdn.jsdelivr.net/gh/bridgeaios/ryan-cowan-living-hero@master/public/assets/ryan-hero.webp";

const CURATED_FALLBACK = {
  displayName: "Ryan Cowan",
  tagline: "Our time is now.",
  stale: true as const,
  source: "curated-fallback",
  github: {
    login: GITHUB_USER,
    name: "SupaC",
    bio: null as string | null,
    avatar_url: "https://avatars.githubusercontent.com/u/50844727?v=4",
    html_url: `https://github.com/${GITHUB_USER}`,
    blog: "",
    location: null as string | null,
    twitter_username: null as string | null,
    public_repos: 4,
    followers: 1,
    following: 2,
    created_at: "2019-05-20T18:53:39Z",
  },
  repos: [
    {
      name: "casiNO",
      description: "casiNO",
      html_url: `https://github.com/${GITHUB_USER}/casiNO`,
      language: "TypeScript",
      stargazers_count: 1,
      forks_count: 0,
      updated_at: "2026-10-04T19:16:08Z",
      homepage: null as string | null,
      topics: [] as string[],
      status: "in-development" as const,
    },
    {
      name: "master.bridge",
      description: "https://master.bridge-dashboard-9p1.pages.dev",
      html_url: `https://github.com/${GITHUB_USER}/master.bridge`,
      language: "HTML",
      stargazers_count: 0,
      forks_count: 0,
      updated_at: "2026-03-05T21:55:19Z",
      homepage: "https://master.bridge-dashboard-9p1.pages.dev",
      topics: [] as string[],
      status: "live" as const,
    },
    {
      name: "readme.md",
      description: "readme",
      html_url: `https://github.com/${GITHUB_USER}/readme.md`,
      language: null as string | null,
      stargazers_count: 0,
      forks_count: 0,
      updated_at: "2026-10-29T07:19:24Z",
      homepage: null as string | null,
      topics: [] as string[],
      status: "concept" as const,
    },
  ],
  fetchedAt: null as string | null,
};

type FailureReason =
  | "rate_limited"
  | "forbidden"
  | "unauthorized"
  | "upstream_error"
  | "network_error";

type GithubBundle = typeof CURATED_FALLBACK & {
  stale?: boolean;
  source?: string;
  upstreamStatus?: number;
  reason?: FailureReason;
  message?: string;
  authConfigured?: boolean;
  rateLimit?: { remaining: number | null; reset: number | null };
};

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data: https://avatars.githubusercontent.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; media-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
};

const ALLOWED_ORIGINS = new Set([
  "https://empty-night-583f.thebridgeaiagency.workers.dev",
  "http://127.0.0.1:8787",
  "http://localhost:8787",
]);

function withSecurityHeaders(headers: HeadersInit = {}): Headers {
  const h = new Headers(headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!h.has(k)) h.set(k, v);
  }
  return h;
}

function corsOrigin(request?: Request): string {
  const origin = request?.headers.get("Origin") || "";
  if (origin && ALLOWED_ORIGINS.has(origin)) return origin;
  return "https://empty-night-583f.thebridgeaiagency.workers.dev";
}

function jsonResponse(
  body: unknown,
  status = 200,
  maxAge = CACHE_TTL_SECONDS,
  request?: Request,
) {
  return Response.json(body, {
    status,
    headers: withSecurityHeaders({
      "Cache-Control": `public, max-age=${maxAge}`,
      "Access-Control-Allow-Origin": corsOrigin(request),
      Vary: "Origin",
    }),
  });
}

function githubHeaders(env: Env): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "empty-night-583f-ryan-cowan-profile",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function classifyUpstream(status: number): FailureReason {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 429) return "rate_limited";
  return "upstream_error";
}

function humanMessage(reason: FailureReason, status: number): string {
  switch (reason) {
    case "rate_limited":
      return "GitHub rate limit hit; serving cached or curated profile.";
    case "forbidden":
      return "GitHub returned 403 (auth or rate). Set GITHUB_TOKEN via wrangler secret to stabilize.";
    case "unauthorized":
      return "GitHub rejected credentials; check GITHUB_TOKEN and re-put the secret.";
    case "network_error":
      return "Could not reach GitHub; serving cached or curated profile.";
    default:
      return `GitHub upstream error (${status || "unknown"}); serving cached or curated profile.`;
  }
}

function readRateLimit(res: Response) {
  const remaining = res.headers.get("x-ratelimit-remaining");
  const reset = res.headers.get("x-ratelimit-reset");
  return {
    remaining: remaining != null ? Number(remaining) : null,
    reset: reset != null ? Number(reset) : null,
  };
}

function mapRepos(reposRaw: Array<Record<string, unknown>>) {
  return reposRaw
    .filter((r) => !r.fork)
    .map((r) => ({
      name: String(r.name ?? ""),
      description: (r.description as string | null) ?? null,
      html_url: String(r.html_url ?? ""),
      language: (r.language as string | null) ?? null,
      stargazers_count: Number(r.stargazers_count ?? 0),
      forks_count: Number(r.forks_count ?? 0),
      updated_at: String(r.updated_at ?? ""),
      homepage: (r.homepage as string | null) ?? null,
      topics: (r.topics as string[]) || [],
    }));
}

async function fetchGithubBundle(
  request: Request,
  env: Env,
): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(EDGE_CACHE_KEY, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const authConfigured = Boolean(env.GITHUB_TOKEN?.trim());
  const headers = githubHeaders(env);

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
      fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`,
        { headers },
      ),
    ]);

    const rateLimit = readRateLimit(profileRes.ok ? profileRes : reposRes);

    if (!profileRes.ok) {
      const reason = classifyUpstream(profileRes.status);
      return await serveStaleOrFallback(env, cache, cacheKey, {
        upstreamStatus: profileRes.status,
        reason,
        message: humanMessage(reason, profileRes.status),
        authConfigured,
        rateLimit,
        request,
      });
    }

    const profile = (await profileRes.json()) as Record<string, unknown>;
    let repos = CURATED_FALLBACK.repos.map(({ status: _s, ...rest }) => rest);

    if (reposRes.ok) {
      repos = mapRepos(
        (await reposRes.json()) as Array<Record<string, unknown>>,
      );
    } else if (reposRes.status === 403 || reposRes.status === 429) {
      /* keep curated repo list when list endpoint is throttled */
    }

    const body: GithubBundle = {
      displayName: "Ryan Cowan",
      tagline: "Our time is now.",
      stale: false,
      source: "github-live",
      authConfigured,
      rateLimit,
      github: {
        login: String(profile.login ?? GITHUB_USER),
        name: (profile.name as string | null) ?? null,
        bio: (profile.bio as string | null) ?? null,
        avatar_url: String(
          profile.avatar_url ?? CURATED_FALLBACK.github.avatar_url,
        ),
        html_url: String(
          profile.html_url ?? `https://github.com/${GITHUB_USER}`,
        ),
        blog: String(profile.blog ?? ""),
        location: (profile.location as string | null) ?? null,
        twitter_username: (profile.twitter_username as string | null) ?? null,
        public_repos: Number(profile.public_repos ?? repos.length),
        followers: Number(profile.followers ?? 0),
        following: Number(profile.following ?? 0),
        created_at: String(
          profile.created_at ?? CURATED_FALLBACK.github.created_at,
        ),
      },
      repos,
      fetchedAt: new Date().toISOString(),
    };

    if (!reposRes.ok) {
      body.stale = true;
      body.source = "github-partial";
      body.upstreamStatus = reposRes.status;
      body.reason = classifyUpstream(reposRes.status);
      body.message = `Profile live; repos unavailable (${reposRes.status}). Showing curated repo list.`;
    }

    const response = jsonResponse(
      body,
      200,
      body.stale ? FALLBACK_TTL_SECONDS : CACHE_TTL_SECONDS,
      request,
    );
    await cache.put(cacheKey, response.clone());
    try {
      await env.SITE.put(STALE_KV_KEY, JSON.stringify(body), {
        expirationTtl: 60 * 60 * 24 * 14,
      });
    } catch {
      /* KV optional for resilience */
    }
    return response;
  } catch {
    return await serveStaleOrFallback(env, cache, cacheKey, {
      upstreamStatus: 0,
      reason: "network_error",
      message: humanMessage("network_error", 0),
      authConfigured,
      rateLimit: { remaining: null, reset: null },
      request,
    });
  }
}

async function serveStaleOrFallback(
  env: Env,
  cache: Cache,
  cacheKey: Request,
  meta: {
    upstreamStatus: number;
    reason: FailureReason;
    message: string;
    authConfigured: boolean;
    rateLimit: { remaining: number | null; reset: number | null };
    request?: Request;
  },
): Promise<Response> {
  try {
    const staleRaw = await env.SITE.get(STALE_KV_KEY);
    if (staleRaw) {
      const parsed = JSON.parse(staleRaw) as GithubBundle;
      const body: GithubBundle = {
        ...parsed,
        stale: true,
        source: "kv-stale",
        upstreamStatus: meta.upstreamStatus,
        reason: meta.reason,
        message: meta.message,
        authConfigured: meta.authConfigured,
        rateLimit: meta.rateLimit,
      };
      const response = jsonResponse(
        body,
        200,
        FALLBACK_TTL_SECONDS,
        meta.request,
      );
      await cache.put(cacheKey, response.clone());
      return response;
    }
  } catch {
    /* fall through */
  }

  const body: GithubBundle = {
    ...CURATED_FALLBACK,
    stale: true,
    source: "curated-fallback",
    upstreamStatus: meta.upstreamStatus,
    reason: meta.reason,
    message: meta.message,
    authConfigured: meta.authConfigured,
    rateLimit: meta.rateLimit,
    fetchedAt: new Date().toISOString(),
  };
  const response = jsonResponse(
    body,
    200,
    FALLBACK_TTL_SECONDS,
    meta.request,
  );
  await cache.put(cacheKey, response.clone());
  return response;
}

function withLongCache(res: Response, maxAge = 86400): Response {
  const headers = withSecurityHeaders(res.headers);
  headers.set(
    "Cache-Control",
    `public, max-age=${maxAge}, stale-while-revalidate=604800`,
  );
  headers.set("X-Hero-Source", "assets");
  return new Response(res.body, { status: res.status, headers });
}

function withAssetSecurity(res: Response): Response {
  return new Response(res.body, {
    status: res.status,
    headers: withSecurityHeaders(res.headers),
  });
}

async function serveHero(request: Request, env: Env): Promise<Response> {
  const assetRes = await env.ASSETS.fetch(request);
  const ctype = assetRes.headers.get("content-type") || "";
  if (assetRes.ok && ctype.startsWith("image/")) {
    return withLongCache(assetRes);
  }

  try {
    const cdnRes = await fetch(HERO_CDN, {
      cf: { cacheTtl: 86400, cacheEverything: true },
    });
    if (cdnRes.ok) {
      const headers = withSecurityHeaders(cdnRes.headers);
      headers.set(
        "Cache-Control",
        "public, max-age=86400, stale-while-revalidate=604800",
      );
      headers.set("X-Hero-Source", "cdn-fallback");
      headers.set("Content-Type", "image/webp");
      return new Response(cdnRes.body, { status: 200, headers });
    }
  } catch {
    /* keep asset response */
  }

  return assetRes;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/github" || url.pathname === "/api/profile") {
      return fetchGithubBundle(request, env);
    }

    if (url.pathname === "/api/health") {
      return Response.json(
        {
          ok: true,
          worker: "empty-night-583f",
          subject: "Ryan Cowan",
          github: GITHUB_USER,
          githubTokenConfigured: Boolean(env.GITHUB_TOKEN?.trim()),
        },
        { headers: withSecurityHeaders() },
      );
    }

    if (url.pathname === HERO_PATH) {
      return serveHero(request, env);
    }

    return withAssetSecurity(await env.ASSETS.fetch(request));
  },
};
