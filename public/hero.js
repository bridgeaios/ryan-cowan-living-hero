const DEFAULT = {
  hotspots: {
    ryan: {
      label: "Ryan",
      x: 46,
      y: 26,
      w: 19,
      h: 40,
      kind: "speech",
      speech:
        "I love my family and my kids, our time is NOW! They call me Ryanstein in the district!",
      rate: 0.92,
      pitch: 0.82,
      volume: 1,
    },
    kids: {
      label: "Kids",
      x: 22,
      y: 25,
      w: 20,
      h: 20,
      kind: "speech",
      speech: "WE LOVE YOU DADDY!",
      rate: 1.1,
      pitch: 1.6,
      volume: 1,
    },
    baby: {
      label: "Baby",
      x: 48,
      y: 50,
      w: 16,
      h: 25,
      kind: "baby",
      speech: "",
      rate: 1,
      pitch: 1,
      volume: 0.6,
    },
    beach: {
      label: "Beach",
      x: 84,
      y: 27,
      w: 26,
      h: 36,
      kind: "beach",
      speech: "",
      rate: 1,
      pitch: 1,
      volume: 0.25,
    },
    family: {
      label: "Family",
      x: 23,
      y: 79,
      w: 24,
      h: 20,
      kind: "speech",
      speech: "Family. Unity is strength. Our time is now.",
      rate: 0.98,
      pitch: 0.9,
      volume: 1,
    },
  },
  accent: "#22e6ff",
  glow: 0.55,
  hoverScale: 1.25,
  dwellMs: 90,
  stopOnExit: true,
  showHints: true,
  voiceLang: "en-ZA",
  voiceName: "",
  voiceEnabled: true,
  backgroundMotion: true,
  reduceMotion: false,
  mute: false,
  aspect: "1648 / 928",
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
const regions = document.getElementById("regions");
const signal = document.getElementById("signal");
const hint = document.getElementById("hint");

document.documentElement.style.setProperty("--accent", cfg.accent);
document.documentElement.style.setProperty("--grow", String(cfg.hoverScale));
hero.style.aspectRatio = cfg.aspect || "1648 / 928";
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

function play(id, element) {
  if (muted) return;
  if (active === id) return;
  stop();
  const h = cfg.hotspots[id];
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
  const el = document.createElement("button");
  el.type = "button";
  el.className = "region";
  el.dataset.id = id;
  el.setAttribute("aria-label", "Hear " + h.label);
  el.innerHTML = '<span class="sr"></span>';
  el.firstChild.textContent = "Hear " + h.label;
  el.style.left = h.x + "%";
  el.style.top = h.y + "%";
  el.style.width = h.w + "%";
  el.style.height = h.h + "%";
  const enter = () => {
    clearTimeout(dwell);
    dwell = setTimeout(
      () => play(id, el),
      Math.max(0, Number(cfg.dwellMs) || 0),
    );
  };
  const leave = () => {
    clearTimeout(dwell);
    if (active === id && cfg.stopOnExit) stop();
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
  status("Audio unlocked · hover or tap a glowing region");
  hint?.classList.add("hidden");
});

document.getElementById("mute").addEventListener("click", (e) => {
  muted = !muted;
  stop();
  e.currentTarget.textContent = muted ? "Unmute" : "Mute";
});

document.getElementById("stop").addEventListener("click", stop);
window.addEventListener("pagehide", stop);
