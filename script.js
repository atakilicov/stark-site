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
