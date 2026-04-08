/* ═══════════════════════════════════════════
   Stark – Landing Page Script
   ═══════════════════════════════════════════ */

/* ── Rotating hero prompt ── */

const prompts = [
  "organize by date",
  "sort by file type",
  "group invoices and contracts",
  "tarihe gore grupla",
  "move large files to archive"
];

const promptTarget = document.querySelector("[data-rotating-prompt]");
if (promptTarget) {
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % prompts.length;
    promptTarget.textContent = prompts[idx];
  }, 2600);
}

/* ── Reveal on scroll ── */

const revealNodes = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.18 });
  revealNodes.forEach((n) => obs.observe(n));
} else {
  revealNodes.forEach((n) => n.classList.add("is-visible"));
}

/* ── Mobile nav ── */

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  siteNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => { siteNav.classList.remove("is-open"); menuToggle.setAttribute("aria-expanded","false"); });
  });
}

/* ═══════════════════════════════════════════
   GATHER ANIMATION — scattered files → folders
   ═══════════════════════════════════════════ */

const stage = document.getElementById("gather-stage");
if (stage) initGather();

function initGather() {
  const scrollEl = document.getElementById("gather-scroll");
  const hintEl  = document.querySelector("[data-scroll-hint]");
  const sloganEl = document.querySelector("[data-gather-slogan]");

  /* ── File data ── */
  const files = [
    { name: "Screenshot 09-14.png",   ext: "PNG",  type: "image",   folder: "Screenshots" },
    { name: "Invoice-April.pdf",       ext: "PDF",  type: "pdf",     folder: "Documents" },
    { name: "hero-animation.ts",       ext: "TS",   type: "code",    folder: "Code" },
    { name: "Q1-Revenue.xlsx",         ext: "XLSX", type: "sheet",   folder: "Spreadsheets" },
    { name: "IMG_4807.HEIC",           ext: "HEIC", type: "image",   folder: "Photos" },
    { name: "Backup-Export.zip",       ext: "ZIP",  type: "archive", folder: "Archives" },
    { name: "Roadmap.key",             ext: "KEY",  type: "pres",    folder: "Presentations" },
    { name: "preview.jsx",             ext: "JSX",  type: "code",    folder: "Code" },
    { name: "Screenshot 09-18.png",    ext: "PNG",  type: "image",   folder: "Screenshots" },
    { name: "client-logos.zip",        ext: "ZIP",  type: "archive", folder: "Archives" },
    { name: "Contract.docx",           ext: "DOCX", type: "doc",     folder: "Documents" },
    { name: "script.swift",            ext: "SWIFT",type: "code",    folder: "Code" },
    { name: "moodboard.jpg",           ext: "JPG",  type: "image",   folder: "Photos" },
    { name: "conference.key",          ext: "KEY",  type: "pres",    folder: "Presentations" },
    { name: "pricing.csv",             ext: "CSV",  type: "sheet",   folder: "Spreadsheets" },
    { name: "notes.txt",               ext: "TXT",  type: "doc",     folder: "Documents" },
    { name: "IMG_4810.HEIC",           ext: "HEIC", type: "image",   folder: "Photos" },
    { name: "readme.md",               ext: "MD",   type: "code",    folder: "Code" },
    { name: "receipt.pdf",             ext: "PDF",  type: "pdf",     folder: "Documents" },
    { name: "wireframe.png",           ext: "PNG",  type: "image",   folder: "Photos" },
    { name: "demo.mp4",               ext: "MP4",  type: "video",   folder: "Videos" },
    { name: "budget.numbers",          ext: "NUM",  type: "sheet",   folder: "Spreadsheets" },
    { name: ".DS_Store",               ext: "",     type: "misc",    folder: "Other" },
    { name: "archive-old.tar",         ext: "TAR",  type: "archive", folder: "Archives" },
  ];

  /* Unique folder names in order */
  const folderNames = [...new Set(files.map(f => f.folder))];

  /* ── Seed random positions for chaos state ── */
  const rng = mulberry32(42); // deterministic so layout doesn't shift on reload
  const chaosPositions = files.map(() => ({
    x: rng() * 64 + 8,   // 8% – 72% of stage width (safe margins)
    y: rng() * 52 + 14,  // 14% – 66% of stage height (below menubar, above dock)
    rot: (rng() - 0.5) * 22, // -11° – +11°
  }));

  /* ── Folder grid positions (centered) ── */
  const folderSlots = folderNames.map((name, i) => {
    const cols = Math.min(folderNames.length, getColCount());
    const rows = Math.ceil(folderNames.length / cols);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const rowSpacing = 18;
    const totalGridH = (rows - 1) * rowSpacing;
    const startY = (100 - totalGridH) / 2 + 4; // +4 to offset menubar
    return {
      name,
      xPct: ((col + 0.5) / cols) * 80 + 10,
      yPct: startY + row * rowSpacing,
      count: files.filter(f => f.folder === name).length,
    };
  });

  /* ── Build DOM ── */
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

  /* ── Animation loop ── */
  let prevPhase = "";
  requestAnimationFrame(function tick() {
    const progress = getScrollProgress(scrollEl);
    update(progress);
    requestAnimationFrame(tick);
  });

  function update(p) {
    const stageW = stage.offsetWidth;
    const stageH = stage.offsetHeight;

    /* Hint fades out after slight scroll */
    if (hintEl) hintEl.classList.toggle("is-hidden", p > 0.04);

    /* Recalculate folder grid for current size */
    const cols = Math.min(folderNames.length, getColCount());
    const rows = Math.ceil(folderNames.length / cols);

    /* ── Folders: appear from ~25% ── */
    const folderAppear = clamp((p - 0.18) / 0.12, 0, 1); // 0 at 18%, 1 at 30%

    folderSlots.forEach((slot, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const rowSpacing = 18;
      const totalGridH = (rows - 1) * rowSpacing;
      const startY = (100 - totalGridH) / 2 + 4;
      slot.xPct = ((col + 0.5) / cols) * 80 + 10;
      slot.yPct = startY + row * rowSpacing;
    });

    folderEls.forEach((fData, i) => {
      const slot = fData.slot;
      const el = fData.el;
      const x = (slot.xPct / 100) * stageW - 42;
      const y = (slot.yPct / 100) * stageH - 30;
      const ease = easeOutCubic(folderAppear);
      const startY = y + 40;

      el.style.transform = `translate(${x}px, ${lerp(startY, y, ease)}px)`;
      el.style.opacity = String(folderAppear);

      /* Badge count */
      const countProgress = clamp((p - 0.45) / 0.45, 0, 1);
      const movedIn = Math.round(countProgress * slot.count);
      const badge = fData.badge;
      if (movedIn > 0) {
        badge.textContent = String(movedIn);
        badge.classList.add("is-visible");
      } else {
        badge.classList.remove("is-visible");
      }
    });

    /* ── Files: chaos → gather → land ── */
    fileEls.forEach((fData, i) => {
      const el = fData.el;
      const chaos = fData.chaos;
      const slot = folderSlots[fData.folderIdx];

      /* Each file has a staggered start/end for the gather phase */
      const stagger = i / files.length;
      const gatherStart = 0.22 + stagger * 0.20;  // 22% – 42%
      const gatherEnd   = 0.55 + stagger * 0.25;  // 55% – 80%
      const local = clamp((p - gatherStart) / (gatherEnd - gatherStart), 0, 1);
      const eased = easeInOutCubic(local);

      /* Source (chaos) in px */
      const sx = (chaos.x / 100) * stageW - 38;
      const sy = (chaos.y / 100) * stageH - 34;

      /* Target (folder center) in px */
      const tx = (slot.xPct / 100) * stageW - 38;
      const ty = (slot.yPct / 100) * stageH - 50;

      /* Arc: files fly up a bit mid-flight */
      const arc = Math.sin(local * Math.PI) * -40;

      const x = lerp(sx, tx, eased);
      const y = lerp(sy, ty, eased) + arc;
      const rot = lerp(chaos.rot, 0, eased);
      const scale = lerp(1, 0.65, eased);
      const opacity = local > 0.88 ? lerp(1, 0, (local - 0.88) / 0.12) : 1;

      /* Subtle idle drift before gathering */
      const drift = local < 0.01 ? 1 : 0;
      const now = performance.now();
      const dx = Math.sin(now / 2000 + i * 1.1) * 3 * drift;
      const dy = Math.cos(now / 2600 + i * 0.8) * 2 * drift;

      el.style.transform = `translate(${x + dx}px, ${y + dy}px) rotate(${rot}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
    });

    /* ── Slogan: fade in when gather is ~85% done ── */
    if (sloganEl) {
      sloganEl.classList.toggle("is-visible", p > 0.82);
    }
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

/* ── Math helpers ── */

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

/* Deterministic PRNG (Mulberry32) so chaos positions are stable across reloads */
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
