const STORAGE_THEME_KEY = "pixelcritic_theme";

const reviewSections = [
  {
    id: "critical_thinking",
    title: "The Research Tree",
    text:
      "The game's 'research tree' is deep. I had to evaluate raw data from the South Texas Map and synthesize it with high-level academix lore like the 'Frisancho' and 'Lucardi' scrolls to unlock the Effective thinking ability. ",
  },
  {
    id: "written_communication",
    title: "The Diplomat's Scroll",
    text:
      "In the 'Written Communication' questline, word choice matters. I had to draft a 'Diplomat’s Scroll' to the Board of Education NPC. If my tone was too low-level, the proposal would have been rejected. I had to use the 'Policy Reform' dialogue path to ensure success" 
  },
  {
    id: "oral_communication",
    title: "The Podcast Tavern",
    text:
      "The 'Podcast Tavern' level required a different 'Charisma' stat. I initially tried a formal script, but the 'Spoken Flow' mechanic penalized me for sounding robotic. I had to reskill into a casual tone to effectively broadcast the message to the community"
  },
  {
    id: "visual_communication",
    title: "HUD & UI Design",
    text:
      "The visual UI (Infographic) is sleek. I utilized 'Color Coding' (Green for growth) and 'Hierarchy' to guide the player’s eye to the most critical stat: the $188,200 wealth gap",
  },
  {
    id: "teamwork",
    title: "The Multiplayer Raid",
    text:
      "The 'Multiplayer' mechanics are essential. Whether it was coordinating '2v2 decks' or receiving 'Peer Review' buffs on my survey questions, working with the 'Party' helped me overcome bosses (complex assignments) I couldn't solo.",
  },
  {
    id: "personal_responsibility",
    title: "The Moral Alignment Compass",
    text:
      "Every action in this game has a consequence. The 'Personal Responsibility' mechanic forced me to look at the 'Snowball Effect' of poverty and make the ethical choice to advocate for those at a disadvantage. My alignment shifted toward 'Advocacy' as I connected my research to real-world change",
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function setTheme(nextTheme) {
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  setTheme(current === "dark" ? "light" : "dark");
}

function initTheme() {
  const stored = localStorage.getItem(STORAGE_THEME_KEY);
  if (stored === "light" || stored === "dark") {
    setTheme(stored);
    return;
  }

  const prefersLight =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

function renderSections() {
  const host = document.getElementById("sections");
  if (!host) return;

  const frag = document.createDocumentFragment();

  for (const s of reviewSections) {
    const article = document.createElement("article");
    article.className = "section";
    article.id = `sec-${s.id}`;

    const h = document.createElement("h3");
    h.className = "section__h";
    h.textContent = s.title;

    const p = document.createElement("p");
    p.className = "section__p";
    p.textContent = s.text;

    article.append(h, p);
    frag.append(article);
  }

  host.replaceChildren(frag);
}

function initMobileNav() {
  const btn = document.querySelector(".nav__toggle");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;

  function setOpen(isOpen) {
    btn.setAttribute("aria-expanded", String(isOpen));
    links.classList.toggle("is-open", isOpen);
  }

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  links.addEventListener("click", (e) => {
    const a = e.target instanceof HTMLElement ? e.target.closest("a") : null;
    if (a) setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) setOpen(false);
  });
}

async function copyShareLink() {
  const url = `${location.origin}${location.pathname}#review`;
  try {
    await navigator.clipboard.writeText(url);
    flashChip("copyBtn", "Copied");
  } catch {
    flashChip("copyBtn", "Copy failed");
  }
}

function flashChip(id, text) {
  const btn = document.getElementById(id);
  if (!btn) return;
  const label = btn.querySelector(".chip__text");
  if (!(label instanceof HTMLElement)) return;

  const before = label.textContent || "";
  label.textContent = text;
  btn.disabled = true;
  window.setTimeout(() => {
    label.textContent = before;
    btn.disabled = false;
  }, 900);
}

function initScoreMeter() {
  const scoreNumEl = document.getElementById("scoreNum");
  const scoreBigEl = document.getElementById("scoreBig");
  const bar = document.getElementById("meterBar");

  const score = clamp(Number(scoreNumEl?.textContent ?? 0), 0, 10);
  if (scoreBigEl) scoreBigEl.textContent = score.toFixed(1);

  const pct = (score / 10) * 100;
  if (bar) {
    window.requestAnimationFrame(() => {
      bar.style.width = `${pct}%`;
    });
  }
}

function init() {
  initTheme();
  renderSections();
  initMobileNav();
  initScoreMeter();

  document.getElementById("themeBtn")?.addEventListener("click", toggleTheme);
  document.getElementById("copyBtn")?.addEventListener("click", copyShareLink);
}

document.addEventListener("DOMContentLoaded", init);

