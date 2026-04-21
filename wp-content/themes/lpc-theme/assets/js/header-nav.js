const BREAKPOINT = 899;
const mq = window.matchMedia("(max-width: 899px)");
mq.addEventListener("change", handleBreakpointChange);

const navDock = document.getElementById("nav-wrap-dock");
const navWidth = document.getElementById("nav-width");
const nav = document.querySelector(".nav-wrap");
const navList = document.querySelector(".nav-list");
let baseHeight = navList.offsetHeight;
navDock.style.setProperty("--menu-height", `${baseHeight}px`);
navWidth.style.setProperty("--menu-height", `${baseHeight}px`);
let wrapperRect = navDock.getBoundingClientRect();

const toggle = document.getElementById("theme-toggle");
const icon = toggle?.querySelector(".icon");

const menuItems = document.querySelectorAll(".nav-list > .menu-item");
let activeItem = null;

let listenersActive = false;

function enableDesktopNav() {
  if (listenersActive) return;
  addMenuItemListeners();
  listenersActive = true;
}

function disableDesktopNav() {
  if (!listenersActive) return;

  removeMenuItemListeners();

  navDock.style.removeProperty("--menu-height");
  navDock.style.setProperty("--menu-height", `${baseHeight}px`);

  document
    .querySelectorAll(".menu-item.active")
    .forEach((el) => el.classList.remove("active"));

  listenersActive = false;
}

function handleBreakpointChange(e) {
  if (e.matches) {
    disableDesktopNav();
  } else {
    enableDesktopNav();
  }
}

function addMenuItemListeners() {
  menuItems.forEach((menuItem) => {
    if (wrapperRect.bottom <= 0) return;
    const subMenu = menuItem.querySelector(".sub-menu");

    const onEnter = () => {
      console.log("entered");
      if (activeItem === menuItem) return;
      if (activeItem) activeItem.classList.remove("active");

      if (!subMenu) {
        navDock.style.setProperty("--menu-height", `${baseHeight}px`);
        activeItem = null;
        return;
      }
      const subMenuHeight = subMenu.scrollHeight;

      menuItem.classList.add("active");
      activeItem = menuItem;

      navDock.style.setProperty(
        "--menu-height",
        `${baseHeight + subMenuHeight}px`,
      );
    };
    menuItem._onEnter = onEnter;
    menuItem.addEventListener("mouseenter", onEnter);
  });

  const onExit = () => {
    console.log("exiting");
    navDock.style.setProperty("--menu-height", `${baseHeight}px`);

    if (activeItem) {
      activeItem.classList.remove("active");
      activeItem = null;
    }
  };

  navList._onExit = onExit;
  navList.addEventListener("mouseleave", onExit);
}

function removeMenuItemListeners() {
  menuItems.forEach((menuItem) => {
    if (menuItem._onEnter) {
      menuItem.removeEventListener("mouseenter", menuItem._onEnter);
      delete menuItem._onEnter;
    }
  });
  if (navList._onExit) {
    navList.removeEventListener("mouseleave", navList._onExit);
    delete navList._onExit;
  }
}

function syncWrapperHeight() {
  navDock.style.height = `${baseHeight}px`;
  navWidth.style.height = `${baseHeight}px`;
}

function setTheme(mode) {
  document.documentElement.classList.remove("light", "dark");

  if (mode === "dark") {
    document.documentElement.classList.add("dark");
    if (icon) icon.textContent = "☀️";
  } else {
    document.documentElement.classList.add("light");
    if (icon) icon.textContent = "🌙";
  }
  localStorage.setItem("theme", mode);
}

document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // THEME TOGGLE
  // =====================

  toggle?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });

  // debugging, take out later
  window.addEventListener("keydown", (key) => {
    console.log("key:", key.key);
    const isDark = document.documentElement.classList.contains("dark");
    if (key.key === "d") setTheme(isDark ? "light" : "dark");
  });

  // =====================
  // NAV SETUP
  // =====================
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
    // 1. remove controlled height so layout can settle
    navDock.style.removeProperty("--menu-height");

    // 2. measure natural height (rows wrapping, etc.)
    baseHeight = navList.offsetHeight;

    // 3. set it back as the controlled height
    navDock.style.setProperty("--menu-height", `${baseHeight}px`);

    // 4. update dock to match
    navDock.style.height = baseHeight + "px";
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

    wrapperRect = navDock.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const wrapperVisible = wrapperRect.bottom > 0;
    const wrapperLinedUp = navRect.top <= wrapperRect.top;
    const navScrolledAway = currentScrollY > baseHeight;

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
      void baseHeight;
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
  window.addEventListener("load", () => {
    nav.classList.add("nav-show", "nav-fixed");
    syncWrapperHeight();
    syncFooter();
    handleBreakpointChange(mq);
    // addMenuItemListeners();
  });

  window.addEventListener("resize", () => {
    syncWrapperHeight();
    syncFooter();
    handleResize();
  });
  window.addEventListener("scroll", handleScroll);
  // window.addEventListener("resize", syncWrapperHeight);

  // window.addEventListener("load", syncFooter);
  // window.addEventListener("resize", syncFooter);

  // window.addEventListener("resize", handleResize);
});
