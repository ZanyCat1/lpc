document.addEventListener("DOMContentLoaded", () => {
  console.log("AM I HERE");
  const modal = document.getElementById("gallery-modal");
  const wrapper = document.querySelector(".swiper-wrapper");
  const closeBtn = document.getElementById("gallery-close");

  let swiper;

  const images = document.querySelectorAll(".gallery-thumb img");
  const filmstrip = document.querySelector(".gallery-filmstrip");

  images.forEach((img, index) => {
    img.style.cursor = "pointer";

    img.addEventListener("click", () => {
      console.log("CLICKED", index);

      const gallery = window.galleryData || [];

      wrapper.innerHTML = "";
      filmstrip.innerHTML = "";

      gallery.forEach((item) => {
        const slide = document.createElement("div");
        const thumb = document.createElement("img");
        slide.classList.add("swiper-slide");

        slide.innerHTML = `
        <div class="slide-inner">
          <div class="slide-content">
            <img 
              src="${item.src}" 
              srcset="${item.srcset || ""}" 
              sizes="${item.sizes || ""}" 
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
        thumb.dataset.index = gallery.indexOf(item);

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

      const scrollFilmstripTo = (index) => {
        const thumbs = filmstrip.querySelectorAll(".filmstrip-thumb");
        const active = thumbs[index];

        if (!active) return;

        const containerRect = filmstrip.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();

        const offset =
          activeRect.left -
          containerRect.left -
          containerRect.width / 2 +
          activeRect.width / 2;

        filmstrip.scrollBy({
          left: offset,
          behavior: "smooth",
        });
      };

      const updateActive = (activeIndex) => {
        const thumbs = filmstrip.querySelectorAll(".filmstrip-thumb");

        thumbs.forEach((t) => t.classList.remove("active"));
        if (thumbs[activeIndex]) {
          thumbs[activeIndex].classList.add("active");
        }
        scrollFilmstripTo(activeIndex);
      };

      updateActive(index);

      swiper.on("slideChange", () => {
        const realIndex = swiper.realIndex;
        updateActive(realIndex);
      });

      const filmstripItems = filmstrip.querySelectorAll(".filmstrip-thumb");

      filmstripItems.forEach((thumb, i) => {
        thumb.addEventListener("click", () => {
          swiper.slideToLoop(i);
        });
      });
    });

    // close
    closeBtn.onclick = () => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
      }
    };
  });
});
