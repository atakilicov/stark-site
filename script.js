const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealNodes = document.querySelectorAll(".reveal");
const modeButtons = document.querySelectorAll(".mode-button");
const modeResult = document.querySelector("[data-mode-result]");
const tiltTargets = document.querySelectorAll("[data-tilt]");
const parallaxTargets = document.querySelectorAll("[data-parallax]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const modeCopy = {
  Topic: "Invoices, photos, videos, docs, and projects land in folders that match what they are about.",
  Type: "Images, videos, audio, spreadsheets, archives, and documents become clean type-based groups.",
  Date: "Files can be grouped by created month or year, so old work and fresh work stop living together."
};

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Split headings into per-word spans for staggered entrance.
if (!reduceMotion) {
  const headings = document.querySelectorAll("main h2, [data-split]");
  headings.forEach((heading) => {
    if (heading.dataset.splitDone) return;
    const words = heading.textContent.trim().split(/\s+/);
    heading.textContent = "";
    heading.dataset.split = "";
    words.forEach((word, index) => {
      const line = document.createElement("span");
      line.className = "split-line";
      const inner = document.createElement("span");
      inner.className = "split-word";
      inner.style.setProperty("--word-index", index);
      inner.textContent = word;
      line.appendChild(inner);
      heading.appendChild(line);
      if (index < words.length - 1) heading.appendChild(document.createTextNode(" "));
    });
    heading.dataset.splitDone = "true";
  });
}

// Stagger sibling reveals inside grouped sections.
document.querySelectorAll(".intro-strip, .plan-grid").forEach((group) => {
  group.querySelectorAll(".reveal").forEach((node, index) => {
    node.style.setProperty("--reveal-delay", `${index * 110}ms`);
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  const animatedNodes = new Set([
    ...revealNodes,
    ...document.querySelectorAll("[data-split]")
  ]);
  animatedNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
  document.querySelectorAll("[data-split]").forEach((node) => node.classList.add("is-visible"));
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;

    modeButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    if (modeResult && modeCopy[mode]) {
      modeResult.textContent = modeCopy[mode];
    }
  });
});

tiltTargets.forEach((target) => {
  target.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 980px)").matches) return;

    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    target.style.setProperty("--rx", `${(-y * 3).toFixed(2)}deg`);
    target.style.setProperty("--ry", `${(x * 3).toFixed(2)}deg`);
  });

  target.addEventListener("pointerleave", () => {
    target.style.setProperty("--rx", "0deg");
    target.style.setProperty("--ry", "0deg");
  });
});

/* ═══════════════════════════════════════════
   GATHER ANIMATION — scattered files → folders
   ═══════════════════════════════════════════ */

const stage = document.getElementById("gather-stage");
if (stage) initGather();

