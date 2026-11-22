/**
 * Gallery module:
 *  - Fetches assets/media.json
 *  - 3D curved swipeable featured carousel
 *  - Memory of the Day + Surprise Me + Slideshow of Us
 *  - Album chapters + Masonry Love Wall (batches of 24 via IntersectionObserver)
 *  - Lightbox with swipe, pinch-zoom, double-tap zoom, keyboard nav, next-image preload
 */
(function () {
  const BATCH_SIZE = 24;
  let allMedia = [];
  let filteredMedia = [];
  let renderedCount = 0;
  let activeAlbum = "__ALL__";
  let observer = null;

  // Carousel state
  let featuredItems = [];
  let carouselIdx = 0;

  // Lightbox state
  let lbItems = [];
  let lbIdx = 0;
  let lbScale = 1;
  let pinchStartDist = 0;
  let pinchStartScale = 1;
  let swipeStartX = 0;

  // Slideshow state
  let ssItems = [];
  let ssIdx = 0;
  let ssTimer = null;
  let ssPaused = false;

  const $ = (id) => document.getElementById(id);

  function getAlbumDisplay(albumKey) {
    const map = window.SITE_CONFIG?.gallery?.albums || {};
    if (map[albumKey]) return map[albumKey];
    return { bn: albumKey, en: albumKey };
  }

  function dateSeedIndex(length) {
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
    }
    return hash % length;
  }

  /* ---------- 3D Curved Carousel ---------- */
  function initCarousel() {
    const wrap = $("featured-carousel-wrap");
    const track = $("carousel-track");
    const dots = $("carousel-dots");
    const stage = $("carousel-stage");
    if (!wrap || !track || !dots) return;

    featuredItems = allMedia.filter((m) => m.featured);
    if (featuredItems.length === 0) featuredItems = allMedia.slice(0, Math.min(6, allMedia.length));
    if (featuredItems.length === 0) {
      wrap.hidden = true;
      return;
    }

    wrap.hidden = false;
    track.innerHTML = "";
    dots.innerHTML = "";

    featuredItems.forEach((item, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "carousel-slide";
      btn.setAttribute("aria-label", `Featured memory ${idx + 1} of ${featuredItems.length}`);

      const img = document.createElement("img");
      img.src = item.thumb || item.poster;
      img.alt = item.caption || `Featured memory ${idx + 1}`;
      img.loading = idx < 3 ? "eager" : "lazy";
      btn.appendChild(img);

      btn.addEventListener("click", () => {
        if (idx === carouselIdx) {
          openLightbox(featuredItems, idx);
        } else {
          carouselIdx = idx;
          updateCarousel();
        }
      });
      track.appendChild(btn);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      dot.addEventListener("click", () => {
        carouselIdx = idx;
        updateCarousel();
      });
      dots.appendChild(dot);
    });

    $("carousel-prev")?.addEventListener("click", () => moveCarousel(-1));
    $("carousel-next")?.addEventListener("click", () => moveCarousel(1));

    // Touch/pointer swipe
    let startX = 0;
    stage.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
    });
    stage.addEventListener("pointerup", (e) => {
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 36) moveCarousel(dx < 0 ? 1 : -1);
    });

    // Keyboard navigation
    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveCarousel(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveCarousel(1);
      }
    });

    updateCarousel();
  }

  function moveCarousel(delta) {
    if (!featuredItems.length) return;
    carouselIdx = (carouselIdx + delta + featuredItems.length) % featuredItems.length;
    updateCarousel();
  }

  function updateCarousel() {
    const slides = document.querySelectorAll("#carousel-track .carousel-slide");
    const dots = document.querySelectorAll("#carousel-dots .carousel-dot");
    const n = slides.length;
    const isDesktop = window.innerWidth >= 768;
    const spread = isDesktop ? 185 : 132;

    slides.forEach((slide, i) => {
      let offset = i - carouselIdx;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;

      const abs = Math.abs(offset);
      const visible = abs <= 2;
      const tx = offset * spread;
      const tz = -abs * 110;
      const ry = offset * -18;
      const scale = Math.max(0.72, 1 - abs * 0.14);

      slide.style.transform = `translate(-50%, -50%) translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(${scale})`;
      slide.style.zIndex = String(10 - abs);
      slide.style.opacity = visible ? String(Math.max(0.35, 1 - abs * 0.28)) : "0";
      slide.style.pointerEvents = visible ? "auto" : "none";
      slide.style.filter = abs === 0 ? "none" : "brightness(0.72)";
    });

    dots.forEach((d, i) => d.classList.toggle("active", i === carouselIdx));
  }

  /* ---------- Memory of the Day & Quick Actions ---------- */
  function initHighlights() {
    const motdCard = $("memory-of-day");
    if (motdCard && allMedia.length > 0) {
      const idx = dateSeedIndex(allMedia.length);
      const item = allMedia[idx];
      $("motd-img").src = item.thumb || item.poster;
      $("motd-img").alt = item.caption || "Memory of the day";
      $("motd-date").textContent = item.date || item.album || "";
      motdCard.hidden = false;
      $("motd-open").onclick = () => openLightbox(allMedia, idx);
    }

    $("surprise-memory-btn")?.addEventListener("click", () => {
      if (!allMedia.length) return;
      if (window.SiteSFX) window.SiteSFX.chime();
      const idx = Math.floor(Math.random() * allMedia.length);
      if (window.SiteParticles) {
        const rect = $("surprise-memory-btn").getBoundingClientRect();
        window.SiteParticles.burst(rect.left + rect.width / 2, rect.top, 24, 0.7);
      }
      openLightbox(allMedia, idx);
    });

    $("slideshow-btn")?.addEventListener("click", startSlideshow);
  }

  /* ---------- Album Chapters ---------- */
  function initAlbums() {
    const container = $("album-chapters");
    if (!container) return;
    container.innerHTML = "";

    const cfg = window.SITE_CONFIG?.gallery || {};
    const counts = new Map();
    const covers = new Map();

    allMedia.forEach((item) => {
      const alb = item.album || "Moments";
      counts.set(alb, (counts.get(alb) || 0) + 1);
      if (!covers.has(alb)) covers.set(alb, item.thumb || item.poster);
    });

    const chapters = [
      {
        key: "__ALL__",
        bn: cfg.allAlbumsBn || "সব মুহূর্ত",
        en: `${cfg.allAlbumsEn || "All"} (${allMedia.length})`,
        cover: allMedia[0]?.thumb || allMedia[0]?.poster || ""
      }
    ];

    counts.forEach((count, key) => {
      const disp = getAlbumDisplay(key);
      chapters.push({
        key,
        bn: disp.bn,
        en: `${disp.en} (${count})`,
        cover: covers.get(key) || ""
      });
    });

    chapters.forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "album-chip" + (ch.key === activeAlbum ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(ch.key === activeAlbum));

      if (ch.cover) {
        const img = document.createElement("img");
        img.className = "album-chip-cover";
        img.src = ch.cover;
        img.alt = "";
        img.loading = "lazy";
        btn.appendChild(img);
      }

      const txt = document.createElement("span");
      txt.className = "album-chip-text";
      txt.innerHTML = `<span class="album-chip-bn" lang="bn"></span><span class="album-chip-en" lang="en"></span>`;
      txt.querySelector(".album-chip-bn").textContent = ch.bn;
      txt.querySelector(".album-chip-en").textContent = ch.en;
      btn.appendChild(txt);

      btn.addEventListener("click", () => {
        activeAlbum = ch.key;
        container.querySelectorAll(".album-chip").forEach((el) => {
          el.classList.remove("active");
          el.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        applyFilter();
      });

      container.appendChild(btn);
    });
  }

  /* ---------- Masonry Love Wall (Batches of 24) ---------- */
  function applyFilter() {
    filteredMedia =
      activeAlbum === "__ALL__"
        ? allMedia
        : allMedia.filter((m) => (m.album || "Moments") === activeAlbum);

    const wall = $("love-wall");
    if (!wall) return;
    wall.innerHTML = "";
    renderedCount = 0;

    if (filteredMedia.length === 0) {
      const p = document.createElement("p");
      p.className = "section-sub";
      p.textContent = window.SITE_CONFIG?.gallery?.emptyText || "No memories yet.";
      wall.appendChild(p);
      $("wall-load-more-wrap").hidden = true;
      return;
    }

    renderNextBatch();
    setupObserver();
  }

  function renderNextBatch() {
    const wall = $("love-wall");
    if (!wall) return;

    const end = Math.min(renderedCount + BATCH_SIZE, filteredMedia.length);
    const frag = document.createDocumentFragment();

    for (let i = renderedCount; i < end; i++) {
      const item = filteredMedia[i];
      const wrap = document.createElement("div");
      wrap.className = "wall-item";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "polaroid-card";
      const tilt = ((i % 2 === 0 ? 1 : -1) * (0.6 + ((i * 19) % 18) / 10)).toFixed(1);
      btn.style.setProperty("--tilt", `${tilt}deg`);
      btn.setAttribute("aria-label", item.caption || `Open ${item.type} memory ${i + 1}`);

      const mediaBox = document.createElement("div");
      mediaBox.className = "polaroid-media";

      const img = document.createElement("img");
      img.src = item.thumb || item.poster;
      img.alt = item.caption || `Memory ${i + 1}`;
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
      if (img.complete) img.classList.add("loaded");
      mediaBox.appendChild(img);

      if (item.type === "video") {
        const badge = document.createElement("span");
        badge.className = "video-badge";
        badge.innerHTML =
          '<span class="video-badge-circle"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>';
        mediaBox.appendChild(badge);
      }

      btn.appendChild(mediaBox);

      if (item.caption) {
        const cap = document.createElement("p");
        cap.className = "polaroid-caption";
        cap.textContent = item.caption;
        btn.appendChild(cap);
      }

      const itemIdx = i;
      btn.addEventListener("click", () => openLightbox(filteredMedia, itemIdx));
      wrap.appendChild(btn);
      frag.appendChild(wrap);
    }

    wall.appendChild(frag);
    renderedCount = end;

    const loadMoreWrap = $("wall-load-more-wrap");
    if (loadMoreWrap) {
      loadMoreWrap.hidden = renderedCount >= filteredMedia.length;
    }
  }

  function setupObserver() {
    if (observer) observer.disconnect();
    const sentinel = $("wall-sentinel");
    if (!sentinel || !("IntersectionObserver" in window)) return;

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && renderedCount < filteredMedia.length) {
          renderNextBatch();
        }
      },
      { rootMargin: "320px 0px" }
    );
    observer.observe(sentinel);
  }

  /* ---------- Lightbox ---------- */
  function openLightbox(items, idx) {
    lbItems = items;
    lbIdx = idx;
    const lb = $("lightbox");
    if (!lb) return;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    renderLightboxItem();
  }

  function closeLightbox() {
    const lb = $("lightbox");
    const vid = $("lb-video");
    if (vid) {
      vid.pause();
      vid.removeAttribute("src");
      vid.load();
    }
    if (lb) lb.hidden = true;
    document.body.style.overflow = "";
    resetZoom();
  }

  function resetZoom() {
    lbScale = 1;
    const img = $("lb-img");
    if (img) img.style.transform = "scale(1)";
  }

  function renderLightboxItem() {
    const item = lbItems[lbIdx];
    if (!item) return;

    const img = $("lb-img");
    const vid = $("lb-video");
    resetZoom();

    // Pause any playing story film
    const storyVideo = $("story-video");
    if (storyVideo && !storyVideo.paused) storyVideo.pause();

    if (item.type === "video") {
      img.hidden = true;
      vid.hidden = false;
      vid.poster = item.poster || item.thumb || "";
      vid.src = item.full;
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.hidden = true;
      img.hidden = false;
      img.src = item.full || item.thumb;
      img.alt = item.caption || "Memory photo";
    }

    const metaParts = [];
    if (item.album) metaParts.push(getAlbumDisplay(item.album).en);
    if (item.date) metaParts.push(item.date);
    $("lb-meta").textContent = metaParts.join("  •  ");
    $("lb-caption").textContent = item.caption || "";

    // Preload next image for instant swipe
    const nextItem = lbItems[(lbIdx + 1) % lbItems.length];
    if (nextItem && nextItem.type === "photo" && nextItem.full) {
      const preload = new Image();
      preload.src = nextItem.full;
    }
  }

  function stepLightbox(delta) {
    if (!lbItems.length) return;
    lbIdx = (lbIdx + delta + lbItems.length) % lbItems.length;
    renderLightboxItem();
  }

  function initLightboxEvents() {
    const lb = $("lightbox");
    const stage = $("lb-stage");
    const img = $("lb-img");
    if (!lb || !stage || !img) return;

    $("lb-close")?.addEventListener("click", closeLightbox);
    $("lb-prev")?.addEventListener("click", () => stepLightbox(-1));
    $("lb-next")?.addEventListener("click", () => stepLightbox(1));

    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
    });

    // Double-tap / double-click zoom
    img.addEventListener("dblclick", () => {
      lbScale = lbScale > 1 ? 1 : 2;
      img.style.transform = `scale(${lbScale})`;
    });

    // Pinch-to-zoom & horizontal swipe
    stage.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 2) {
          pinchStartDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          pinchStartScale = lbScale;
        } else if (e.touches.length === 1) {
          swipeStartX = e.touches[0].clientX;
        }
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 2 && pinchStartDist > 0) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          lbScale = Math.min(3, Math.max(1, pinchStartScale * (dist / pinchStartDist)));
          img.style.transform = `scale(${lbScale})`;
        }
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchend",
      (e) => {
        if (e.changedTouches.length === 1 && lbScale <= 1.05) {
          const dx = e.changedTouches[0].clientX - swipeStartX;
          if (Math.abs(dx) > 48) stepLightbox(dx < 0 ? 1 : -1);
        }
      },
      { passive: true }
    );
  }

  /* ---------- Slideshow of Us ---------- */
  function startSlideshow() {
    const photos = allMedia.filter((m) => m.type === "photo");
    if (!photos.length) return;

    const featured = photos.filter((p) => p.featured);
    const others = photos.filter((p) => !p.featured);
    ssItems = [...featured, ...others].slice(0, 30);
    ssIdx = 0;
    ssPaused = false;

    const modal = $("slideshow-modal");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("slideshow-play-pause").textContent = "Pause";

    // Optionally start background music if available
    if (window.SiteMusic && !window.SiteMusic.isPlaying()) {
      window.SiteMusic.play();
    }

    showSlideshowFrame();
    scheduleSlideshowNext();
  }

  function showSlideshowFrame() {
    const item = ssItems[ssIdx];
    const img = $("slideshow-img");
    if (!item || !img) return;

    img.classList.remove("ken-burns");
    void img.offsetWidth;
    img.src = item.full || item.thumb;
    img.alt = item.caption || `Slideshow memory ${ssIdx + 1}`;
    img.classList.add("ken-burns");

    $("slideshow-counter").textContent = `${ssIdx + 1} / ${ssItems.length}`;
    $("slideshow-caption").textContent = item.caption || "";
  }

  function scheduleSlideshowNext() {
    clearInterval(ssTimer);
    if (ssPaused) return;
    ssTimer = setInterval(() => {
      ssIdx = (ssIdx + 1) % ssItems.length;
      showSlideshowFrame();
    }, 6200);
  }

  function closeSlideshow() {
    clearInterval(ssTimer);
    ssTimer = null;
    const modal = $("slideshow-modal");
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
  }

  function initSlideshowEvents() {
    $("slideshow-close")?.addEventListener("click", closeSlideshow);
    $("slideshow-play-pause")?.addEventListener("click", () => {
      ssPaused = !ssPaused;
      $("slideshow-play-pause").textContent = ssPaused ? "Play" : "Pause";
      if (ssPaused) clearInterval(ssTimer);
      else scheduleSlideshowNext();
    });
    document.addEventListener("keydown", (e) => {
      const modal = $("slideshow-modal");
      if (modal && !modal.hidden && e.key === "Escape") closeSlideshow();
    });
  }

  /* ---------- Init ---------- */
  async function initGallery() {
    initLightboxEvents();
    initSlideshowEvents();

    const loadMoreBtn = $("wall-load-more");
    if (loadMoreBtn) {
      loadMoreBtn.textContent = window.SITE_CONFIG?.gallery?.loadMoreLabel || "Load more";
      loadMoreBtn.addEventListener("click", renderNextBatch);
    }

    try {
      const res = await fetch("assets/media.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allMedia = Array.isArray(data) ? data : [];
    } catch {
      allMedia = [];
    }

    initCarousel();
    initHighlights();
    initAlbums();
    applyFilter();

    window.addEventListener("resize", updateCarousel, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", initGallery);
})();
