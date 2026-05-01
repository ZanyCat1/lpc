document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gallery-modal");
  const wrapper = document.querySelector(".swiper-wrapper");
  const closeBtn = document.getElementById("gallery-close");

  let swiper;

  const cards = document.querySelectorAll(".gallery-card");
  const filmstrip = document.querySelector(".gallery-filmstrip");

  function loadThumb(i) {
    const thumbs = filmstrip.querySelectorAll(".filmstrip-thumb");

    const radius = 6; // how many to load around current

    for (let d = -radius; d <= radius; d++) {
      const idx = i + d;
      const t = thumbs[idx];
      if (!t || t.dataset.loaded) continue;

      t.src = t.dataset.src;
      t.dataset.loaded = "true";
    }
  }

  function loadThumbsInView() {
    const thumbs = filmstrip.querySelectorAll(".filmstrip-thumb");
    const stripRect = filmstrip.getBoundingClientRect();

    thumbs.forEach((t) => {
      if (t.dataset.loaded) return;

      const r = t.getBoundingClientRect();

      if (r.right > stripRect.left - 100 && r.left < stripRect.right + 100) {
        t.src = t.dataset.src;
        t.dataset.loaded = "true";
      }
    });
  }

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

        thumb.dataset.src = item.thumb;
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
        fadeEffect: { crossFade: true },
        initialSlide: index,
      });

      function loadSlideImage(slideEl) {
        const img = slideEl.querySelector("img");
        if (!img || img.dataset.loaded) return;

        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        if (img.dataset.sizes) img.sizes = img.dataset.sizes;

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
        if (thumbs[activeIndex]) thumbs[activeIndex].classList.add("active");

        scrollFilmstripTo(activeIndex);
      };

      requestAnimationFrame(() => {
        updateActive(swiper.realIndex);

        requestAnimationFrame(() => {
          loadThumb(swiper.realIndex);
          filmstrip.classList.add("smooth-scroll");
        });
      });

      swiper.on("slideChange", () => {
        const realIndex = swiper.realIndex;
        updateActive(realIndex);

        loadThumb(realIndex);
        loadThumbsInView();

        const i = swiper.activeIndex;

        [i, i + 1, i - 1].forEach((idx) => {
          const slide = swiper.slides[idx];
          if (slide) loadSlideImage(slide);
        });
      });

      filmstrip.addEventListener("scroll", loadThumbsInView);

      const filmstripItems = filmstrip.querySelectorAll(".filmstrip-thumb");

      filmstripItems.forEach((thumb, i) => {
        thumb.addEventListener("click", () => {
          swiper.slideToLoop(i);
        });
      });
    });
  });

  function closeModal() {
    filmstrip.classList.remove("smooth-scroll");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  closeBtn.onclick = closeModal;

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
});