function initGather() {
  const scrollEl = document.getElementById("gather-scroll");
  const hintEl   = document.querySelector("[data-scroll-hint]");
  const sloganEl = document.querySelector("[data-gather-slogan]");

  const files = [
    { name: "Screenshot 09-14.png",  ext: "PNG",  type: "image",   folder: "Screenshots" },
    { name: "Invoice-April.pdf",      ext: "PDF",  type: "pdf",     folder: "Documents" },
    { name: "hero-animation.ts",      ext: "TS",   type: "code",    folder: "Code" },
    { name: "Q1-Revenue.xlsx",        ext: "XLSX", type: "sheet",   folder: "Spreadsheets" },
    { name: "IMG_4807.HEIC",          ext: "HEIC", type: "image",   folder: "Photos" },
    { name: "Backup-Export.zip",      ext: "ZIP",  type: "archive", folder: "Archives" },
    { name: "Roadmap.key",            ext: "KEY",  type: "pres",    folder: "Presentations" },
    { name: "preview.jsx",            ext: "JSX",  type: "code",    folder: "Code" },
    { name: "Screenshot 09-18.png",   ext: "PNG",  type: "image",   folder: "Screenshots" },
    { name: "client-logos.zip",       ext: "ZIP",  type: "archive", folder: "Archives" },
    { name: "Contract.docx",          ext: "DOCX", type: "doc",     folder: "Documents" },
    { name: "script.swift",           ext: "SWIFT",type: "code",    folder: "Code" },
    { name: "moodboard.jpg",          ext: "JPG",  type: "image",   folder: "Photos" },
    { name: "conference.key",         ext: "KEY",  type: "pres",    folder: "Presentations" },
    { name: "pricing.csv",            ext: "CSV",  type: "sheet",   folder: "Spreadsheets" },
    { name: "notes.txt",              ext: "TXT",  type: "doc",     folder: "Documents" },
    { name: "IMG_4810.HEIC",          ext: "HEIC", type: "image",   folder: "Photos" },
    { name: "readme.md",              ext: "MD",   type: "code",    folder: "Code" },
    { name: "receipt.pdf",            ext: "PDF",  type: "pdf",     folder: "Documents" },
    { name: "wireframe.png",          ext: "PNG",  type: "image",   folder: "Photos" },
    { name: "demo.mp4",               ext: "MP4",  type: "video",   folder: "Videos" },
    { name: "budget.numbers",         ext: "NUM",  type: "sheet",   folder: "Spreadsheets" },
    { name: ".DS_Store",              ext: "",     type: "misc",    folder: "Other" },
    { name: "archive-old.tar",        ext: "TAR",  type: "archive", folder: "Archives" },
  ];

  const folderNames = [...new Set(files.map(f => f.folder))];

  const rng = mulberry32(42);
  const chaosPositions = files.map(() => ({
    x: rng() * 60 + 10,
    y: rng() * 56 + 16,
    rot: (rng() - 0.5) * 18,
  }));

  const folderSlots = folderNames.map((name, i) => {
    const cols = Math.min(folderNames.length, getColCount());
    const rows = Math.ceil(folderNames.length / cols);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const rowSpacing = 18;
    const totalGridH = (rows - 1) * rowSpacing;
    const startY = (100 - totalGridH) / 2 + 4;
    return {
      name,
      xPct: ((col + 0.5) / cols) * 80 + 10,
      yPct: startY + row * rowSpacing,
      count: files.filter(f => f.folder === name).length,
    };
  });

  const fileEls = files.map((f, i) => {
    const el = document.createElement("div");
    el.className = `mac-file type-${f.type}`;
    el.innerHTML = `
      <div class="mac-file-icon" data-ext="${f.ext}"><div class="file-stripe"></div></div>
      <span class="mac-file-name">${f.name}</span>
    `;
    stage.appendChild(el);
    return { el, file: f, chaos: chaosPositions[i], folderIdx: folderNames.indexOf(f.folder) };
  });

  const folderEls = folderSlots.map((slot) => {
    const el = document.createElement("div");
    el.className = "mac-folder";
    el.innerHTML = `
      <div class="mac-folder-icon"><span class="mac-folder-badge">0</span></div>
      <span class="mac-folder-name">${slot.name}</span>
    `;
    stage.appendChild(el);
    return { el, slot, badge: el.querySelector(".mac-folder-badge") };
  });

  requestAnimationFrame(function tick() {
    const progress = getScrollProgress(scrollEl);
    update(progress);
    requestAnimationFrame(tick);
  });

  function update(p) {
    const stageW = stage.offsetWidth;
    const stageH = stage.offsetHeight;

    if (hintEl) hintEl.classList.toggle("is-hidden", p > 0.04);

    const cols = Math.min(folderNames.length, getColCount());
    const rows = Math.ceil(folderNames.length / cols);
    const folderAppear = clamp((p - 0.18) / 0.12, 0, 1);

    folderSlots.forEach((slot, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const rowSpacing = 18;
      const totalGridH = (rows - 1) * rowSpacing;
      const startY = (100 - totalGridH) / 2 + 4;
      slot.xPct = ((col + 0.5) / cols) * 80 + 10;
      slot.yPct = startY + row * rowSpacing;
    });

    folderEls.forEach((fData) => {
      const slot = fData.slot;
      const el = fData.el;
      const x = (slot.xPct / 100) * stageW - 42;
      const y = (slot.yPct / 100) * stageH - 30;
      const ease = easeOutCubic(folderAppear);
      el.style.transform = `translate(${x}px, ${lerp(y + 40, y, ease)}px)`;
      el.style.opacity = String(folderAppear);

      const countProgress = clamp((p - 0.45) / 0.45, 0, 1);
      const movedIn = Math.round(countProgress * slot.count);
      if (movedIn > 0) {
        fData.badge.textContent = String(movedIn);
        fData.badge.classList.add("is-visible");
      } else {
        fData.badge.classList.remove("is-visible");
      }
    });

    fileEls.forEach((fData, i) => {
      const el = fData.el;
      const chaos = fData.chaos;
      const slot = folderSlots[fData.folderIdx];

      const stagger = i / files.length;
      const gatherStart = 0.22 + stagger * 0.20;
      const gatherEnd   = 0.55 + stagger * 0.25;
      const local = clamp((p - gatherStart) / (gatherEnd - gatherStart), 0, 1);
      const eased = easeInOutCubic(local);

      const sx = (chaos.x / 100) * stageW - 38;
      const sy = (chaos.y / 100) * stageH - 34;
      const tx = (slot.xPct / 100) * stageW - 38;
      const ty = (slot.yPct / 100) * stageH - 50;

      const arc = Math.sin(local * Math.PI) * -40;
      const x = lerp(sx, tx, eased);
      const y = lerp(sy, ty, eased) + arc;
      const rot = lerp(chaos.rot, 0, eased);
      const scale = lerp(1, 0.65, eased);
      const opacity = local > 0.88 ? lerp(1, 0, (local - 0.88) / 0.12) : 1;

      const drift = local < 0.01 ? 1 : 0;
      const now = performance.now();
      const dx = Math.sin(now / 2000 + i * 1.1) * 3 * drift;
      const dy = Math.cos(now / 2600 + i * 0.8) * 2 * drift;

      el.style.transform = `translate(${x + dx}px, ${y + dy}px) rotate(${rot}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
    });

    if (sloganEl) sloganEl.classList.toggle("is-visible", p > 0.82);
  }

  function getColCount() {
    const w = stage.offsetWidth;
    if (w < 480) return 3;
    if (w < 720) return 4;
    if (w < 960) return 5;
    return 6;
  }

  function getScrollProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const total = Math.max(1, el.offsetHeight - window.innerHeight);
    return clamp(-rect.top, 0, total) / total;
  }
}

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Scroll-driven parallax: shots drift as they pass through the viewport.
if (!reduceMotion && parallaxTargets.length) {
  let ticking = false;

  const applyParallax = () => {
    const viewport = window.innerHeight;
    parallaxTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      const shift = Math.max(-40, Math.min(40, progress * -46));
      target.style.setProperty("--py", `${shift.toFixed(1)}px`);
    });
    ticking = false;
  };

  const requestParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyParallax);
  };

  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax, { passive: true });
  applyParallax();
}
