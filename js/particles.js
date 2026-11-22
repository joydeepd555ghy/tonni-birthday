/**
 * Ambient Canvas (falling rose petals + drifting golden bokeh orbs)
 * and Fireworks Canvas (heart bursts + finale sky fireworks).
 * Pauses automatically when the tab is hidden and respects prefers-reduced-motion.
 */
(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ambientCanvas = document.getElementById("ambient-canvas");
  const fwCanvas = document.getElementById("fireworks-canvas");
  if (!ambientCanvas || !fwCanvas) return;

  const actx = ambientCanvas.getContext("2d");
  const fctx = fwCanvas.getContext("2d");

  let W = 0;
  let H = 0;
  let dpr = 1;
  let ambientRaf = null;
  let fwRaf = null;
  let finaleLoopTimer = null;

  const petals = [];
  const bokeh = [];
  const floatHearts = [];
  const stars = [];
  const shootingStars = [];
  const fwParticles = [];
  let nextShootAt = performance.now() + 3500;

  const PETAL_COLORS = ["#ff7a9c", "#ff9db5", "#e8587f", "#ffd0dc"];
  const FW_COLORS = ["#f2c36b", "#ff7a9c", "#ffd0dc", "#fbe9dc", "#ff9db5"];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    ambientCanvas.width = Math.floor(W * dpr);
    ambientCanvas.height = Math.floor(H * dpr);
    fwCanvas.width = Math.floor(W * dpr);
    fwCanvas.height = Math.floor(H * dpr);
    actx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createPetal(randomY) {
    const depth = 0.45 + Math.random() * 0.55;
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : -24 - Math.random() * 40,
      size: (7 + Math.random() * 8) * depth,
      vy: (0.45 + Math.random() * 0.75) * depth,
      vx: (Math.random() - 0.5) * 0.4,
      swayAmp: 0.4 + Math.random() * 0.9,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.02,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      alpha: 0.25 + depth * 0.45,
      blur: depth < 0.7 ? 1.5 : 0,
      color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]
    };
  }

  function createBokeh(randomY) {
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : H + 20 + Math.random() * 60,
      r: 3 + Math.random() * 14,
      vy: -(0.18 + Math.random() * 0.42),
      vx: (Math.random() - 0.5) * 0.2,
      alpha: 0.06 + Math.random() * 0.16,
      phase: Math.random() * Math.PI * 2
    };
  }

  function createFloatHeart(randomY) {
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : H + 20 + Math.random() * 50,
      s: 4 + Math.random() * 6.5,
      vy: -(0.35 + Math.random() * 0.55),
      phase: Math.random() * Math.PI * 2,
      sway: 0.35 + Math.random() * 0.65,
      alpha: 0.16 + Math.random() * 0.24,
      color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]
    };
  }

  function initAmbient() {
    petals.length = 0;
    bokeh.length = 0;
    floatHearts.length = 0;
    stars.length = 0;
    const isMobile = W < 640;
    const petalCount = isMobile ? 20 : 28;
    const bokehCount = isMobile ? 10 : 16;
    const heartCount = isMobile ? 12 : 18;
    const starCount = isMobile ? 22 : 34;
    for (let i = 0; i < petalCount; i++) petals.push(createPetal(true));
    for (let i = 0; i < bokehCount; i++) bokeh.push(createBokeh(true));
    for (let i = 0; i < heartCount; i++) floatHearts.push(createFloatHeart(true));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.75,
        r: 0.7 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.018 + Math.random() * 0.025
      });
    }
  }

  function drawPetal(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    if (p.blur > 0) {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.blur * 4;
    }
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.85, -p.size * 0.5, p.size * 0.75, p.size * 0.65, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.65, -p.size * 0.85, -p.size * 0.5, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }

  function drawHeartShape(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.35);
    ctx.bezierCurveTo(x - s, y + s * 0.8, x, y + s * 1.05, x, y + s * 1.3);
    ctx.bezierCurveTo(x, y + s * 1.05, x + s, y + s * 0.8, x + s, y + s * 0.35);
    ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.3);
    ctx.fill();
  }

  function renderAmbientFrame() {
    actx.clearRect(0, 0, W, H);

    // Twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.phase += s.speed;
      const a = 0.15 + (Math.sin(s.phase) + 1) * 0.25;
      actx.fillStyle = `rgba(251, 233, 220, ${a.toFixed(3)})`;
      actx.beginPath();
      actx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      actx.fill();
    }

    // Occasional shooting star
    const now = performance.now();
    if (now > nextShootAt && shootingStars.length < 1) {
      nextShootAt = now + 5500 + Math.random() * 6500;
      shootingStars.push({
        x: W * (0.15 + Math.random() * 0.65),
        y: H * (0.06 + Math.random() * 0.25),
        vx: 7 + Math.random() * 4,
        vy: 3.2 + Math.random() * 2,
        life: 1
      });
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const st = shootingStars[i];
      st.x += st.vx;
      st.y += st.vy;
      st.life -= 0.025;
      if (st.life <= 0) {
        shootingStars.splice(i, 1);
        continue;
      }
      const grad = actx.createLinearGradient(st.x, st.y, st.x - st.vx * 8, st.y - st.vy * 8);
      grad.addColorStop(0, `rgba(242, 195, 107, ${st.life})`);
      grad.addColorStop(1, "rgba(242, 195, 107, 0)");
      actx.strokeStyle = grad;
      actx.lineWidth = 1.8;
      actx.beginPath();
      actx.moveTo(st.x, st.y);
      actx.lineTo(st.x - st.vx * 8, st.y - st.vy * 8);
      actx.stroke();
    }

    for (let i = 0; i < bokeh.length; i++) {
      const b = bokeh[i];
      b.y += b.vy;
      b.x += b.vx + Math.sin((b.phase += 0.01)) * 0.15;
      if (b.y < -30) Object.assign(b, createBokeh(false));

      const grad = actx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2);
      grad.addColorStop(0, `rgba(242, 195, 107, ${b.alpha})`);
      grad.addColorStop(1, "rgba(242, 195, 107, 0)");
      actx.fillStyle = grad;
      actx.beginPath();
      actx.arc(b.x, b.y, b.r * 2, 0, Math.PI * 2);
      actx.fill();
    }

    for (let i = 0; i < floatHearts.length; i++) {
      const h = floatHearts[i];
      h.y += h.vy;
      h.x += Math.sin((h.phase += 0.02)) * h.sway;
      if (h.y < -28) Object.assign(h, createFloatHeart(false));
      actx.save();
      actx.globalAlpha = h.alpha;
      actx.fillStyle = h.color;
      drawHeartShape(actx, h.x, h.y, h.s);
      actx.restore();
    }

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.swayPhase += p.swaySpeed;
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp;
      p.rot += p.rotSpeed;
      if (p.y > H + 30 || p.x < -40 || p.x > W + 40) {
        Object.assign(p, createPetal(false));
      }
      drawPetal(actx, p);
    }
  }

  function startAmbient() {
    if (reducedMotion || ambientRaf !== null) return;
    const loop = () => {
      if (document.hidden) {
        ambientRaf = null;
        return;
      }
      renderAmbientFrame();
      ambientRaf = requestAnimationFrame(loop);
    };
    ambientRaf = requestAnimationFrame(loop);
  }

  function stopAmbient() {
    if (ambientRaf !== null) {
      cancelAnimationFrame(ambientRaf);
      ambientRaf = null;
    }
  }

  /* Fireworks & Heart Bursts */
  function spawnBurst(x, y, count = 42, heartRatio = 0.4) {
    if (reducedMotion) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const speed = 1.8 + Math.random() * 5.2;
      fwParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        gravity: 0.065,
        drag: 0.985,
        size: 3 + Math.random() * 5,
        alpha: 1,
        decay: 0.011 + Math.random() * 0.01,
        isHeart: Math.random() < heartRatio,
        color: FW_COLORS[(Math.random() * FW_COLORS.length) | 0]
      });
    }
    startFireworksLoop();
  }

  function spawnHeartRain(count = 28) {
    if (reducedMotion) return;
    for (let i = 0; i < count; i++) {
      fwParticles.push({
        x: Math.random() * W,
        y: -20 - Math.random() * 140,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1.4 + Math.random() * 2.1,
        gravity: 0.01,
        drag: 0.998,
        size: 5 + Math.random() * 6,
        alpha: 0.95,
        decay: 0.004,
        isHeart: true,
        color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]
      });
    }
    startFireworksLoop();
  }

  function startFireworksLoop() {
    if (fwRaf !== null) return;
    const loop = () => {
      if (document.hidden) {
        fwRaf = null;
        return;
      }
      fctx.clearRect(0, 0, W, H);
      for (let i = fwParticles.length - 1; i >= 0; i--) {
        const p = fwParticles[i];
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0.01 || p.y > H + 60) {
          fwParticles.splice(i, 1);
          continue;
        }
        fctx.save();
        fctx.globalAlpha = p.alpha;
        fctx.fillStyle = p.color;
        if (p.isHeart) {
          drawHeartShape(fctx, p.x, p.y - p.size * 0.5, p.size);
        } else {
          fctx.beginPath();
          fctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
          fctx.fill();
        }
        fctx.restore();
      }

      if (fwParticles.length > 0) {
        fwRaf = requestAnimationFrame(loop);
      } else {
        fctx.clearRect(0, 0, W, H);
        fwRaf = null;
      }
    };
    fwRaf = requestAnimationFrame(loop);
  }

  function startFinaleShow() {
    if (reducedMotion) return;
    if (window.SiteSFX) window.SiteSFX.finaleChord();
    const launch = () => {
      spawnBurst(
        W * (0.18 + Math.random() * 0.64),
        H * (0.16 + Math.random() * 0.36),
        46,
        0.35
      );
      spawnHeartRain(12);
      if (window.SiteSFX) window.SiteSFX.firework();
    };
    launch();
    setTimeout(launch, 350);
    setTimeout(launch, 750);
    if (!finaleLoopTimer) {
      let rounds = 0;
      finaleLoopTimer = setInterval(() => {
        rounds++;
        if (!document.hidden) launch();
        if (rounds >= 10) {
          clearInterval(finaleLoopTimer);
          finaleLoopTimer = null;
        }
      }, 1100);
    }
  }

  window.addEventListener("resize", () => {
    resize();
    if (!reducedMotion && petals.length === 0) initAmbient();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAmbient();
    } else {
      startAmbient();
      if (fwParticles.length > 0) startFireworksLoop();
    }
  });

  resize();
  if (!reducedMotion) {
    initAmbient();
    startAmbient();
  }

  window.SiteParticles = {
    burst: spawnBurst,
    heartRain: spawnHeartRain,
    finaleShow: startFinaleShow
  };
})();
