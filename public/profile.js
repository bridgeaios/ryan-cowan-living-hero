function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return iso?.slice?.(0, 7) || "";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function loadProfile() {
  const bioEl = document.getElementById("presence-bio");
  const metaEl = document.getElementById("presence-meta");
  const listEl = document.getElementById("repo-list");
  const avatar = document.getElementById("gh-avatar");
  const loginEl = document.getElementById("gh-login");
  const handleLink = document.getElementById("gh-handle-link");
  const profileBtn = document.getElementById("gh-profile-btn");
  const feedStatus = document.getElementById("feed-status");

  try {
    const res = await fetch("/api/github", {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    if (data.error && !data.github) throw new Error(data.error);

    const gh = data.github || {};
    const repos = Array.isArray(data.repos) ? data.repos : [];
    const display = data.displayName || gh.name || "Ryan Cowan";
    const bio =
      gh.bio ||
      `${display} builds at the edge of family, coast, and code. Public work lives on GitHub as @${gh.login || "ryanehsacoza"}.`;

    bioEl.textContent = bio;
    loginEl.textContent = `@${gh.login || "ryanehsacoza"}`;
    if (gh.avatar_url) {
      avatar.src = gh.avatar_url;
      avatar.alt = `GitHub avatar for ${gh.login || "ryanehsacoza"}`;
    }
    const profileUrl = gh.html_url || "https://github.com/ryanehsacoza";
    if (handleLink) {
      handleLink.href = profileUrl;
      handleLink.textContent = `@${gh.login || "ryanehsacoza"}`;
    }
    profileBtn.href = profileUrl;

    if (feedStatus) {
      if (data.stale || data.source === "github-partial") {
        feedStatus.hidden = false;
        const base =
          data.message ||
          (data.source === "kv-stale"
            ? "Showing last known GitHub snapshot while the live API is unavailable."
            : data.source === "github-partial"
              ? "Profile loaded; repository list fell back to curated links."
              : "Showing curated fallback while GitHub is unavailable.");
        const hint =
          data.reason === "forbidden" || data.reason === "rate_limited"
            ? " Operator tip: set Worker secret GITHUB_TOKEN to raise GitHub API limits."
            : "";
        feedStatus.textContent = `${base}${hint}`;
      } else {
        feedStatus.hidden = true;
        feedStatus.textContent = "";
      }
    }

    metaEl.innerHTML = [
      ["Repos", gh.public_repos ?? repos.length],
      ["Followers", gh.followers ?? 0],
      ["Following", gh.following ?? 0],
      ["Joined", formatDate(gh.created_at)],
    ]
      .map(
        ([label, value]) =>
          `<li><span>${escapeHtml(value)}</span> ${escapeHtml(label)}</li>`,
      )
      .join("");

    if (!repos.length) {
      listEl.innerHTML =
        '<li class="repo-loading">No public non-fork repositories found yet. <a href="https://github.com/ryanehsacoza?tab=repositories" rel="noopener noreferrer">Browse on GitHub</a>.</li>';
      return;
    }

    listEl.innerHTML = repos
      .map((repo) => {
        const desc = repo.description || "No description provided.";
        const lang = repo.language
          ? `<span>${escapeHtml(repo.language)}</span>`
          : "";
        const stars =
          typeof repo.stargazers_count === "number"
            ? `<span>★ ${repo.stargazers_count}</span>`
            : "";
        const updated = repo.updated_at
          ? `<span>Updated ${escapeHtml(formatDate(repo.updated_at))}</span>`
          : "";
        const status = repo.status
          ? `<span>${escapeHtml(repo.status)}</span>`
          : "";
        return `<li>
          <a class="repo" href="${escapeHtml(repo.html_url)}" rel="noopener noreferrer">
            <p class="repo-name">${escapeHtml(repo.name)}</p>
            <p class="repo-desc">${escapeHtml(desc)}</p>
            <div class="repo-meta">${lang}${stars}${updated}${status}</div>
          </a>
        </li>`;
      })
      .join("");
  } catch (err) {
    console.error(err);
    bioEl.textContent =
      "Ryan Cowan — living profile. Live GitHub data could not be loaded; curated links remain available.";
    if (feedStatus) {
      feedStatus.hidden = false;
      feedStatus.textContent = `Feed error: ${err instanceof Error ? err.message : "unavailable"}. Curated project cards above still work.`;
    }
    listEl.innerHTML = `<li class="repo-loading">Could not load live repositories — curated cards above remain. <a href="https://github.com/ryanehsacoza?tab=repositories" rel="noopener noreferrer">Browse on GitHub</a>.</li>`;
  }
}

loadProfile();
