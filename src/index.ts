import html from "../public/index.html";
import css from "../public/styles.css";
import heroJs from "../public/hero.js";
import profileJs from "../public/profile.js";
import defaultsJson from "../public/defaults.json";
import heroWebp from "../public/assets/ryan-hero.webp";

const GITHUB_USER = "ryanehsacoza";
const CACHE_TTL_SECONDS = 300;

type GithubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  blog: string;
  location: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  homepage: string | null;
  fork: boolean;
  topics?: string[];
};

function text(body: string, type: string, cache = "public, max-age=300"): Response {
  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": cache,
    },
  });
}

async function fetchGithubBundle(request: Request): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(
    new URL("/api/github-bundle", request.url).toString(),
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

  const profile = (await profileRes.json()) as GithubProfile;
  const reposRaw = reposRes.ok ? ((await reposRes.json()) as GithubRepo[]) : [];
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
      topics: r.topics ?? [],
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

const routes: Record<string, () => Response> = {
  "/": () => text(html, "text/html; charset=utf-8", "public, max-age=60"),
  "/index.html": () => text(html, "text/html; charset=utf-8", "public, max-age=60"),
  "/styles.css": () => text(css, "text/css; charset=utf-8"),
  "/hero.js": () => text(heroJs, "text/javascript; charset=utf-8"),
  "/profile.js": () => text(profileJs, "text/javascript; charset=utf-8"),
  "/defaults.json": () =>
    text(defaultsJson, "application/json; charset=utf-8"),
  "/assets/ryan-hero.webp": () =>
    new Response(heroWebp, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    }),
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname === "" ? "/" : url.pathname;

    if (path === "/api/github" || path === "/api/profile") {
      try {
        return await fetchGithubBundle(request);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return Response.json({ error: message }, { status: 500 });
      }
    }

    if (path === "/api/health") {
      return Response.json({
        ok: true,
        worker: "empty-night-583f",
        subject: "Ryan Cowan",
        github: GITHUB_USER,
      });
    }

    const handler = routes[path];
    if (handler) return handler();

    return text(html, "text/html; charset=utf-8", "public, max-age=60");
  },
};
