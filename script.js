document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================================================
  // FEATURE 1: PERSISTENT NAV SCROLL STATE (LOCK HORIZONTAL POSITION)
  // ==========================================================================
  const navLinksContainer = document.querySelector(".nav-links");
  if (navLinksContainer) {
    const savedScrollPosition = sessionStorage.getItem("navScrollLeft");
    if (savedScrollPosition) {
      navLinksContainer.scrollLeft = parseInt(savedScrollPosition, 10);
    }
    navLinksContainer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        sessionStorage.setItem("navScrollLeft", navLinksContainer.scrollLeft);
      });
    });
  }

  // ==========================================================================
  // FEATURE 2: POP-UP SELECTION LIST LANGUAGE DICTIONARY ENGINE
  // ==========================================================================
  const langMenuBtn = document.getElementById("langMenuBtn");
  const langDropMenu = document.getElementById("langDropMenu");
  const langMenuItems = document.querySelectorAll(".lang-menu-item");

  if (langMenuBtn && langDropMenu) {
    langMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langDropMenu.classList.toggle("is-open");
    });
    document.addEventListener("click", () => {
      langDropMenu.classList.remove("is-open");
    });
  }

  async function setLanguage(lang) {
    try {
      const response = await fetch(`./locales/${lang}.json`);
      if (!response.ok) throw new Error(`Could not load translations file: ${lang}`);
      const translation = await response.json();

      document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translation[key]) element.textContent = translation[key];
      });

      localStorage.setItem("preferredLanguage", lang);
      document.documentElement.lang = lang;

      langMenuItems.forEach(item => {
        if (item.getAttribute("data-lang-val") === lang) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    } catch (error) {
      console.error("i18n Core Exception:", error);
      if (lang !== "en") setLanguage("en");
    }
  }

  langMenuItems.forEach(item => {
    item.addEventListener("click", () => {
      setLanguage(item.getAttribute("data-lang-val"));
    });
  });

  const savedLang = localStorage.getItem("preferredLanguage");
  const browserLang = navigator.language;
  let defaultLang = "en";

  if (savedLang) {
    defaultLang = savedLang;
  } else if (browserLang.startsWith("zh")) {
    defaultLang = browserLang.includes("TW") || browserLang.includes("HK") ? "zh-TW" : "zh-CN";
  } else {
    defaultLang = browserLang.split("-");
  }

  const supportedLangs = ["en", "zh-TW", "hi", "es", "fr", "ru", "fil"];
  if (!supportedLangs.includes(defaultLang)) defaultLang = "en";
  setLanguage(defaultLang);
});

/* TOP ANNOUNCEMENT BANNER */
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("dynamicPaperBanner");
  if (!banner) return;

  const slides = banner.querySelectorAll(".banner-slide");
  let currentIdx = 0;
  let rotationInterval = null;

  function rotatePaperSlides() {
    slides[currentIdx].classList.remove("active");
    currentIdx = (currentIdx + 1) % slides.length;
    
    const nextSlide = slides[currentIdx];
    nextSlide.classList.add("active");

    const targetUrl = nextSlide.getAttribute("data-url");
    if (targetUrl) banner.setAttribute("href", targetUrl);
  }

  function startTimer() {
    if (!rotationInterval) {
      rotationInterval = setInterval(rotatePaperSlides, 4000);
    }
  }

  function stopTimer() {
    clearInterval(rotationInterval);
    rotationInterval = null;
  }

  banner.addEventListener("mouseenter", stopTimer);
  banner.addEventListener("mouseleave", startTimer);

  if (slides.length > 0) {
    const initialUrl = slides[0].getAttribute("data-url");
    if (initialUrl) banner.setAttribute("href", initialUrl);
  }
  
  startTimer();
});
