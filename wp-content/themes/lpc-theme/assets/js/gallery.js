document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // GRID: 2-STAGE LAZY CONTROL
  // =========================
  const gridImgs = document.querySelectorAll(".gallery-thumb img");

  gridImgs.forEach((img) => {
    // store original responsive data
    img.dataset.src = img.currentSrc || img.src;
    img.dataset.srcset = img.srcset;
    img.dataset.sizes = img.sizes;

    // force initial low-res thumbnail only
    img.srcset = "";
    img.sizes = "";
  });

  // Stage 1: 200% viewport → load 150px only
  const nearObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const img = entry.target;

        if (img.dataset.nearLoaded) return;

        // already has src (150px), just mark it
        img.dataset.nearLoaded = "true";

        obs.unobserve(img);
      });
    },
    {
      rootMargin: "100% 0px", // 200% total (1 screen above + below)
      threshold: 0.01,
    },
  );

  // Stage 2: visible → upgrade to responsive
  const visibleObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const img = entry.target;

        if (img.dataset.upgraded) return;

        // restore responsive behavior
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        if (img.dataset.sizes) {
          img.sizes = img.dataset.sizes;
        }

        img.dataset.upgraded = "true";

        obs.unobserve(img);
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.25,
    },
  );

  gridImgs.forEach((img) => {
    nearObserver.observe(img);
    visibleObserver.observe(img);
  });

  // =========================
  // MODAL / SWIPER (UNCHANGED)
  // =========================
  const modal = document.getElementById("gallery-modal");
  const wrapper = document.querySelector(".swiper-wrapper");
  const closeBtn = document.getElementById("gallery-close");

  let swiper;

  const cards = document.querySelectorAll(".gallery-card");
  const filmstrip = document.querySelector(".gallery-filmstrip");

  cards.forEach((card) => {
    const index = parseInt(card.dataset.index, 10);

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      const gallery = window.galleryData || [];

      wrapper.innerHTML = "";
      filmstrip.innerHTML = "";

      gallery.forEach((item, i) => {
        const slide = document.createElement("div");
        const thumb = document.createElement("img");

        slide.classList.add("swiper-slide");

        slide.innerHTML = `
          <div class="slide-inner">
            <div class="slide-content">
              <img 
                data-src="${item.src}" 
                data-srcset="${item.srcset || ""}" 
                data-sizes="${item.sizes || ""}" 
                alt="${item.alt || ""}"
              >
              <div class="slide-meta">
                ${item.caption ? `<strong>${item.caption}</strong>` : ""}
                ${item.description ? `<p>${item.description}</p>` : ""}
              </div>
            </div>
          </div>
        `;

        thumb.src = item.thumb;
        thumb.classList.add("filmstrip-thumb");
        thumb.dataset.index = i;

        wrapper.appendChild(slide);
        filmstrip.appendChild(thumb);
      });

      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      if (swiper) swiper.destroy(true, true);

      swiper = new Swiper(".gallery-swiper", {
        slidesPerView: 1,
        spaceBetween: 1,
        speed: 500,
        loop: true,
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        initialSlide: index,
      });

      function loadSlideImage(slideEl) {
        const img = slideEl.querySelector("img");
        if (!img || img.dataset.loaded) return;

        img.src = img.dataset.src;

        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        if (img.dataset.sizes) {
          img.sizes = img.dataset.sizes;
        }

        img.dataset.loaded = "true";
      }

      loadSlideImage(swiper.slides[swiper.activeIndex] || swiper.slides[0]);

      const scrollFilmstripTo = (index) => {
        const thumbs = document.querySelectorAll(".filmstrip-thumb");

        thumbs.forEach((el, i) => {
          el.classList.toggle("active", i === index);
        });

        const active = thumbs[index];
        if (!active) return;

        const containerCenter = filmstrip.clientWidth / 2;
        const itemCenter = active.offsetLeft + active.offsetWidth / 2;

        filmstrip.scrollLeft = itemCenter - containerCenter;
      };

      const updateActive = (activeIndex) => {
        const thumbs = filmstrip.querySelectorAll(".filmstrip-thumb");

        thumbs.forEach((t) => t.classList.remove("active"));
        if (thumbs[activeIndex]) {
          thumbs[activeIndex].classList.add("active");
        }
        scrollFilmstripTo(activeIndex);
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateActive(swiper.realIndex);
          filmstrip.classList.add("smooth-scroll");
        });
      });

      swiper.on("slideChange", () => {
        const realIndex = swiper.realIndex;
        updateActive(realIndex);

        const i = swiper.activeIndex;

        [i, i + 1, i - 1].forEach((idx) => {
          const slide = swiper.slides[idx];
          if (slide) loadSlideImage(slide);
        });
      });

      const filmstripItems = filmstrip.querySelectorAll(".filmstrip-thumb");

      filmstripItems.forEach((thumb, i) => {
        thumb.addEventListener("click", () => {
          swiper.slideToLoop(i);
        });
      });
    });

    closeBtn.onclick = () => closeModal();

    modal.onclick = (e) => {
      if (e.target === modal) {
        closeModal();
      }
    };
  });

  function closeModal() {
    filmstrip.classList.remove("smooth-scroll");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
});
