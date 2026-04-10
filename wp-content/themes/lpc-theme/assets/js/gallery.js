document.addEventListener("DOMContentLoaded", () => {
  console.log("AM I HERE");
  const modal = document.getElementById("gallery-modal");
  const wrapper = document.querySelector(".swiper-wrapper");
  const closeBtn = document.getElementById("gallery-close");

  let swiper;

  document.querySelectorAll(".gallery-item").forEach((img) => {
    console.log("binding", img);
    img.addEventListener("click", () => {
      console.log("CLICKED");
      const index = Number(img.dataset.index);
      const gallery = window.galleryData || [];

      // build slides
      wrapper.innerHTML = "";

      gallery.forEach((item) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        slide.innerHTML = `
          <div class="slide-inner">
            <img 
              src="${item.src}" alt="${item.alt || ""}"
              srcset="${item.srcset || ""}"
              sizes="${item.sizes} || ''}"
              alt="${item.alt || ""}"
            >
            <div class="slide-meta">
              ${item.caption ? `<p class="caption">${item.caption}</p>` : ""}
              ${item.description ? `<p class="description">${item.description}</p>` : ""}
            </div>
          </div>
        `;

        wrapper.appendChild(slide);
      });

      // show modal
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      // init swiper
      if (swiper) swiper.destroy(true, true);

      swiper = new Swiper(".gallery-swiper", {
        loop: true,
        initialSlide: index,
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
