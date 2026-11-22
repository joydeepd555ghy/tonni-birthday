/**
 * Romantic Web Audio SFX Engine (zero external files).
 * Unlocks cleanly on first user gesture and provides a Sound FX toggle.
 */
(function () {
  const STORAGE_KEY = "tonni_sfx_enabled";
  let ctx = null;
  let masterOut = null;
  let enabled = localStorage.getItem(STORAGE_KEY) !== "off";
  let unlocked = false;

  // Romantic D-major pentatonic frequencies for musical taps
  const PENTATONIC = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];
  let noteStep = 0;

  function ensureCtx() {
    if (!enabled) return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) {
      ctx = new AudioCtx();
      // Master gain + gentle compressor so SFX are crisp, loud & distortion-free on phone speakers
      const gain = ctx.createGain();
      gain.gain.value = 1.75;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 4;
      comp.attack.value = 0.004;
      comp.release.value = 0.14;
      gain.connect(comp);
      comp.connect(ctx.destination);
      masterOut = gain;
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function unlock() {
    const c = ensureCtx();
    if (!c) return;
    if (!unlocked) {
      unlocked = true;
      // Silent 1-sample buffer unlock for iOS Safari Web Audio
      try {
        const buf = c.createBuffer(1, 1, 22050);
        const src = c.createBufferSource();
        src.buffer = buf;
        src.connect(c.destination);
        src.start(0);
      } catch {
        // Ignore
      }
    }
  }

  function playTone(freq, duration = 0.45, type = "sine", gainPeak = 0.06, delay = 0) {
    const c = ensureCtx();
    if (!c || !masterOut) return;
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(gainPeak, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  function playNoise(duration = 0.25, filterFreq = 900, gainPeak = 0.04, delay = 0) {
    const c = ensureCtx();
    if (!c || !masterOut) return;
    const bufSize = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = Math.max(420, filterFreq);
    filter.Q.value = 1.2;

    const gain = c.createGain();
    const t = c.currentTime + delay;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(gainPeak, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);
    src.start(t);
  }

  function playClap(delay = 0, peak = 0.065, freq = 1250) {
    const c = ensureCtx();
    if (!c || !masterOut) return;
    const dur = 0.14;
    const bufSize = Math.floor(c.sampleRate * dur);
    const buffer = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      const env = Math.exp(-i / (c.sampleRate * 0.028));
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const src = c.createBufferSource();
    src.buffer = buffer;

    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = freq;
    bp.Q.value = 1.3;

    const gain = c.createGain();
    const t = c.currentTime + delay;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    src.connect(bp);
    bp.connect(gain);
    gain.connect(masterOut);
    src.start(t);
  }

  function playApplause(startDelay = 0.45, durationSec = 2.8) {
    // Organic multi-person celebratory applause with swell & gentle fade-out
    const totalClaps = 46;
    for (let i = 0; i < totalClaps; i++) {
      const progress = i / totalClaps;
      const jitter = (Math.random() - 0.5) * 0.07;
      const t = startDelay + progress * durationSec + jitter;
      // Swell in quickly, sustain, then taper softly
      const env = progress < 0.15 ? progress / 0.15 : progress > 0.72 ? (1 - progress) / 0.28 : 1;
      const peak = (0.032 + Math.random() * 0.035) * Math.max(0.25, env);
      const freq = 900 + Math.random() * 850;
      playClap(Math.max(0, t), peak, freq);
    }
  }

  const SFX = {
    isEnabled: () => enabled,
    setEnabled(val) {
      enabled = Boolean(val);
      localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
      if (enabled) ensureCtx();
      updatePill();
    },
    toggle() {
      this.setEnabled(!enabled);
    },
    chime() {
      const f = PENTATONIC[noteStep++ % PENTATONIC.length];
      playTone(f, 0.42, "sine", 0.045, 0);
      playTone(f * 2, 0.28, "triangle", 0.018, 0.02);
    },
    keyTap() {
      // Soft tactile crystal keystroke for typing
      playNoise(0.035, 2400, 0.022, 0);
      playTone(1050 + Math.random() * 180, 0.06, "triangle", 0.014, 0);
    },
    penTick() {
      // Ultra-soft vintage pen-on-paper tick during letter handwriting
      playNoise(0.025, 3100, 0.012, 0);
    },
    swipeWhoosh() {
      // Silky swipe-right whoosh
      playNoise(0.26, 1300, 0.042, 0);
      playTone(520, 0.18, "sine", 0.022, 0.04);
    },
    matchFanfare() {
      // Sparkly "It's a Match!" chime + celebration pop
      [587.33, 739.99, 880.0, 1174.66].forEach((f, i) => {
        playTone(f, 0.65, "sine", 0.055, i * 0.07);
      });
      playNoise(0.12, 2200, 0.045, 0.2);
    },
    msgSent() {
      // Crisp cute upward chat-bubble pop
      const c = ensureCtx();
      if (!c || !masterOut) return;
      const t = c.currentTime;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.075);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.055, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
      osc.connect(g);
      g.connect(masterOut);
      osc.start(t);
      osc.stop(t + 0.12);
    },
    msgRecv() {
      // Warm gentle double-bell incoming message ding
      playTone(784.0, 0.18, "sine", 0.042, 0);
      playTone(1046.5, 0.26, "sine", 0.046, 0.075);
    },
    softPop() {
      playTone(680, 0.12, "sine", 0.032, 0);
    },
    curtainOpen() {
      // Plush velvet drape whoosh + sweeping royal harp glissando + crystal sparkle
      playNoise(0.95, 420, 0.055, 0);
      playNoise(0.65, 1100, 0.025, 0.18);
      [293.66, 369.99, 440.0, 554.37, 587.33, 739.99, 880.0, 1174.66].forEach((f, i) => {
        playTone(f, 1.05, "sine", 0.05, 0.05 + i * 0.075);
        playTone(f * 2, 0.55, "triangle", 0.016, 0.08 + i * 0.075);
      });
    },
    unlockBurst() {
      // Warm ascending harp arpeggio
      [293.66, 369.99, 440.0, 587.33, 739.99, 880.0].forEach((f, i) => {
        playTone(f, 0.75, "sine", 0.055, i * 0.065);
      });
    },
    petalSplit() {
      playNoise(0.35, 1600, 0.022, 0);
      [587.33, 880.0, 1174.66].forEach((f, i) => {
        playTone(f, 0.65, "triangle", 0.03, i * 0.08);
      });
    },
    cardFlip() {
      playNoise(0.14, 1200, 0.02, 0);
      playTone(659.25, 0.35, "sine", 0.04, 0.03);
      playTone(987.77, 0.38, "sine", 0.025, 0.08);
    },
    envelopeOpen() {
      playNoise(0.28, 750, 0.035, 0);
      [293.66, 440.0, 554.37, 739.99].forEach((f, i) => {
        playTone(f, 0.9, "sine", 0.04, 0.06 + i * 0.09);
      });
    },
    blowOut() {
      // Breath whoosh -> celebratory wish chime -> warm applause & confetti pops!
      playNoise(0.45, 500, 0.055, 0);
      [587.33, 739.99, 880.0, 1174.66, 1479.98].forEach((f, i) => {
        playTone(f, 0.9, "sine", 0.048, 0.35 + i * 0.09);
      });
      playApplause(0.65, 2.9);
      // Soft party poppers
      playNoise(0.09, 2200, 0.06, 0.75);
      playNoise(0.09, 1900, 0.055, 1.15);
    },
    applause() {
      playApplause(0.05, 2.5);
    },
    firework() {
      // Soft whistle up + sparkle pop
      const c = ensureCtx();
      if (!c || !masterOut) return;
      const t = c.currentTime;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.exponentialRampToValueAtTime(1250, t + 0.24);
      g.gain.setValueAtTime(0.025, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      osc.connect(g);
      g.connect(masterOut);
      osc.start(t);
      osc.stop(t + 0.26);

      playNoise(0.28, 620, 0.065, 0.24);
      playTone(880, 0.55, "triangle", 0.04, 0.26);
      playTone(1174.66, 0.65, "sine", 0.04, 0.3);
    },
    finaleChord() {
      [293.66, 440.0, 587.33, 739.99, 880.0, 1174.66].forEach((f, i) => {
        playTone(f, 1.8, "sine", 0.045, i * 0.07);
      });
    }
  };

  function updatePill() {
    const pill = document.getElementById("sfx-pill");
    if (!pill) return;
    pill.setAttribute("aria-pressed", String(enabled));
    pill.classList.toggle("muted", !enabled);
    const label = pill.querySelector(".sfx-pill-text");
    if (label) label.textContent = enabled ? "SFX On" : "SFX Off";
  }

  ["touchstart", "touchend", "pointerdown", "click", "keydown"].forEach((ev) => {
    window.addEventListener(ev, unlock, { passive: true });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const pill = document.getElementById("sfx-pill");
    if (pill) {
      updatePill();
      pill.addEventListener("click", () => {
        SFX.toggle();
        if (SFX.isEnabled()) SFX.chime();
      });
    }
  });

  window.SiteSFX = SFX;
})();
