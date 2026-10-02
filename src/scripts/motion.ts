// Reveals content as it scrolls into view and drives the pointer glow on
// glass cards. html.motion is set before first paint by Head; if this
// script never runs, Head removes the class again so nothing stays hidden.

const REVEAL = [
  "main .page-head > *",
  "main .hero > *",
  "main .section-head",
  "main .grid-apps > *",
  "main .grid-3 > *",
  "main .paths > *",
  "main .posts > *",
  "main .list > *",
  "main .shots > *",
  "main .split > *",
  "main .launch",
  "main .newsletter",
  "main .group",
].join(",");

const root = document.documentElement;
(window as unknown as { __fpMotion: boolean }).__fpMotion = true;

function reveal(el: HTMLElement, index: number) {
  el.style.setProperty("--i", String(Math.min(index, 6)));
  el.classList.add("is-in");
  // Drop the stagger once revealed so hover transitions respond immediately.
  window.setTimeout(() => el.style.removeProperty("--i"), 1600);
}

if (root.classList.contains("motion")) {
  const targets = [...document.querySelectorAll<HTMLElement>(REVEAL)];
  if (!("IntersectionObserver" in window)) {
    root.classList.remove("motion");
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
          .forEach((el, i) => {
            reveal(el, i);
            observer.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));
  }
}

// Pointer glow: track the cursor position inside whichever glass card it is over.
document.addEventListener(
  "pointermove",
  (event) => {
    const card = (event.target as Element | null)?.closest?.<HTMLElement>(".glass");
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - box.left}px`);
    card.style.setProperty("--my", `${event.clientY - box.top}px`);
  },
  { passive: true },
);
