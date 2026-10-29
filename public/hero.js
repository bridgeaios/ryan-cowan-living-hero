const DEFAULT = {
  hotspots: {
    logo: {
      label: "Ryan Cowan",
      x: 1.5,
      y: 2,
      w: 14,
      h: 9,
      anchor: "topleft",
      kind: "nav",
      href: "#intro",
      chrome: true,
    },
    "nav-home": {
      label: "Home",
      x: 1.8,
      y: 14.5,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#intro",
      chrome: true,
    },
    "nav-about": {
      label: "About",
      x: 1.8,
      y: 19.2,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "nav-family": {
      label: "Family",
      x: 1.8,
      y: 23.9,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "nav-work": {
      label: "Work",
      x: 1.8,
      y: 28.6,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#bridge",
      chrome: true,
    },
    "nav-education": {
      label: "Education",
      x: 1.8,
      y: 33.3,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "nav-places": {
      label: "Places",
      x: 1.8,
      y: 38,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "nav-projects": {
      label: "Projects",
      x: 1.8,
      y: 42.7,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#projects",
      chrome: true,
    },
    "nav-gallery": {
      label: "Gallery",
      x: 1.8,
      y: 47.4,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#projects",
      chrome: true,
    },
    "nav-connect": {
      label: "Connect",
      x: 1.8,
      y: 52.1,
      w: 12,
      h: 4.2,
      anchor: "topleft",
      kind: "nav",
      href: "#work-with-me",
      chrome: true,
    },
    "cta-meet": {
      label: "Meet Ryan",
      x: 31,
      y: 55.5,
      w: 15,
      h: 5.5,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "cta-explore": {
      label: "Explore the journey",
      x: 47.5,
      y: 55.5,
      w: 20,
      h: 5.5,
      anchor: "topleft",
      kind: "nav",
      href: "#projects",
      chrome: true,
    },
    "card-beach-bums": {
      label: "Beach Bums",
      x: 76,
      y: 36,
      w: 22,
      h: 9,
      anchor: "topleft",
      kind: "nav",
      href: "#work-with-me",
      chrome: true,
    },
    "card-damelin": {
      label: "Damelin",
      x: 76,
      y: 46.5,
      w: 22,
      h: 8,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "card-bishops": {
      label: "Bishops College",
      x: 76,
      y: 56,
      w: 22,
      h: 10,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "pin-ballito": {
      label: "Ballito",
      x: 6,
      y: 68,
      w: 14,
      h: 8,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "chapter-genesis": {
      label: "01 Genesis",
      x: 1.2,
      y: 77.5,
      w: 19,
      h: 20,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "chapter-family": {
      label: "02 Family",
      x: 20.8,
      y: 77.5,
      w: 19,
      h: 20,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "chapter-work": {
      label: "03 Work",
      x: 40.4,
      y: 77.5,
      w: 19,
      h: 20,
      anchor: "topleft",
      kind: "nav",
      href: "#bridge",
      chrome: true,
    },
    "chapter-coastal": {
      label: "04 Coastal life",
      x: 60,
      y: 77.5,
      w: 19,
      h: 20,
      anchor: "topleft",
      kind: "nav",
      href: "#story",
      chrome: true,
    },
    "chapter-beyond": {
      label: "05 Beyond tomorrow",
      x: 79.6,
      y: 77.5,
      w: 19,
      h: 20,
      anchor: "topleft",
      kind: "nav",
      href: "#work-with-me",
      chrome: true,
    },
    ryan: {
      label: "Ryan",
      x: 46,
      y: 30,
      w: 16,
      h: 28,
      anchor: "center",
      kind: "speech",
      speech:
        "I love my family and my kids, our time is NOW! They call me Ryanstein in the district!",
      rate: 0.92,
      pitch: 0.82,
      volume: 1,
    },
    kids: {
      label: "Kids",
      x: 28,
      y: 28,
      w: 16,
      h: 18,
      anchor: "center",
      kind: "speech",
      speech: "WE LOVE YOU DADDY!",
      rate: 1.1,
      pitch: 1.6,
      volume: 1,
    },
    baby: {
      label: "Baby",
      x: 50,
      y: 48,
      w: 12,
      h: 18,
      anchor: "center",
      kind: "baby",
      speech: "",
      rate: 1,
      pitch: 1,
      volume: 0.6,
    },
    beach: {
      label: "Beach scene",
      x: 84,
      y: 18,
      w: 20,
      h: 16,
      anchor: "center",
      kind: "beach",
      speech: "",
      rate: 1,
      pitch: 1,
      volume: 0.25,
    },
    family: {
      label: "Family portrait",
      x: 30,
      y: 72,
      w: 14,
      h: 10,
      anchor: "center",
      kind: "speech",
      speech: "Family. Unity is strength. Our time is now.",
      rate: 0.98,
      pitch: 0.9,
      volume: 1,
    },
  },
  accent: "#22e6ff",
  glow: 0.55,
  hoverScale: 1.18,
  dwellMs: 90,
  stopOnExit: true,
  showHints: true,
  voiceLang: "en-ZA",
  voiceName: "",
  voiceEnabled: true,
  backgroundMotion: true,
  reduceMotion: false,
  mute: false,
  aspect: "1672 / 941",
  fit: "contain",
};

async function loadConfig() {
  let fileCfg = {};
  try {
    const res = await fetch("/defaults.json", {
      headers: { Accept: "application/json" },
    });
    if (res.ok) fileCfg = await res.json();
  } catch {
    /* keep embedded DEFAULT */
  }
  const winCfg = window.RYAN_CONFIG || {};
  return {
    ...DEFAULT,
    ...fileCfg,
    ...winCfg,
    hotspots: {
      ...DEFAULT.hotspots,
      ...(fileCfg.hotspots || {}),
      ...(winCfg.hotspots || {}),
    },
  };
}

const cfg = await loadConfig();

const hero = document.getElementById("hero");
const stage = document.getElementById("stage") || hero;
const regions = document.getElementById("regions");
const signal = document.getElementById("signal");
const hint = document.getElementById("hint");

document.documentElement.style.setProperty("--accent", cfg.accent);
document.documentElement.style.setProperty("--grow", String(cfg.hoverScale));
stage.style.aspectRatio = cfg.aspect || "1672 / 941";
hero.classList.toggle(
  "moving",
  cfg.backgroundMotion &&
    !cfg.reduceMotion &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
);
hint.style.display = cfg.showHints ? "" : "none";

let active = null;
let token = 0;
let dwell = 0;
let ctx = null;
let nodes = [];
let muted = !!cfg.mute;

function status(t) {
  signal.textContent = t;
  signal.classList.toggle("on", !!t);
}

function stop() {
  token++;
  clearTimeout(dwell);
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  nodes.forEach((o) => {
    try {
      o.stop();
    } catch {
      /* ignore */
    }
  });
  nodes = [];
  active = null;
  hero.classList.remove("talking");
  for (const el of regions.children) el.classList.remove("active");
  status("");
}

function synthesized(kind, h) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume().then(() => {});
    const now = ctx.currentTime + 0.03;
    const count = kind === "baby" ? 7 : 26;
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const at = now + i * (kind === "baby" ? 0.36 : 0.12);
      const dur = kind === "baby" ? 0.28 : 0.32;
      osc.type = kind === "baby" ? "sine" : "triangle";
      const f = kind === "baby" ? 315 + 45 * (i % 3) : 95 + (i % 6) * 12;
      osc.frequency.setValueAtTime(f, at);
      osc.frequency.exponentialRampToValueAtTime(f * 0.84, at + dur);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0004, 0.042 * (Number(h.volume) || 0.4)),
        at + 0.04,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + dur + 0.02);
      nodes.push(osc);
    }
  } catch {
    status("Audio engine unavailable");
  }
}

let audioUnlocked = false;

function speak(h) {
  if (!("speechSynthesis" in window) || !cfg.voiceEnabled) {
    status("Speech engine not available in this browser");
    return;
  }
  if (!audioUnlocked) {
    status("Tap Enable audio first, then try again");
    return;
  }
  const utt = new SpeechSynthesisUtterance(h.speech || "");
  utt.lang = cfg.voiceLang || "en-ZA";
  utt.rate = Number(h.rate) || 1;
  utt.pitch = Number(h.pitch) || 1;
  utt.volume = Math.max(0, Math.min(1, Number(h.volume) ?? 1));
  const voices = window.speechSynthesis.getVoices();
  utt.voice =
    voices.find((v) => v.name === cfg.voiceName) ||
    voices.find((v) => v.lang.toLowerCase() === utt.lang.toLowerCase()) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
    null;
  const current = token;
  utt.onstart = () => {
    if (current === token && active === "ryan") hero.classList.add("talking");
  };
  utt.onend = () => {
    if (current === token) {
      hero.classList.remove("talking");
      status("");
    }
  };
  utt.onerror = () => {
    if (current === token) {
      hero.classList.remove("talking");
      status("Speech blocked — try Enable audio, then click the region");
    }
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

function goHref(href) {
  if (!href) return;
  if (href.startsWith("#")) {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      status("Open · " + href.slice(1));
      return;
    }
  }
  window.location.assign(href);
}

function play(id, element) {
  const h = cfg.hotspots[id];
  if (!h) return;

  if (h.kind === "nav" || h.kind === "link") {
    stop();
    active = id;
    element.classList.add("active");
    hint.classList.add("hidden");
    status(h.label + " · go");
    goHref(h.href);
    return;
  }

  if (muted) return;
  if (active === id) return;
  stop();
  active = id;
  element.classList.add("active");
  hint.classList.add("hidden");
  status(h.label + " · " + (h.kind === "speech" ? "voice" : "ambient sound"));
  if (h.kind === "speech") speak(h);
  else {
    if (!audioUnlocked) {
      status("Tap Enable audio first, then try again");
      return;
    }
    synthesized(h.kind, h);
  }
}

for (const [id, h] of Object.entries(cfg.hotspots)) {
  const isChrome = !!h.chrome || h.kind === "nav" || h.kind === "link";
  const el = document.createElement("button");
  el.type = "button";
  el.className = "region" + (isChrome ? " chrome" : " audio");
  el.dataset.id = id;
  el.dataset.kind = h.kind || "speech";
  const action =
    h.kind === "nav" || h.kind === "link" ? "Open " : "Hear ";
  el.setAttribute("aria-label", action + h.label);
  el.innerHTML =
    '<span class="chip" aria-hidden="true"></span><span class="sr"></span>';
  el.querySelector(".chip").textContent = h.label;
  el.querySelector(".sr").textContent = action + h.label;
  el.style.left = h.x + "%";
  el.style.top = h.y + "%";
  el.style.width = h.w + "%";
  el.style.height = h.h + "%";
  if ((h.anchor || "center") === "topleft") {
    el.classList.add("anchor-tl");
  }

  const enter = () => {
    if (isChrome) return;
    clearTimeout(dwell);
    dwell = setTimeout(
      () => play(id, el),
      Math.max(0, Number(cfg.dwellMs) || 0),
    );
  };
  const leave = () => {
    clearTimeout(dwell);
    if (!isChrome && active === id && cfg.stopOnExit) stop();
  };
  el.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "touch") enter();
  });
  el.addEventListener("pointerleave", leave);
  el.addEventListener("focus", enter);
  el.addEventListener("blur", leave);
  el.addEventListener("click", () => {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
    } catch {
      /* ignore */
    }
    play(id, el);
  });
  regions.append(el);
}

document.getElementById("enable").addEventListener("click", async () => {
  muted = false;
  audioUnlocked = true;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    await ctx.resume();
  } catch {
    /* ignore */
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    const u = new SpeechSynthesisUtterance("Audio ready");
    u.volume = 0.01;
    u.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
  status("Audio unlocked · hover or tap a portrait region");
  hint?.classList.add("hidden");
});

document.getElementById("mute").addEventListener("click", (e) => {
  muted = !muted;
  stop();
  e.currentTarget.textContent = muted ? "Unmute" : "Mute";
});

document.getElementById("stop").addEventListener("click", stop);
window.addEventListener("pagehide", stop);
