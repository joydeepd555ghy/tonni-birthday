/**
 * Cake module:
 *  - Sequential candle blow-out with smoke curl & confetti/heart burst
 *  - Optional Web Audio microphone blow detection (requested only on tap)
 */
(function () {
  let candlesOut = false;
  let audioCtx = null;
  let micStream = null;
  let micRaf = null;
  let listening = false;

  const $ = (id) => document.getElementById(id);

  function stopMic() {
    listening = false;
    if (micRaf) {
      cancelAnimationFrame(micRaf);
      micRaf = null;
    }
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      micStream = null;
    }
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      audioCtx = null;
    }
  }

  function blowOutCandles() {
    if (candlesOut) {
      relightCandles();
      return;
    }
    candlesOut = true;
    stopMic();
    if (window.SiteSFX) window.SiteSFX.blowOut();

    const cfg = window.SITE_CONFIG?.cake || {};
    const candles = Array.from(document.querySelectorAll("#candles-group .candle"));
    const status = $("mic-status");
    if (status) status.textContent = "";

    candles.forEach((c, idx) => {
      setTimeout(() => {
        c.classList.add("out");
      }, idx * 170);
    });

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
        window.SiteParticles.heartRain(18);
      }

      const bnSpan = $("blow-btn-bn");
      const enSpan = $("blow-btn-en");
      if (bnSpan) bnSpan.textContent = cfg.relightLabel || "Light candles again";
      if (enSpan) enSpan.textContent = "";
    }, finishDelay);
  }

  function relightCandles() {
    candlesOut = false;
    const cfg = window.SITE_CONFIG?.cake || {};
    document.querySelectorAll("#candles-group .candle").forEach((c) => c.classList.remove("out"));
    const wish = $("wish-message");
    if (wish) wish.hidden = true;

    const bnSpan = $("blow-btn-bn");
    const enSpan = $("blow-btn-en");
    if (bnSpan) bnSpan.textContent = cfg.blowBtnBn || "ফুঁ দাও";
    if (enSpan) enSpan.textContent = cfg.blowBtnEn || "Blow the candles";
  }

  async function toggleMicBlow() {
    const cfg = window.SITE_CONFIG?.cake || {};
    const status = $("mic-status");

    if (candlesOut) relightCandles();

    if (listening) {
      stopMic();
      if (status) status.textContent = "";
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (status) status.textContent = cfg.micDeniedText || "Microphone unavailable — tap the button to blow.";
      return;
    }

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextCls = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextCls();
      const source = audioCtx.createMediaStreamSource(micStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      listening = true;
      if (status) status.textContent = cfg.micListeningText || "Listening... blow gently into your microphone";

      let sustainedFrames = 0;
      const detect = () => {
        if (!listening) return;
        analyser.getByteFrequencyData(data);
        // Blowing air creates strong low-mid energy
        let sum = 0;
        const bins = Math.min(32, data.length);
        for (let i = 0; i < bins; i++) sum += data[i];
        const avg = sum / bins;

        if (avg > 62) {
          sustainedFrames++;
          if (sustainedFrames >= 6) {
            blowOutCandles();
            return;
          }
        } else {
          sustainedFrames = Math.max(0, sustainedFrames - 1);
        }
        micRaf = requestAnimationFrame(detect);
      };
      micRaf = requestAnimationFrame(detect);
    } catch {
      stopMic();
      if (status) status.textContent = cfg.micDeniedText || "Microphone unavailable — tap the button to blow.";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("blow-btn")?.addEventListener("click", blowOutCandles);
    $("mic-blow-btn")?.addEventListener("click", toggleMicBlow);
  });
})();
