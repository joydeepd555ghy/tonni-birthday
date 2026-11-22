/**
 * Desktop heart & sparkle cursor trail + mobile tap ripple hearts.
 * Uses inline SVG elements (no emoji) and respects prefers-reduced-motion.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const HEART_SVG =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path fill="currentColor" d="M12 21s-8.5-5.6-8.5-11.5C3.5 6.4 5.9 4 8.8 4c1.7 0 3.2.9 3.2 2.3C12 4.9 13.5 4 15.2 4 18.1 4 20.5 6.4 20.5 9.5 20.5 15.4 12 21 12 21Z"/></svg>';
  const SPARKLE_SVG =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path fill="currentColor" d="M12 1L14.4 9.6L23 12L14.4 14.4L12 23L9.6 14.4L1 12L9.6 9.6Z"/></svg>';

  const COLORS = ["#ff7a9c", "#f2c36b", "#ffd0dc"];
  let lastMoveTime = 0;

  // Desktop mouse cursor trail
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType !== "mouse") return;
        const now = performance.now();
        if (now - lastMoveTime < 55) return;
        lastMoveTime = now;

        const el = document.createElement("span");
        el.className = "cursor-trail-item";
        const size = 10 + Math.random() * 6;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.color = COLORS[(Math.random() * COLORS.length) | 0];
        el.style.setProperty("--tx", `${(Math.random() - 0.5) * 26}px`);
        el.style.setProperty("--ty", `${-16 - Math.random() * 20}px`);
        el.innerHTML = Math.random() > 0.45 ? SPARKLE_SVG : HEART_SVG;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 860);
      },
      { passive: true }
    );
  }

  // Tap ripple hearts (mobile & desktop click)
  window.addEventListener(
    "pointerdown",
    (e) => {
      const count = e.pointerType === "touch" ? 3 : 2;
      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        el.className = "tap-ripple-heart";
        el.style.left = `${e.clientX + (Math.random() - 0.5) * 18}px`;
        el.style.top = `${e.clientY + (Math.random() - 0.5) * 14}px`;
        el.style.color = COLORS[i % COLORS.length];
        el.innerHTML = HEART_SVG;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 860);
      }
    },
    { passive: true }
  );
})();
