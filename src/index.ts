export interface Env {
  SITE: KVNamespace;
}

const GITHUB_USER = "ryanehsacoza";
const CACHE_TTL_SECONDS = 300;
const HERO_CDN =
  "https://cdn.jsdelivr.net/gh/bridgeaios/ryan-cowan-living-hero@main/public/assets/ryan-hero.webp";

const CONTENT_TYPES: Record<string, string> = {
  "/": "text/html; charset=utf-8",
  "/index.html": "text/html; charset=utf-8",
  "/styles.css": "text/css; charset=utf-8",
  "/hero.js": "text/javascript; charset=utf-8",
  "/profile.js": "text/javascript; charset=utf-8",
};

async function fetchGithubBundle(request: Request): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(
    new URL("/api/github", request.url).toString(),
    request,
  );
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "empty-night-583f-ryan-cowan-profile",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const [profileRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
    fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`,
      { headers },
    ),
  ]);

  if (!profileRes.ok) {
    return Response.json(
      { error: "GitHub profile unavailable", status: profileRes.status },
      { status: 502 },
    );
  }

  const profile = (await profileRes.json()) as Record<string, unknown>;
  const reposRaw = reposRes.ok
    ? ((await reposRes.json()) as Array<Record<string, unknown>>)
    : [];
  const repos = reposRaw
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      updated_at: r.updated_at,
      homepage: r.homepage,
      topics: (r.topics as string[]) || [],
    }));

  const body = {
    displayName: "Ryan Cowan",
    tagline: "Our time is now.",
    github: {
      login: profile.login,
      name: profile.name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      html_url: profile.html_url,
      blog: profile.blog,
      location: profile.location,
      twitter_username: profile.twitter_username,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      created_at: profile.created_at,
    },
    repos,
    fetchedAt: new Date().toISOString(),
  };

  const response = Response.json(body, {
    headers: {
      "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      "Access-Control-Allow-Origin": "*",
    },
  });
  await cache.put(cacheKey, response.clone());
  return response;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/github" || url.pathname === "/api/profile") {
      try {
        return await fetchGithubBundle(request);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return Response.json({ error: message }, { status: 500 });
      }
    }

    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        worker: "empty-night-583f",
        subject: "Ryan Cowan",
        github: GITHUB_USER,
      });
    }

    if (url.pathname === "/assets/ryan-hero.webp") {
      return Response.redirect(HERO_CDN, 302);
    }

    const key =
      url.pathname === "/" || url.pathname === ""
        ? "index.html"
        : url.pathname.replace(/^\//, "");

    const body = await env.SITE.get(key);
    if (body == null) {
      const fallback = await env.SITE.get("index.html");
      if (fallback == null) {
        return new Response("Site content not loaded", { status: 503 });
      }
      return new Response(fallback, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=60",
        },
      });
    }

    const pathKey = url.pathname === "/" ? "/" : `/${key}`;
    return new Response(body, {
      headers: {
        "content-type":
          CONTENT_TYPES[pathKey] || "application/octet-stream",
        "cache-control": "public, max-age=300",
      },
    });
  },
};
