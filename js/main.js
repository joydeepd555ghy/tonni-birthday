/**
 * Main application bootstrap:
 *  - Hydrates all Bengali & English copy from window.SITE_CONFIG
 *  - Gate -> Heart Loader -> Hero reveal
 *  - Background music with fade-in, localStorage persistence & Web Audio fallback
 *  - Film overlay, Timeline builder, Reasons cards, GSAP ScrollTrigger & Finale
 */
(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);

  function setText(id, val) {
    const el = $(id);
    if (el && val !== undefined) el.textContent = val;
  }

  function segmentGraphemes(text) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const seg = new Intl.Segmenter("bn", { granularity: "grapheme" });
      return Array.from(seg.segment(text), (s) => s.segment);
    }
    return Array.from(text);
  }

  /* ---------- Hydrate Config Copy ---------- */
  function hydrateCopy() {
    const cfg = window.SITE_CONFIG;
    if (!cfg) return;

    // Onboarding
    if (cfg.onboarding) {
      setText("onboarding-eyebrow", cfg.onboarding.eyebrow);
      setText("onboarding-title-bn", cfg.onboarding.titleBn);
      setText("onboarding-title-en", cfg.onboarding.titleEn);
      setText("onboarding-sub-bn", cfg.onboarding.subtitleBn);
      setText("onboarding-sub-en", cfg.onboarding.subtitleEn);
      setText("onboarding-btn-bn", cfg.onboarding.buttonBn);
      setText("onboarding-btn-en", cfg.onboarding.buttonEn);
    }

    // Gate
    setText("gate-question-bn", cfg.gate.questionBn);
    setText("gate-question-en", cfg.gate.questionEn);
    const gateInput = $("gate-input");
    if (gateInput) gateInput.placeholder = cfg.gate.placeholder || "Type your answer...";
    setText("gate-submit", cfg.gate.buttonText || "Unlock");

    // Loader
    setText("loader-text-bn", cfg.loader.textBn);
    setText("loader-text-en", cfg.loader.textEn);

    // Hero
    setText("hero-eyebrow", cfg.hero.eyebrow);
    setText("hero-headline-en", cfg.hero.headlineEn);
    setText("hero-name", cfg.meta.recipientNameEn);
    setText("counter-bn-prefix", cfg.hero.counterBnPrefix);
    setText("counter-bn-suffix", cfg.hero.counterBnSuffix);
    setText("counter-en-prefix", cfg.hero.counterEnPrefix);
    setText("counter-en-suffix", cfg.hero.counterEnSuffix);
    setText("hero-music-label", cfg.hero.musicTapLabel);
    setText("scroll-cue-text", cfg.hero.scrollCue);

    const heroPhoto = $("hero-photo");
    if (heroPhoto && cfg.meta.heroPhoto) heroPhoto.src = cfg.meta.heroPhoto;

    // Live days counter
    const start = new Date(`${cfg.meta.startDate}T00:00:00`);
    const now = new Date();
    const days = Math.max(0, Math.floor((now - start) / 86400000));
    setText("days-count-bn", String(days));
    setText("days-count-en", String(days));

    // Film
    setText("film-title-bn", cfg.film.titleBn);
    setText("film-title-en", cfg.film.titleEn);
    setText("film-subtitle", cfg.film.subtitle);
    const storyVid = $("story-video");
    if (storyVid) {
      if (cfg.meta.filmSrc) storyVid.src = cfg.meta.filmSrc;
      if (cfg.meta.filmPoster) storyVid.poster = cfg.meta.filmPoster;
    }

    // Gallery
    setText("gallery-title-bn", cfg.gallery.titleBn);
    setText("gallery-title-en", cfg.gallery.titleEn);
    setText("gallery-subtitle", cfg.gallery.subtitle);
    setText("motd-label-bn", cfg.gallery.memoryOfDayLabelBn);
    setText("motd-label-en", cfg.gallery.memoryOfDayLabelEn);
    setText("surprise-btn-bn", cfg.gallery.surpriseBtnBn);
    setText("surprise-btn-en", cfg.gallery.surpriseBtnEn);
    setText("slideshow-btn-bn", cfg.gallery.slideshowBtnBn);
    setText("slideshow-btn-en", cfg.gallery.slideshowBtnEn);

    // Timeline
    setText("timeline-title-bn", cfg.timeline.titleBn);
    setText("timeline-title-en", cfg.timeline.titleEn);
    setText("timeline-subtitle", cfg.timeline.subtitle);

    // Reasons
    setText("reasons-title-bn", cfg.reasons.titleBn);
    setText("reasons-title-en", cfg.reasons.titleEn);
    setText("reasons-subtitle", cfg.reasons.subtitle);

    // Cake
    setText("cake-title-bn", cfg.cake.titleBn);
    setText("cake-title-en", cfg.cake.titleEn);
    setText("cake-subtitle", cfg.cake.subtitle);
    setText("blow-btn-bn", cfg.cake.blowBtnBn);
    setText("blow-btn-en", cfg.cake.blowBtnEn);
    setText("mic-btn-bn", cfg.cake.micBtnBn);
    setText("mic-btn-en", cfg.cake.micBtnEn);
    setText("wish-bn", cfg.cake.wishGrantedBn);
    setText("wish-en", cfg.cake.wishGrantedEn);

    // Letter
    setText("letter-title-bn", cfg.letter.titleBn);
    setText("letter-title-en", cfg.letter.titleEn);
    setText("letter-subtitle", cfg.letter.subtitle);

    // Finale
    setText("finale-btn-bn", cfg.finale.buttonBn);
    setText("finale-btn-en", cfg.finale.buttonEn);
    setText("finale-msg-bn", cfg.finale.messageBn);
    setText("finale-msg-en", cfg.finale.messageEn);
    setText("finale-credit", cfg.finale.credit);
  }

  /* ---------- Hero Grapheme Headline ---------- */
  function prepareHeroHeadline() {
    const h1 = $("hero-headline-bn");
    const text = window.SITE_CONFIG?.hero?.headlineBn || "শুভ জন্মদিন, মহারানী";
    if (!h1) return;
    h1.innerHTML = "";
    const chars = segmentGraphemes(text);
    chars.forEach((ch) => {
      if (ch === " ") {
        h1.appendChild(document.createTextNode(" "));
        return;
      }
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch;
      h1.appendChild(span);
    });
  }

  function playHeroReveal() {
    const chars = document.querySelectorAll("#hero-headline-bn .char");
    if (reducedMotion || typeof gsap === "undefined") {
      chars.forEach((c) => {
        c.style.opacity = "1";
        c.style.filter = "none";
      });
      return;
    }

    gsap.fromTo(
      chars,
      { opacity: 0, y: 14, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.045,
        ease: "power3.out",
        clearProps: "filter,transform"
      }
    );
  }

  /* ---------- 0. Gate & 1. Heart Loader ---------- */
  function startLoaderSequence() {
    const loader = $("loader-screen");
    if (!loader || reducedMotion || typeof gsap === "undefined") {
      if (loader) loader.hidden = true;
      playHeroReveal();
      return;
    }

    loader.hidden = false;
    const stroke = $("loader-heart-stroke");
    const fill = $("loader-heart-fill");
    const petalsBox = $("loader-petals");

    const tl = gsap.timeline({
      onComplete: () => {
        loader.hidden = true;
        playHeroReveal();
      }
    });

    // 1) Draw gold heart outline
    tl.to(stroke, { strokeDashoffset: 0, duration: 1.05, ease: "power2.inOut" })
      // 2) Fill rose
      .to(fill, { opacity: 1, duration: 0.55, ease: "power2.out" }, "-=0.25")
      // 3) Split into petals
      .add(() => {
        if (window.SiteSFX) window.SiteSFX.petalSplit();
        if (!petalsBox) return;
        petalsBox.innerHTML = "";
        for (let i = 0; i < 16; i++) {
          const p = document.createElement("span");
          p.className = "loader-petal";
          petalsBox.appendChild(p);
          const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.3;
          const dist = 80 + Math.random() * 140;
          gsap.fromTo(
            p,
            { x: 0, y: 0, scale: 0.6, opacity: 1, rotation: 0 },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist + 25,
              scale: 0.2,
              opacity: 0,
              rotation: (Math.random() - 0.5) * 240,
              duration: 0.9,
              ease: "power2.out"
            }
          );
        }
      })
      .to("#loader-heart-svg", { scale: 1.15, opacity: 0, duration: 0.45, ease: "power2.in" })
      .to(loader, { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.15");
  }

  function initOnboarding() {
    const cfg = window.SITE_CONFIG?.onboarding;
    const screen = $("onboarding-screen");
    const enterBtn = $("onboarding-enter-btn");

    if (!cfg?.enabled || !screen || !enterBtn) {
      initGateAndLoader();
      return;
    }

    screen.hidden = false;
    enterBtn.addEventListener(
      "click",
      () => {
        if (window.SiteSFX) window.SiteSFX.unlockBurst();
        if (window.SiteParticles) {
          window.SiteParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 54, 0.75);
        }
        screen.classList.add("parting");
        const delay = reducedMotion ? 80 : 950;
        setTimeout(() => {
          screen.hidden = true;
          initGateAndLoader();
        }, delay);
      },
      { once: true }
    );
  }

  function initGateAndLoader() {
    const gateCfg = window.SITE_CONFIG?.gate;
    const gate = $("gate-screen");

    if (!gateCfg?.enabled || !gate) {
      startLoaderSequence();
      return;
    }

    gate.hidden = false;
    const form = $("gate-form");
    const input = $("gate-input");
    const feedback = $("gate-feedback");
    const card = gate.querySelector(".gate-card");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = (input.value || "").trim().toLowerCase();
      const accepted = (gateCfg.acceptedAnswers || ["hi"]).map((a) => a.toLowerCase());

      if (accepted.includes(val)) {
        feedback.textContent = "";
        if (window.SiteSFX) window.SiteSFX.unlockBurst();
        if (window.SiteParticles) {
          window.SiteParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 50, 0.8);
        }
        gate.hidden = true;
        startLoaderSequence();
      } else {
        feedback.textContent = gateCfg.hintText || "Try again, my love.";
        if (card) {
          card.classList.remove("shake");
          void card.offsetWidth;
          card.classList.add("shake");
        }
      }
    });
  }

  /* ---------- Music Player (Never Autoplay, Fade-in, Fallback) ---------- */
  function initMusic() {
    const STORAGE_KEY = "tonni_music_pref";
    const cfg = window.SITE_CONFIG;
    const heroBtn = $("hero-music-btn");
    const pill = $("music-pill");
    const heroLabel = $("hero-music-label");

    const audio = new Audio(cfg?.meta?.musicSrc || "assets/music/song.mp3");
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0;

    let playing = false;
    let fadeTimer = null;
    let fallbackCtx = null;
    let fallbackTimer = null;
    let useFallback = false;

    audio.addEventListener("error", () => {
      useFallback = true;
    });

    function startFallbackMusicBox() {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!fallbackCtx) fallbackCtx = new AudioCtx();
      if (fallbackCtx.state === "suspended") fallbackCtx.resume();

      // Gentle romantic arpeggio in D major
      const notes = [293.66, 369.99, 440.0, 587.33, 440.0, 369.99, 329.63, 440.0];
      let step = 0;
      clearInterval(fallbackTimer);
      fallbackTimer = setInterval(() => {
        if (!playing || !fallbackCtx) return;
        const now = fallbackCtx.currentTime;
        const osc = fallbackCtx.createOscillator();
        const gain = fallbackCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = notes[step % notes.length];
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
        osc.connect(gain);
        gain.connect(fallbackCtx.destination);
        osc.start(now);
        osc.stop(now + 1.45);
        step++;
      }, 650);
    }

    function stopFallbackMusicBox() {
      clearInterval(fallbackTimer);
      fallbackTimer = null;
    }

    function updateUI() {
      const heroCfg = cfg?.hero || {};
      if (heroBtn) heroBtn.setAttribute("aria-pressed", String(playing));
      if (pill) {
        pill.setAttribute("aria-pressed", String(playing));
        pill.classList.toggle("playing", playing);
        pill.querySelector(".music-pill-text").textContent = playing ? "Pause" : "Music";
      }
      if (heroLabel) {
        heroLabel.textContent = playing
          ? heroCfg.musicPauseLabel || "Pause music"
          : heroCfg.musicTapLabel || "Tap to play music";
      }
    }

    async function play() {
      if (playing) return;
      playing = true;
      localStorage.setItem(STORAGE_KEY, "on");
      updateUI();

      if (useFallback) {
        startFallbackMusicBox();
        return;
      }

      try {
        audio.volume = 0;
        await audio.play();
        clearInterval(fadeTimer);
        fadeTimer = setInterval(() => {
          if (audio.volume < 0.72) {
            audio.volume = Math.min(0.75, audio.volume + 0.05);
          } else {
            clearInterval(fadeTimer);
          }
        }, 120);
      } catch {
        useFallback = true;
        startFallbackMusicBox();
      }
    }

    function pause() {
      playing = false;
      localStorage.setItem(STORAGE_KEY, "off");
      clearInterval(fadeTimer);
      audio.pause();
      stopFallbackMusicBox();
      updateUI();
    }

    function toggle() {
      if (playing) pause();
      else play();
    }

    heroBtn?.addEventListener("click", toggle);
    pill?.addEventListener("click", toggle);

    // Show floating pill once user scrolls past hero
    if (pill && "IntersectionObserver" in window && $("hero")) {
      const obs = new IntersectionObserver(
        (entries) => {
          pill.hidden = entries[0].isIntersecting;
        },
        { threshold: 0.15 }
      );
      obs.observe($("hero"));
    }

    // Remember user's previous preference (visual cue only; never autoplay without gesture)
    const pref = localStorage.getItem(STORAGE_KEY);
    if (pref === "on" && heroLabel) {
      heroLabel.textContent = cfg?.hero?.musicTapLabel || "Tap to resume music";
    }

    window.SiteMusic = {
      play,
      pause,
      toggle,
      isPlaying: () => playing
    };
  }

  /* ---------- 3. Film Section ---------- */
  function initFilm() {
    const video = $("story-video");
    const overlay = $("film-play-overlay");
    if (!video || !overlay) return;

    overlay.addEventListener("click", () => {
      video.play().catch(() => {});
    });
    video.addEventListener("play", () => overlay.classList.add("hidden"));
    video.addEventListener("pause", () => overlay.classList.remove("hidden"));
    video.addEventListener("ended", () => overlay.classList.remove("hidden"));
  }

  /* ---------- 5. Timeline ---------- */
  function initTimeline() {
    const container = $("timeline-stops");
    const cfg = window.SITE_CONFIG;
    if (!container || !cfg?.timeline?.stops) return;

    container.innerHTML = "";

    cfg.timeline.stops.forEach((stop, idx) => {
      const card = document.createElement("article");
      card.className = "glass-card timeline-stop";
      card.dataset.stopIndex = String(idx);

      const dateEl = document.createElement("div");
      dateEl.className = "tl-date";
      dateEl.textContent = stop.date;
      card.appendChild(dateEl);

      if (stop.type === "milestone") {
        const stamp = document.createElement("div");
        stamp.className = "gold-stamp";
        stamp.innerHTML = `<p class="gold-stamp-bn" lang="bn"></p><p class="gold-stamp-en" lang="en"></p>`;
        stamp.querySelector(".gold-stamp-bn").textContent = stop.stampBn;
        stamp.querySelector(".gold-stamp-en").textContent = stop.stampEn;
        card.appendChild(stamp);
        if (stop.description) {
          const p = document.createElement("p");
          p.className = "tl-desc";
          p.textContent = stop.description;
          card.appendChild(p);
        }
      } else {
        if (stop.titleBn) {
          const hBn = document.createElement("h3");
          hBn.className = "tl-title-bn";
          hBn.setAttribute("lang", "bn");
          hBn.textContent = stop.titleBn;
          card.appendChild(hBn);
        }
        if (stop.titleEn) {
          const pEn = document.createElement("p");
          pEn.className = "tl-title-en";
          pEn.setAttribute("lang", "en");
          pEn.textContent = stop.titleEn;
          card.appendChild(pEn);
        }
        if (stop.description) {
          const desc = document.createElement("p");
          desc.className = "tl-desc";
          desc.textContent = stop.description;
          card.appendChild(desc);
        }
      }

      if (stop.type === "match") {
        const matchWrap = document.createElement("div");
        matchWrap.className = "match-hearts";
        matchWrap.innerHTML = `
          <div class="match-avatar left">
            <svg viewBox="0 0 100 92" aria-label="Joydeep">
              <defs><clipPath id="heartClipL"><path d="M50 86C50 86 8 58 8 28C8 14 19 4 32 4C40.5 4 47.5 8.8 50 15.5C52.5 8.8 59.5 4 68 4C81 4 92 14 92 28C92 58 50 86 50 86Z"/></clipPath></defs>
              <image href="${cfg.meta.joydeepPhoto}" width="100" height="92" preserveAspectRatio="xMidYMid slice" clip-path="url(#heartClipL)"/>
              <path d="M50 86C50 86 8 58 8 28C8 14 19 4 32 4C40.5 4 47.5 8.8 50 15.5C52.5 8.8 59.5 4 68 4C81 4 92 14 92 28C92 58 50 86 50 86Z" fill="none" stroke="#f2c36b" stroke-width="3"/>
            </svg>
          </div>
          <div class="match-avatar right">
            <svg viewBox="0 0 100 92" aria-label="Tonni">
              <defs><clipPath id="heartClipR"><path d="M50 86C50 86 8 58 8 28C8 14 19 4 32 4C40.5 4 47.5 8.8 50 15.5C52.5 8.8 59.5 4 68 4C81 4 92 14 92 28C92 58 50 86 50 86Z"/></clipPath></defs>
              <image href="${cfg.meta.tonniMatchPhoto}" width="100" height="92" preserveAspectRatio="xMidYMid slice" clip-path="url(#heartClipR)"/>
              <path d="M50 86C50 86 8 58 8 28C8 14 19 4 32 4C40.5 4 47.5 8.8 50 15.5C52.5 8.8 59.5 4 68 4C81 4 92 14 92 28C92 58 50 86 50 86Z" fill="none" stroke="#ff7a9c" stroke-width="3"/>
            </svg>
          </div>
        `;
        card.appendChild(matchWrap);
      }

      if (stop.type === "chat-tinder") {
        const thread = document.createElement("div");
        thread.className = "chat-thread";
        (stop.messages || []).forEach((m) => {
          const b = document.createElement("span");
          b.className = `chat-bubble ${m.from === "me" ? "me" : "her"}`;
          b.textContent = m.text;
          thread.appendChild(b);
        });
        card.appendChild(thread);
      }

      if (stop.type === "chat-whatsapp") {
        const wa = document.createElement("div");
        wa.className = "wa-phone";
        wa.innerHTML = `
          <div class="wa-header">
            <img class="wa-avatar" src="${cfg.meta.tonniMatchPhoto}" alt="Tonni">
            <span>${stop.contactName || "Tonni"}</span>
          </div>
          <div class="wa-body"></div>
        `;
        const waBody = wa.querySelector(".wa-body");
        (stop.messages || []).forEach((m) => {
          const msg = document.createElement("div");
          msg.className = `wa-msg ${m.from === "me" ? "me" : "her"}`;
          msg.textContent = m.text;
          if (m.time) {
            const tm = document.createElement("span");
            tm.className = "wa-time";
            tm.textContent = m.time;
            msg.appendChild(tm);
          }
          waBody.appendChild(msg);
        });
        card.appendChild(wa);
      }

      container.appendChild(card);
    });
  }

  /* ---------- 6. Reasons Flip Cards ---------- */
  function initReasons() {
    const grid = $("reasons-grid");
    const items = window.SITE_CONFIG?.reasons?.items || [];
    if (!grid) return;
    grid.innerHTML = "";

    items.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reason-card";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", `Reason ${i + 1}: tap to flip`);

      btn.innerHTML = `
        <span class="reason-inner">
          <span class="reason-face reason-front">
            <span class="reason-front-num">${String(i + 1).padStart(2, "0")}</span>
            <svg class="reason-front-heart" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-8.5-5.6-8.5-11.5C3.5 6.4 5.9 4 8.8 4c1.7 0 3.2.9 3.2 2.3C12 4.9 13.5 4 15.2 4 18.1 4 20.5 6.4 20.5 9.5 20.5 15.4 12 21 12 21Z"/>
            </svg>
          </span>
          <span class="reason-face reason-back">
            <span class="reason-back-bn" lang="bn"></span>
            <span class="reason-back-en" lang="en"></span>
          </span>
        </span>
      `;
      btn.querySelector(".reason-back-bn").textContent = item.bn;
      btn.querySelector(".reason-back-en").textContent = item.en;

      btn.addEventListener("click", () => {
        const flipped = btn.classList.toggle("flipped");
        btn.setAttribute("aria-pressed", String(flipped));
        if (window.SiteSFX) window.SiteSFX.cardFlip();
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- GSAP ScrollTrigger Animations ---------- */
  function initScrollAnimations() {
    if (reducedMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      document.querySelectorAll(".timeline-stop").forEach((s) => s.classList.add("lit"));
      const fill = $("timeline-thread-fill");
      if (fill) fill.style.transform = "scaleY(1)";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Section dividers: gold line draw
    document.querySelectorAll(".section-divider").forEach((div) => {
      const lines = div.querySelectorAll(".divider-line");
      gsap.from(lines, {
        scaleX: 0,
        duration: 0.75,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: { trigger: div, start: "top 88%", once: true }
      });
    });

    // Section headers fade-up + blur-in
    document.querySelectorAll(".section-header").forEach((hdr) => {
      gsap.from(hdr, {
        opacity: 0,
        y: 22,
        duration: 0.75,
        ease: "power2.out",
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: hdr, start: "top 86%", once: true }
      });
    });

    // Self-drawing timeline thread
    const tlContainer = $("timeline-container");
    const tlFill = $("timeline-thread-fill");
    if (tlContainer && tlFill) {
      gsap.to(tlFill, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: tlContainer,
          start: "top 72%",
          end: "bottom 72%",
          scrub: 0.4
        }
      });
    }

    // Timeline stops light up & animate
    document.querySelectorAll(".timeline-stop").forEach((stop, idx) => {
      ScrollTrigger.create({
        trigger: stop,
        start: "top 78%",
        once: true,
        onEnter: () => {
          stop.classList.add("lit");
          if (idx === 0) {
            const left = stop.querySelector(".match-avatar.left");
            const right = stop.querySelector(".match-avatar.right");
            if (left && right) {
              gsap.from(left, { x: -45, opacity: 0, duration: 0.7, ease: "back.out(1.4)", clearProps: "all" });
              gsap.from(right, { x: 45, opacity: 0, duration: 0.7, ease: "back.out(1.4)", clearProps: "all" });
            }
            if (window.SiteParticles) {
              const r = stop.getBoundingClientRect();
              window.SiteParticles.burst(r.left + r.width / 2, r.top + r.height / 2, 24, 0.5);
            }
          }
          const bubbles = stop.querySelectorAll(".chat-bubble, .wa-msg");
          if (bubbles.length) {
            gsap.from(bubbles, {
              opacity: 0,
              y: 12,
              stagger: 0.22,
              duration: 0.45,
              ease: "power2.out",
              clearProps: "all"
            });
          }
        }
      });
    });
  }

  /* ---------- 9. Finale ---------- */
  function initFinale() {
    const btn = $("finale-btn");
    const reveal = $("finale-reveal");
    if (!btn || !reveal) return;

    btn.addEventListener("click", () => {
      document.body.classList.add("finale-active");
      reveal.hidden = false;
      if (window.SiteParticles) {
        window.SiteParticles.finaleShow();
      }
      if (!reducedMotion && typeof gsap !== "undefined") {
        gsap.from(reveal, { opacity: 0, y: 20, duration: 0.9, ease: "power2.out", clearProps: "all" });
      }
    });
  }

  function initScrollProgress() {
    const bar = $("scroll-progress");
    if (!bar) return;
    window.addEventListener(
      "scroll",
      () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
        bar.style.width = `${pct.toFixed(2)}%`;
      },
      { passive: true }
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateCopy();
    prepareHeroHeadline();
    initScrollProgress();
    initMusic();
    initFilm();
    initTimeline();
    initReasons();
    initScrollAnimations();
    initFinale();
    initOnboarding();
  });
})();
