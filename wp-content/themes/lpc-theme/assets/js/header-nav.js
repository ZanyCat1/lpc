// avoid animating on page load, especially for dark mode
document.documentElement.classList.add("no-transition");
window.addEventListener("load", () => {
  document.documentElement.classList.remove("no-transition");
});

document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // THEME TOGGLE
  // =====================

  const toggle = document.getElementById("theme-toggle");
  const icon = toggle?.querySelector(".icon");

  function setTheme(mode) {
    document.body.classList.remove("light", "dark");

    if (mode === "dark") {
      document.body.classList.add("dark");
      if (icon) icon.textContent = "☀️";
    } else {
      document.body.classList.add("light");
      if (icon) icon.textContent = "🌙";
    }
    localStorage.setItem("theme", mode);
  }

  // initial theme
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  setTheme(savedTheme);

  toggle?.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });

  // =====================
  // NAV SETUP
  // =====================

  const navDock = document.getElementById("nav-wrap-dock");
  const nav = document.querySelector(".nav-wrap");

  if (!nav || !navDock) return;

  navDock.style.height = nav.offsetHeight + "px";
  const wrapperRectOffset = nav.getBoundingClientRect().bottom - window.scrollY;
  console.log(`wrapperRectOffset just got set: ${wrapperRectOffset}`);

  // function syncWrapperHeight() {}

  function syncFooter() {
    const headerNavbar = document.getElementById("header-navbar");
    const footerNavbar = document.getElementById("footer-navbar");
    if (!footerNavbar || !headerNavbar) return;

    footerNavbar.style.height = headerNavbar.offsetHeight + "px";
    footerNavbar.style.width = headerNavbar.offsetWidth + "px";
  }

  // =====================
  // RESIZE HANDLER
  // =====================
  let isResizing = false;
  let resizeTimer;

  function handleResize() {
    navDock.style.height = nav.offsetHeight + "px";
    isResizing = true;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      isResizing = false;
    }, 150);
  }

  // =====================
  // SCROLL CONFIG
  // =====================

  const SHOW_THRESHOLD = 60;
  const HIDE_THRESHOLD = 60;
  const SCROLL_WINDOW = 300;

  let lastScrollY = window.scrollY;
  let lastScrollTime = Date.now();
  let scrollUpDistance = 0;
  let scrollDownDistance = 0;

  // =====================
  // SCROLL HANDLER
  // =====================

  function handleScroll() {
    if (isResizing) return;

    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    const scrollingUp = delta < 0;
    const scrollingDown = delta > 0;

    const wrapperRect = navDock.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const wrapperVisible = wrapperRect.bottom > 0;
    const wrapperLinedUp = navRect.top <= wrapperRect.top;
    const navScrolledAway = currentScrollY > nav.offsetHeight;

    const now = Date.now();
    const timeSinceLast = now - lastScrollTime;

    // reset if too slow
    if (timeSinceLast > SCROLL_WINDOW) {
      scrollUpDistance = 0;
      scrollDownDistance = 0;
    }

    if (scrollingUp) {
      scrollUpDistance += Math.abs(delta);
      scrollDownDistance = 0;
    } else if (scrollingDown) {
      scrollDownDistance += delta;
      scrollUpDistance = 0;
    }

    if (wrapperVisible && wrapperLinedUp) {
      nav.classList.add("no-anim");
      nav.classList.remove("nav-fixed", "nav-show");
    }

    if (navScrolledAway) {
      nav.classList.add("nav-fixed");
      void nav.offsetHeight;
      nav.classList.remove("no-anim");

      if (scrollUpDistance > SHOW_THRESHOLD) {
        nav.classList.add("nav-show");
        scrollUpDistance = 0;
      }

      if (scrollDownDistance > HIDE_THRESHOLD) {
        nav.classList.remove("nav-show");
        scrollDownDistance = 0;
      }
    }

    lastScrollTime = now;
    lastScrollY = currentScrollY;
  }

  // =====================
  // EVENTS
  // =====================

  window.addEventListener("load", syncFooter);
  window.addEventListener("resize", syncFooter);

  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll);
});
