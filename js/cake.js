/**
 * Cake module:
 *  - Sequential candle blow-out with smoke curl, applause & cracker celebration
 */
(function () {
  let candlesOut = false;
  const $ = (id) => document.getElementById(id);

  function blowOutCandles() {
    if (candlesOut) {
      relightCandles();
      return;
    }
    candlesOut = true;

    if (window.SiteMusic && window.SiteMusic.duck) {
      window.SiteMusic.duck(0.16);
    }
    if (window.SiteSFX) window.SiteSFX.blowOut();

    const cfg = window.SITE_CONFIG?.cake || {};
    const candles = Array.from(document.querySelectorAll("#candles-group .candle"));

    candles.forEach((c, idx) => {
      setTimeout(() => {
        c.classList.add("out");
      }, idx * 170);
    });

    const glow = $("cake-candle-glow");
    if (glow) {
      setTimeout(() => glow.classList.add("dimmed"), candles.length * 140);
    }

    const finishDelay = candles.length * 170 + 180;
    setTimeout(() => {
      const wish = $("wish-message");
      if (wish) wish.hidden = false;

      if (window.SiteParticles) {
        const svg = $("cake-svg");
        const rect = svg ? svg.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + 40;
        window.SiteParticles.burst(cx, cy, 55, 0.55);
        if (window.SiteParticles.crackerShow) {
          window.SiteParticles.crackerShow();
        } else {
          window.SiteParticles.heartRain(18);
        }
      }

      const bnSpan = $("blow-btn-bn");
      const enSpan = $("blow-btn-en");
      if (bnSpan) bnSpan.textContent = cfg.relightLabel || "Light candles again";
      if (enSpan) enSpan.textContent = "";

      setTimeout(() => {
        if (window.SiteMusic && window.SiteMusic.unduck) {
          window.SiteMusic.unduck();
        }
      }, 3600);
    }, finishDelay);
  }

  function relightCandles() {
    candlesOut = false;
    const cfg = window.SITE_CONFIG?.cake || {};
    document.querySelectorAll("#candles-group .candle").forEach((c) => c.classList.remove("out"));
    const glow = $("cake-candle-glow");
    if (glow) glow.classList.remove("dimmed");
    const wish = $("wish-message");
    if (wish) wish.hidden = true;

    const bnSpan = $("blow-btn-bn");
    const enSpan = $("blow-btn-en");
    if (bnSpan) bnSpan.textContent = cfg.blowBtnBn || "ফুঁ দাও";
    if (enSpan) enSpan.textContent = cfg.blowBtnEn || "Blow the candles";
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("blow-btn")?.addEventListener("click", blowOutCandles);
  });
})();
