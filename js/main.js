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
      setText("premiere-date-bn", cfg.onboarding.dateStampBn || "২৮ নভেম্বর");
      setText("premiere-date-en", cfg.onboarding.dateStampEn || "28 NOVEMBER");
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
    setText("reasons-secret-bn", cfg.reasons.allFlippedBn || "");
    setText("reasons-secret-en", cfg.reasons.allFlippedEn || "");
    setText("vouchers-title-bn", cfg.reasons.vouchersTitleBn || "");
    setText("vouchers-title-en", cfg.reasons.vouchersTitleEn || "");

    // Cake
    setText("cake-title-bn", cfg.cake.titleBn);
    setText("cake-title-en", cfg.cake.titleEn);
    setText("cake-subtitle", cfg.cake.subtitle);
    setText("blow-btn-bn", cfg.cake.blowBtnBn);
    setText("blow-btn-en", cfg.cake.blowBtnEn);
    setText("cut-btn-bn", cfg.cake.cutBtnBn || "কেক কাটো, মহারানী");
    setText("cut-btn-en", cfg.cake.cutBtnEn || "Cut Your Birthday Cake");
    setText("first-bite-bn", cfg.cake.firstBiteBn || "প্রথম টুকরো শুধু আমার মহারানীর জন্য!");
    setText("first-bite-en", cfg.cake.firstBiteEn || "The very first bite is for my Maharani!");
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
    setText("finale-replay-bn", cfg.finale.replayVoiceBn || "আবার শোনো");
    setText("finale-replay-en", cfg.finale.replayVoiceEn || "Replay my voice note");
    setText("finale-relive-bn", cfg.finale.reliveBtnBn || "আবার প্রথম থেকে দেখো");
    setText("finale-relive-en", cfg.finale.reliveBtnEn || "Relive from the beginning");
    setText("finale-credit", cfg.finale.credit);

    // Chapter reveal buttons
    if (cfg.reveals) {
      setText("reveal-film-bn", cfg.reveals.toFilmBn);
      setText("reveal-film-en", cfg.reveals.toFilmEn);
      setText("reveal-gallery-bn", cfg.reveals.toGalleryBn);
      setText("reveal-gallery-en", cfg.reveals.toGalleryEn);
      setText("reveal-timeline-bn", cfg.reveals.toTimelineBn);
      setText("reveal-timeline-en", cfg.reveals.toTimelineEn);
      setText("reveal-reasons-bn", cfg.reveals.toReasonsBn);
      setText("reveal-reasons-en", cfg.reveals.toReasonsEn);
      setText("reveal-cake-bn", cfg.reveals.toCakeBn);
      setText("reveal-cake-en", cfg.reveals.toCakeEn);
      setText("reveal-letter-bn", cfg.reveals.toLetterBn);
      setText("reveal-letter-en", cfg.reveals.toLetterEn);
      setText("reveal-finale-bn", cfg.reveals.toFinaleBn);
      setText("reveal-finale-en", cfg.reveals.toFinaleEn);
    }
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
    showChapter("hero", false);
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

  function initPremiereCountdown() {
    const box = $("premiere-countdown");
    const cfg = window.SITE_CONFIG;
    if (!box || !cfg) return;

    const bMonth = (cfg.meta?.birthdayMonth || 11) - 1; // 0-indexed (10 = November)
    const bDay = cfg.meta?.birthdayDay || 28;
    let timer = null;

    function update() {
      const now = new Date();
      if (now.getMonth() === bMonth && now.getDate() === bDay) {
        box.innerHTML = `<span class="cd-today-bn" lang="bn"></span><span class="cd-today-en" lang="en"></span>`;
        box.querySelector(".cd-today-bn").textContent =
          cfg.onboarding?.birthdayTodayBn || "আজ তোমার বিশেষ দিন, মহারানী!";
        box.querySelector(".cd-today-en").textContent =
          cfg.onboarding?.birthdayTodayEn || "It's 28th November — Happy Birthday, Maharani!";
        clearInterval(timer);
        return;
      }

      let target = new Date(now.getFullYear(), bMonth, bDay, 0, 0, 0);
      if (target <= now) target = new Date(now.getFullYear() + 1, bMonth, bDay, 0, 0, 0);
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      box.innerHTML = `<span class="cd-label" lang="bn"></span><span class="cd-digits"></span>`;
      box.querySelector(".cd-label").textContent =
        cfg.onboarding?.countdownPrefixBn || "মহারানীর জন্মদিনে আর মাত্র";
      box.querySelector(".cd-digits").textContent =
        `${d}d : ${String(h).padStart(2, "0")}h : ${String(m).padStart(2, "0")}m : ${String(s).padStart(2, "0")}s`;
    }

    update();
    timer = setInterval(() => {
      const scr = $("onboarding-screen");
      if (!scr || scr.hidden) {
        clearInterval(timer);
        return;
      }
      update();
    }, 1000);
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
    initPremiereCountdown();

    // Giant "28th November" zoom-into-premiere intro sequence (~2.2s, or tap to zoom in immediately)
    const dateIntro = $("date-intro-splash");
    if (dateIntro && !reducedMotion) {
      let introDone = false;
      const finishIntro = () => {
        if (introDone) return;
        introDone = true;
        dateIntro.classList.add("zoom-out");
        screen.classList.remove("intro-phase");
        if (window.SiteParticles) {
          window.SiteParticles.burst(window.innerWidth / 2, window.innerHeight * 0.45, 36, 0.7);
        }
        setTimeout(() => {
          dateIntro.hidden = true;
        }, 900);
      };
      dateIntro.addEventListener("click", finishIntro, { once: true });
      setTimeout(finishIntro, 2150);
    } else {
      if (dateIntro) dateIntro.hidden = true;
      screen.classList.remove("intro-phase");
    }
    enterBtn.addEventListener(
      "click",
      () => {
        if (window.SiteSFX) {
          if (window.SiteSFX.curtainOpen) window.SiteSFX.curtainOpen();
          else window.SiteSFX.unlockBurst();
        }
        if (window.SiteMusic) window.SiteMusic.play("birthday");
        if (window.SiteParticles) {
          window.SiteParticles.burst(window.innerWidth / 2, window.innerHeight * 0.38, 42, 0.7);
          window.SiteParticles.burst(window.innerWidth / 2, window.innerHeight * 0.62, 42, 0.8);
          window.SiteParticles.heartRain(18);
        }
        screen.classList.add("parting");
        const delay = reducedMotion ? 80 : 1250;
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

    input?.addEventListener("input", () => {
      if (window.SiteSFX && window.SiteSFX.keyTap) window.SiteSFX.keyTap();
    });

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

  /* ---------- Dual-Track Music Player (Birthday Anthem + Tomake Chai) ---------- */
  function initMusic() {
    const STORAGE_KEY = "tonni_music_pref";
    const cfg = window.SITE_CONFIG;
    const heroBtn = $("hero-music-btn");
    const pill = $("music-pill");
    const heroLabel = $("hero-music-label");

    const tracks = {
      birthday: new Audio(cfg?.meta?.birthdayMusicSrc || "assets/music/maharani-birthday.mp3"),
      romantic: new Audio(cfg?.meta?.romanticMusicSrc || "assets/music/song.mp3")
    };
    Object.values(tracks).forEach((a) => {
      a.loop = true;
      a.preload = "none";
      a.volume = 0;
    });

    let activeTrackKey = "birthday";
    let playing = false;
    let fadeTimer = null;
    let pausedByVideo = false;

    function getActiveAudio() {
      return tracks[activeTrackKey] || tracks.birthday;
    }

    function updateUI() {
      const heroCfg = cfg?.hero || {};
      if (heroBtn) heroBtn.setAttribute("aria-pressed", String(playing));
      if (pill) {
        pill.hidden = false;
        pill.setAttribute("aria-pressed", String(playing));
        pill.classList.toggle("playing", playing);
        pill.querySelector(".music-pill-text").textContent = playing ? "Pause" : "Music";
      }
      if (heroLabel) {
        heroLabel.textContent = playing
          ? heroCfg.musicPauseLabel || "Pause melody"
          : heroCfg.musicTapLabel || "Play birthday melody";
      }
    }

    function fadeIn(audio, targetVol = 0.72) {
      clearInterval(fadeTimer);
      audio.volume = 0;
      fadeTimer = setInterval(() => {
        if (audio.volume < targetVol) {
          audio.volume = Math.min(targetVol, audio.volume + 0.045);
        } else {
          clearInterval(fadeTimer);
        }
      }, 100);
    }

    async function play(trackKey) {
      if (trackKey && tracks[trackKey]) activeTrackKey = trackKey;
      const audio = getActiveAudio();
      playing = true;
      pausedByVideo = false;
      localStorage.setItem(STORAGE_KEY, "on");
      updateUI();

      try {
        await audio.play();
        fadeIn(audio, 0.72);
      } catch {
        playing = false;
        updateUI();
      }
    }

    function pause(byVideo = false) {
      if (byVideo && playing) pausedByVideo = true;
      else pausedByVideo = false;
      playing = false;
      clearInterval(fadeTimer);
      Object.values(tracks).forEach((a) => a.pause());
      if (!byVideo) localStorage.setItem(STORAGE_KEY, "off");
      updateUI();
    }

    async function switchTo(trackKey) {
      if (!tracks[trackKey] || trackKey === activeTrackKey) return;
      const prev = getActiveAudio();
      const shouldResume = playing || pausedByVideo;
      activeTrackKey = trackKey;
      if (!shouldResume) return;

      clearInterval(fadeTimer);
      const next = getActiveAudio();
      next.currentTime = 0;
      next.volume = 0;
      try {
        await next.play();
        playing = true;
        updateUI();
        // Smooth crossfade
        let step = 0;
        fadeTimer = setInterval(() => {
          step++;
          prev.volume = Math.max(0, prev.volume - 0.08);
          next.volume = Math.min(0.75, next.volume + 0.06);
          if (step >= 14) {
            prev.pause();
            prev.volume = 0;
            clearInterval(fadeTimer);
          }
        }, 90);
      } catch {
        // Ignore if autoplay blocked
      }
    }

    function toggle() {
      if (playing) pause(false);
      else play(activeTrackKey);
    }

    heroBtn?.addEventListener("click", toggle);
    pill?.addEventListener("click", toggle);

    function duck(level = 0.14) {
      if (!playing) return;
      clearInterval(fadeTimer);
      const a = getActiveAudio();
      a.volume = Math.min(a.volume, level);
    }

    function unduck() {
      if (!playing) return;
      fadeIn(getActiveAudio(), 0.72);
    }

    window.SiteMusic = {
      play,
      pause,
      switchTo,
      duck,
      unduck,
      toggle,
      isPlaying: () => playing,
      wasPausedByVideo: () => pausedByVideo
    };
  }

  /* ---------- 3. Film Section (Frame-Synced SFX + Soft Music Ducking) ---------- */
  function initFilm() {
    const video = $("story-video");
    const overlay = $("film-play-overlay");
    if (!video || !overlay) return;

    // Frame-accurate SFX cues matching our-story.mp4 (22.3s)
    const videoCues = [
      { t: 0.4, fn: "swipeWhoosh" },
      { t: 2.0, fn: "matchFanfare" },
      { t: 3.0, fn: "msgSent" },
      { t: 4.0, fn: "msgSent" },
      { t: 5.0, fn: "msgRecv" },
      { t: 6.0, fn: "msgSent" },
      { t: 7.8, fn: "msgRecv" },
      { t: 13.2, fn: "chime" },
      { t: 15.0, fn: "unlockBurst" },
      { t: 17.2, fn: "matchFanfare" },
      { t: 20.2, fn: "finaleChord" }
    ];
    let firedCues = new Set();

    overlay.addEventListener("click", () => {
      if (window.SiteSFX && window.SiteSFX.softPop) window.SiteSFX.softPop();
      video.play().catch(() => {});
    });

    const phoneFrame = video.closest(".phone-frame");
    const cinemaDim = $("cinema-dim");

    video.addEventListener("play", () => {
      overlay.classList.add("hidden");
      phoneFrame?.classList.add("ambilight");
      cinemaDim?.classList.add("active");
      if (video.currentTime < 0.5) firedCues.clear();
      // Duck music gently to 0.32 so the romantic song stays softly underneath the video SFX
      if (window.SiteMusic && window.SiteMusic.duck) {
        window.SiteMusic.duck(0.32);
      }
    });

    video.addEventListener("seeked", () => {
      firedCues.clear();
      videoCues.forEach((c, idx) => {
        if (video.currentTime > c.t + 0.25) firedCues.add(idx);
      });
    });

    video.addEventListener("timeupdate", () => {
      if (video.paused || !window.SiteSFX) return;
      const nowT = video.currentTime;
      videoCues.forEach((c, idx) => {
        if (!firedCues.has(idx) && nowT >= c.t && nowT <= c.t + 0.6) {
          firedCues.add(idx);
          if (typeof window.SiteSFX[c.fn] === "function") {
            window.SiteSFX[c.fn]();
          }
        }
      });
    });

    const onStop = () => {
      overlay.classList.remove("hidden");
      phoneFrame?.classList.remove("ambilight");
      cinemaDim?.classList.remove("active");
      if (window.SiteMusic && window.SiteMusic.unduck) {
        window.SiteMusic.unduck();
      }
    };
    video.addEventListener("pause", onStop);
    video.addEventListener("ended", () => {
      firedCues.clear();
      onStop();
    });
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
    const progressEl = $("reasons-progress");
    const cakeWrap = $("reveal-cake-wrap");
    const items = window.SITE_CONFIG?.reasons?.items || [];
    if (!grid) return;
    grid.innerHTML = "";
    const seen = new Set();

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
        seen.add(i);
        if (progressEl) {
          progressEl.textContent = `${seen.size} of ${items.length} royal secrets revealed`;
        }
        if (cakeWrap && seen.size >= 1) {
          cakeWrap.hidden = false;
        }
        const secretBox = $("reasons-all-secret");
        if (secretBox && secretBox.hidden && seen.size === items.length) {
          secretBox.hidden = false;
          if (window.SiteSFX && window.SiteSFX.applause) window.SiteSFX.applause();
          if (window.SiteParticles) {
            window.SiteParticles.burst(window.innerWidth / 2, window.innerHeight * 0.45, 50, 0.85);
            window.SiteParticles.heartRain(20);
          }
        }
      });
      grid.appendChild(btn);
    });

    // Render personalized Skincare & Foodie Royal Birthday Vouchers
    const vGrid = $("vouchers-grid");
    const vouchers = window.SITE_CONFIG?.reasons?.vouchers || [];
    if (vGrid && vouchers.length) {
      vGrid.innerHTML = "";
      vouchers.forEach((v) => {
        const card = document.createElement("article");
        card.className = "voucher-card";
        card.innerHTML = `
          <span class="voucher-tag"></span>
          <h4 class="voucher-bn" lang="bn"></h4>
          <p class="voucher-en" lang="en"></p>
          <p class="voucher-desc"></p>
          <button class="btn btn-small btn-glass voucher-btn" type="button"></button>
        `;
        card.querySelector(".voucher-tag").textContent = v.tag;
        card.querySelector(".voucher-bn").textContent = v.titleBn;
        card.querySelector(".voucher-en").textContent = v.titleEn;
        card.querySelector(".voucher-desc").textContent = v.desc;
        const cBtn = card.querySelector(".voucher-btn");
        cBtn.textContent = v.claimLabel || "Claim Treat";

        cBtn.addEventListener("click", () => {
          if (card.classList.contains("claimed")) return;
          card.classList.add("claimed");
          cBtn.classList.remove("btn-glass");
          cBtn.classList.add("btn-gold");
          cBtn.textContent = v.claimedLabel || "Claimed by Maharani";
          if (window.SiteSFX) window.SiteSFX.matchFanfare();
          if (window.SiteParticles) {
            const r = card.getBoundingClientRect();
            window.SiteParticles.burst(r.left + r.width / 2, r.top + r.height / 2, 34, 0.8);
          }
          if (cakeWrap) cakeWrap.hidden = false;
        });

        vGrid.appendChild(card);
      });
    }
  }

  /* ---------- Step-by-Step Single-Chapter Stage ---------- */
  const CHAPTER_ORDER = ["hero", "film", "gallery", "timeline", "reasons", "cake", "letter", "finale"];
  let activeChapterIdx = 0;

  function showChapter(targetId, animate = true, triggerBtn = null) {
    const nextIdx = CHAPTER_ORDER.indexOf(targetId);
    if (nextIdx === -1) return;

    // Pause film if leaving film chapter
    const storyVid = $("story-video");
    if (storyVid && targetId !== "film" && !storyVid.paused) {
      storyVid.pause();
    }

    // Hide all chapters & dividers; show ONLY the active chapter
    CHAPTER_ORDER.forEach((id) => {
      const sec = $(id);
      if (sec) sec.hidden = id !== targetId;
    });
    document.querySelectorAll(".chapter-divider").forEach((d) => {
      d.hidden = true;
    });

    activeChapterIdx = nextIdx;
    const target = $(targetId);

    // Update top-left stepper, love-charm FAB & top golden progress bar
    const stepper = $("chapter-stepper");
    const stepLabel = $("chapter-step-label");
    const backBtn = $("chapter-back-btn");
    const fab = $("love-tap-fab");
    const bar = $("scroll-progress");
    if (stepper) stepper.hidden = false;
    if (fab) fab.hidden = false;
    if (stepLabel) stepLabel.textContent = `${nextIdx + 1} / ${CHAPTER_ORDER.length}`;
    if (backBtn) backBtn.hidden = nextIdx === 0;
    if (bar) bar.style.width = `${(((nextIdx + 1) / CHAPTER_ORDER.length) * 100).toFixed(1)}%`;

    window.scrollTo({ top: 0, behavior: "instant" });

    if (animate) {
      if (window.SiteSFX) window.SiteSFX.chime();
      if (window.SiteParticles) {
        const r = triggerBtn ? triggerBtn.getBoundingClientRect() : null;
        const cx = r ? r.left + r.width / 2 : window.innerWidth / 2;
        const cy = r ? r.top + r.height / 2 : window.innerHeight * 0.45;
        window.SiteParticles.burst(cx, cy, 28, 0.72);
      }
      if (target && !reducedMotion && typeof gsap !== "undefined") {
        gsap.fromTo(
          target,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "opacity,transform" }
        );
      }
    }

    if (targetId === "timeline") {
      initTimelineScrollAnimations();
    } else if (typeof ScrollTrigger !== "undefined") {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }

  let interludeTimer = null;

  function playInterludeThenShow(targetId, triggerBtn) {
    const quote = window.SITE_CONFIG?.interludes?.[targetId];
    const overlay = $("quote-interlude");
    if (!quote || !overlay || reducedMotion) {
      showChapter(targetId, true, triggerBtn);
      return;
    }

    clearTimeout(interludeTimer);
    setText("interlude-bn", quote.bn || "");
    setText("interlude-en", quote.en || "");

    overlay.classList.remove("active");
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add("active");

    if (window.SiteSFX) window.SiteSFX.chime();
    if (window.SiteParticles) {
      window.SiteParticles.burst(window.innerWidth / 2, window.innerHeight * 0.45, 34, 0.8);
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(interludeTimer);
      overlay.removeEventListener("click", finish);
      overlay.classList.remove("active");
      showChapter(targetId, true, triggerBtn);
      setTimeout(() => {
        overlay.hidden = true;
      }, 420);
    };

    overlay.addEventListener("click", finish, { once: true });
    interludeTimer = setTimeout(finish, 2200);
  }

  function initChapterReveals() {
    document.querySelectorAll("[data-reveal-target]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-reveal-target");
        if (targetId) playInterludeThenShow(targetId, btn);
      });
    });

    $("chapter-back-btn")?.addEventListener("click", () => {
      if (activeChapterIdx > 0) {
        showChapter(CHAPTER_ORDER[activeChapterIdx - 1], true);
      }
    });
  }

  /* ---------- GSAP ScrollTrigger Animations (Timeline) ---------- */
  let timelineAnimInit = false;
  function initTimelineScrollAnimations() {
    if (timelineAnimInit) return;
    timelineAnimInit = true;

    if (reducedMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      document.querySelectorAll(".timeline-stop").forEach((s) => s.classList.add("lit"));
      const fill = $("timeline-thread-fill");
      if (fill) fill.style.transform = "scaleY(1)";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Self-drawing timeline thread
    const tlContainer = $("timeline-container");
    const tlFill = $("timeline-thread-fill");
    if (tlContainer && tlFill) {
      gsap.to(tlFill, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: tlContainer,
          start: "top 75%",
          end: "bottom 75%",
          scrub: 0.4
        }
      });
    }

    // Timeline stops light up & animate
    document.querySelectorAll(".timeline-stop").forEach((stop, idx) => {
      ScrollTrigger.create({
        trigger: stop,
        start: "top 82%",
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
            // Brief realistic "typing..." (• • •) bubble before messages pop in!
            const host = bubbles[0].parentElement;
            const dots = document.createElement("span");
            dots.className = "typing-indicator";
            dots.setAttribute("aria-hidden", "true");
            dots.innerHTML = "<span></span><span></span><span></span>";
            if (host) host.prepend(dots);

            gsap.from(bubbles, {
              opacity: 0,
              y: 12,
              delay: 0.65,
              stagger: {
                each: 0.34,
                onStart: function () {
                  if (dots.parentElement) dots.remove();
                  if (!window.SiteSFX) return;
                  const el = this.targets()[0];
                  if (el && el.classList.contains("her") && window.SiteSFX.msgRecv) {
                    window.SiteSFX.msgRecv();
                  } else if (window.SiteSFX.msgSent) {
                    window.SiteSFX.msgSent();
                  }
                }
              },
              duration: 0.45,
              ease: "power2.out",
              clearProps: "all"
            });
          }
        }
      });
    });

    setTimeout(() => ScrollTrigger.refresh(), 150);
  }

  /* ---------- 9. Finale (with Joydeep's Voice Note + Kiss-Synced Fireworks) ---------- */
  function initFinale() {
    const btn = $("finale-btn");
    const reveal = $("finale-reveal");
    const replayBtn = $("finale-replay-voice");
    const reliveBtn = $("finale-relive-btn");
    const captionEl = $("finale-voice-caption");
    if (!btn || !reveal) return;

    const voiceSrc = window.SITE_CONFIG?.meta?.voiceWishSrc || "assets/music/joydeep-wish.mp3";
    const voiceCaptions = window.SITE_CONFIG?.finale?.voiceCaptions || [];
    const voiceAudio = new Audio(voiceSrc);
    const wave = $("finale-voice-wave");
    voiceAudio.preload = "auto";
    let kissBurstTimer = null;
    let captionTimers = [];

    function clearVoiceTimers() {
      clearTimeout(kissBurstTimer);
      captionTimers.forEach((t) => clearTimeout(t));
      captionTimers = [];
    }

    voiceAudio.addEventListener("ended", () => {
      if (wave) wave.hidden = true;
      if (window.SiteMusic && window.SiteMusic.unduck) {
        window.SiteMusic.unduck();
      }
    });

    function playVoiceWish() {
      clearVoiceTimers();
      if (wave) wave.hidden = false;
      if (captionEl) captionEl.textContent = "";
      if (window.SiteMusic && window.SiteMusic.duck) {
        window.SiteMusic.duck(0.14);
      }
      if (window.SiteSFX) window.SiteSFX.finaleChord();

      voiceAudio.currentTime = 0;
      voiceAudio.volume = 1;
      voiceAudio.play().catch(() => {
        if (wave) wave.hidden = true;
        if (window.SiteMusic && window.SiteMusic.unduck) window.SiteMusic.unduck();
      });

      // Synchronized glowing Bengali subtitles timed to your 6.4s voice note
      voiceCaptions.forEach((cue) => {
        const tid = setTimeout(() => {
          if (captionEl) captionEl.textContent = cue.text;
        }, Math.round(cue.at * 1000));
        captionTimers.push(tid);
      });

      // Right at the kiss ("mmuah!" ~4.6s), explode a big heart & firework burst
      kissBurstTimer = setTimeout(() => {
        if (window.SiteParticles) {
          window.SiteParticles.burst(window.innerWidth / 2, window.innerHeight * 0.42, 65, 0.85);
          window.SiteParticles.heartRain(26);
        }
      }, 4600);
    }

    btn.addEventListener("click", () => {
      document.body.classList.add("finale-active");
      reveal.hidden = false;
      playVoiceWish();
      if (window.SiteParticles) {
        window.SiteParticles.finaleShow();
      }
      if (!reducedMotion && typeof gsap !== "undefined") {
        gsap.from(reveal, { opacity: 0, y: 20, duration: 0.9, ease: "power2.out", clearProps: "all" });
      }
    });

    replayBtn?.addEventListener("click", playVoiceWish);
    reliveBtn?.addEventListener("click", () => {
      document.body.classList.remove("finale-active");
      if (window.SiteMusic && window.SiteMusic.switchTo) {
        window.SiteMusic.switchTo("birthday");
      }
      showChapter("hero", true);
    });
  }

  function initScrollProgress() {
    // Progress bar is driven cleanly by step progress (1/8 -> 8/8) in showChapter()
  }

  /* ---------- Dreamy Floating Photo Glimpses Backdrop ---------- */
  window.initDreamBackdrop = function (mediaList) {
    const container = $("dream-glimpses");
    if (!container || reducedMotion || !Array.isArray(mediaList) || mediaList.length === 0) return;

    const photos = mediaList.filter((m) => m.type === "photo" && m.thumb);
    if (!photos.length) return;

    const isMobile = window.innerWidth < 768;
    const slots = isMobile
      ? [
          { left: "-4%", top: "10%", w: "108px", rot: "-8deg", op: "0.2", dur: "10s", gx: "8px", gy: "-16px" },
          { left: "76%", top: "14%", w: "104px", rot: "7deg", op: "0.19", dur: "12s", gx: "-8px", gy: "-14px" },
          { left: "-5%", top: "68%", w: "112px", rot: "6deg", op: "0.2", dur: "11s", gx: "10px", gy: "-18px" },
          { left: "74%", top: "64%", w: "106px", rot: "-7deg", op: "0.18", dur: "13s", gx: "-9px", gy: "-15px" }
        ]
      : [
          { left: "3%", top: "12%", w: "148px", rot: "-7deg", op: "0.24", dur: "11s", gx: "12px", gy: "-20px" },
          { left: "84%", top: "10%", w: "152px", rot: "6deg", op: "0.24", dur: "13s", gx: "-12px", gy: "-18px" },
          { left: "6%", top: "46%", w: "134px", rot: "5deg", op: "0.2", dur: "12s", gx: "10px", gy: "-16px" },
          { left: "86%", top: "48%", w: "138px", rot: "-6deg", op: "0.2", dur: "14s", gx: "-10px", gy: "-20px" },
          { left: "4%", top: "76%", w: "146px", rot: "-5deg", op: "0.22", dur: "10s", gx: "12px", gy: "-14px" },
          { left: "83%", top: "75%", w: "144px", rot: "7deg", op: "0.22", dur: "12s", gx: "-12px", gy: "-16px" }
        ];

    container.innerHTML = "";
    let poolIdx = Math.floor(Math.random() * photos.length);
    const cards = [];

    slots.forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "dream-glimpse";
      card.style.left = s.left;
      card.style.top = s.top;
      card.style.setProperty("--gw", s.w);
      card.style.setProperty("--grot", s.rot);
      card.style.setProperty("--gop", s.op);
      card.style.setProperty("--gdur", s.dur);
      card.style.setProperty("--gx", s.gx);
      card.style.setProperty("--gy", s.gy);

      const img = document.createElement("img");
      img.src = photos[poolIdx++ % photos.length].thumb;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);
      container.appendChild(card);
      cards.push({ card, img });

      setTimeout(() => card.classList.add("visible"), 260 + i * 240);
    });

    // Gently crossfade one background glimpse to a new photo every 5s
    let slotTurn = 0;
    setInterval(() => {
      if (document.hidden || !cards.length) return;
      const target = cards[slotTurn++ % cards.length];
      target.card.classList.remove("visible");
      setTimeout(() => {
        target.img.src = photos[poolIdx++ % photos.length].thumb;
        target.card.classList.add("visible");
      }, 1500);
    }, 5200);
  };

  /* ---------- Cute Floating Love-Charm Button ---------- */
  function initLoveFab() {
    const fab = $("love-tap-fab");
    if (!fab) return;
    const whispers = ["মহারানী", "লক্ষ্মী", "কুচুপুচু", "My Glow Queen", "Foodie Maharani", "ভালোবাসি", "শুভ জন্মদিন"];
    let idx = 0;

    fab.addEventListener("click", () => {
      if (window.SiteSFX) window.SiteSFX.chime();
      const r = fab.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top;

      if (window.SiteParticles) {
        window.SiteParticles.burst(cx, cy, 24, 0.9);
      }

      const pill = document.createElement("span");
      pill.className = "love-whisper-pill";
      pill.textContent = whispers[idx++ % whispers.length];
      pill.style.left = `${Math.min(window.innerWidth - 76, Math.max(76, cx - 28))}px`;
      pill.style.top = `${cy - 12}px`;
      document.body.appendChild(pill);
      setTimeout(() => pill.remove(), 1650);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateCopy();
    prepareHeroHeadline();
    initScrollProgress();
    initMusic();
    initFilm();
    initTimeline();
    initReasons();
    initChapterReveals();
    initLoveFab();
    initFinale();
    initOnboarding();
  });
})();
