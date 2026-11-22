/**
 * Letter module:
 *  - Sealed envelope with wax heart
 *  - Tap breaks seal, opens flap, raises paper, and writes text in handwriting style
 *  - Grapheme-safe typing for Bengali + English, followed by hand-drawn heart underline
 */
(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let opened = false;
  let typingCancelled = false;
  let typingTimer = null;

  const $ = (id) => document.getElementById(id);

  function segmentGraphemes(text) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      return Array.from(seg.segment(text), (s) => s.segment);
    }
    return Array.from(text);
  }

  function renderFullLetter() {
    const cfg = window.SITE_CONFIG?.letter || {};
    const body = $("letter-body");
    const sig = $("letter-signature");
    const skipBtn = $("letter-skip-btn");
    if (!body) return;

    clearTimeout(typingTimer);
    typingCancelled = true;
    body.innerHTML = "";

    (cfg.paragraphs || []).forEach((para) => {
      const p = document.createElement("p");
      p.setAttribute("lang", para.lang || "en");
      p.textContent = para.text;
      body.appendChild(p);
    });

    if (sig) sig.classList.add("signed");
    if (skipBtn) skipBtn.hidden = true;
  }

  function typeLetter() {
    const cfg = window.SITE_CONFIG?.letter || {};
    const body = $("letter-body");
    const sig = $("letter-signature");
    const skipBtn = $("letter-skip-btn");
    if (!body) return;

    if (reducedMotion) {
      renderFullLetter();
      return;
    }

    body.innerHTML = "";
    if (skipBtn) {
      skipBtn.textContent = cfg.skipTypingLabel || "Show full letter";
      skipBtn.hidden = false;
      skipBtn.onclick = renderFullLetter;
    }

    const paragraphs = cfg.paragraphs || [];
    let pIdx = 0;

    function nextParagraph() {
      if (typingCancelled) return;
      if (pIdx >= paragraphs.length) {
        if (sig) sig.classList.add("signed");
        if (skipBtn) skipBtn.hidden = true;
        return;
      }

      const para = paragraphs[pIdx++];
      const p = document.createElement("p");
      p.setAttribute("lang", para.lang || "en");
      body.appendChild(p);

      const graphemes = segmentGraphemes(para.text || "");
      let gIdx = 0;

      function stepChar() {
        if (typingCancelled) return;
        if (gIdx < graphemes.length) {
          p.textContent += graphemes[gIdx++];
          typingTimer = setTimeout(stepChar, para.lang === "bn" ? 26 : 18);
        } else {
          typingTimer = setTimeout(nextParagraph, 240);
        }
      }
      stepChar();
    }

    nextParagraph();
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;

    const wrapper = $("envelope-wrapper");
    const seal = $("wax-seal-btn");
    if (!wrapper || !seal) return;

    seal.classList.add("broken");
    wrapper.classList.add("opening");

    if (window.SiteParticles) {
      const rect = seal.getBoundingClientRect();
      window.SiteParticles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 26, 0.75);
    }

    setTimeout(() => {
      wrapper.classList.add("opened");
      typeLetter();
    }, 520);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const cfg = window.SITE_CONFIG?.letter || {};
    const sal = $("letter-salutation");
    const cbn = $("letter-closing-bn");
    const cen = $("letter-closing-en");
    const hint = $("wax-hint");

    if (sal) sal.textContent = cfg.salutation || "My dearest Tonni,";
    if (cbn) cbn.textContent = cfg.closingBn || "ইতি তোমার জয়দীপ";
    if (cen) cen.textContent = cfg.closingEn || "Forever yours, Joydeep Debnath";
    if (hint) hint.textContent = cfg.tapPrompt || "Tap the seal to open";

    $("wax-seal-btn")?.addEventListener("click", openEnvelope);
  });
})();
