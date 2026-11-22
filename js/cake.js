/**
 * Cake module:
 *  - Stage 1: Sequential candle blow-out with smoke curl, dimming candlelight, applause & crackers
 *  - Stage 2: Interactive golden cake knife cut + frosted slice pop-out ("First bite for Maharani!")
 */
(function () {
  let candlesOut = false;
  let cakeCut = false;
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
      const cutBtn = $("cut-cake-btn");
      if (wish) wish.hidden = false;
      if (cutBtn && !cakeCut) cutBtn.hidden = false;

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

  function cutTheCake() {
    if (cakeCut) return;
    cakeCut = true;

    const knife = $("cake-knife");
    const slice = $("cake-slice");
    const cutBtn = $("cut-cake-btn");
    const biteBanner = $("cake-bite-banner");

    if (knife) knife.classList.add("cutting");
    if (slice) slice.classList.add("sliced");
    if (cutBtn) cutBtn.hidden = true;

    if (window.SiteSFX) {
      window.SiteSFX.matchFanfare();
      if (window.SiteSFX.applause) window.SiteSFX.applause();
    }

    if (window.SiteParticles) {
      const svg = $("cake-svg");
      const rect = svg ? svg.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
      window.SiteParticles.burst(rect.left + rect.width / 2, rect.top + rect.height * 0.55, 52, 0.8);
      window.SiteParticles.heartRain(20);
    }

    setTimeout(() => {
      if (knife) knife.classList.remove("cutting");
      if (biteBanner) biteBanner.hidden = false;
    }, 650);
  }

  function relightCandles() {
    candlesOut = false;
    cakeCut = false;
    const cfg = window.SITE_CONFIG?.cake || {};
    document.querySelectorAll("#candles-group .candle").forEach((c) => c.classList.remove("out"));
    $("cake-candle-glow")?.classList.remove("dimmed");
    $("cake-knife")?.classList.remove("cutting");
    $("cake-slice")?.classList.remove("sliced");
    const wish = $("wish-message");
    const cutBtn = $("cut-cake-btn");
    const biteBanner = $("cake-bite-banner");
    if (wish) wish.hidden = true;
    if (cutBtn) cutBtn.hidden = true;
    if (biteBanner) biteBanner.hidden = true;

    const bnSpan = $("blow-btn-bn");
    const enSpan = $("blow-btn-en");
    if (bnSpan) bnSpan.textContent = cfg.blowBtnBn || "ফুঁ দাও";
    if (enSpan) enSpan.textContent = cfg.blowBtnEn || "Blow the candles";
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("blow-btn")?.addEventListener("click", blowOutCandles);
    $("cut-cake-btn")?.addEventListener("click", cutTheCake);
  });
})();
