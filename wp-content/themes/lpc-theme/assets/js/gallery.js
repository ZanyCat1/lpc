document.addEventListener("DOMContentLoaded", () => {
  console.log("AM I HERE");
  const modal = document.getElementById("gallery-modal");
  const wrapper = document.querySelector(".swiper-wrapper");
  const closeBtn = document.getElementById("gallery-close");

  let swiper;

  const images = document.querySelectorAll(".wp-block-gallery img");

  images.forEach((img, index) => {
    img.style.cursor = "pointer";

    img.addEventListener("click", () => {
      console.log("CLICKED", index);

      const gallery = window.galleryData || [];

      wrapper.innerHTML = "";

      gallery.forEach((item) => {
        const slide = document.createElement("div");
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

        wrapper.appendChild(slide);
      });

      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      if (swiper) swiper.destroy(true, true);

      swiper = new Swiper(".gallery-swiper", {
        loop: true,
        initialSlide: index,
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
