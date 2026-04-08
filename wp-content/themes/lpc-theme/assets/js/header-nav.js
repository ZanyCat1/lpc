document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const icon = toggle?.querySelector(".icon");
console.log("NAV JS LOADED");
  function setTheme(mode) {
    document.body.classList.remove("light", "dark");

    if (mode === "dark") {
      document.body.classList.add("dark");
      if (icon) icon.textContent = "☀️";
    } else {
      document.body.classList.add("light");
      if (icon) icon.textContent = "🌙";
    }
  }

  // initial theme
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  toggle?.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  });

  const navDock = document.getElementById("nav-wrap-dock");
  const nav = document.querySelector(".nav-wrap");

  if (!nav || !navDock) return;

  const wrapperRectOffset =
    nav.getBoundingClientRect().bottom - window.scrollY;
  const wrapperRectHeight = nav.offsetHeight;

  function updateNavHideOffset() {
    const percent = (wrapperRectOffset / wrapperRectHeight) * 100;
    nav.style.setProperty("--nav-hide-offset", percent + "%");
  }

  function syncWrapperHeight() {
    navDock.style.height = nav.offsetHeight + "px";
  }

  window.addEventListener("load", syncWrapperHeight);
  window.addEventListener("resize", syncWrapperHeight);

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const navPassed =
      currentScrollY > wrapperRectOffset + wrapperRectHeight;

    if (navPassed) {
      if (!nav.classList.contains("nav-fixed")) {
        nav.classList.add("nav-fixed", "no-anim");
        setTimeout(() => nav.classList.remove("no-anim"), 50);
      }
      nav.classList.add("nav-hide");
    } else {
      nav.classList.remove("nav-fixed", "nav-show", "nav-hide");
    }

    updateNavHideOffset();
  });
});