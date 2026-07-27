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

  // ==========================================================================
  // FEATURE 3: UNBOUNDED DUAL-DIRECTION TRANSITION REVEAL ENGINE (FIXED)
  // ==========================================================================
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Toggles class instantly on entry/exit bounding overlaps
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  }, {
    root: null, 
    // FIX: Using completely clear bounds (0px) ensures that long content pages 
    // cleanly trigger element removal triggers the moment an element slips off either screen pole
    rootMargin: "0px 0px -40px 0px", 
    threshold: 0.02 // Tiny threshold prevents frames from getting trapped under fast momentum scrolling
  });

  // FIX: Broad query matching profile selects every component across Home, About, and Resources
  const targetElements = document.querySelectorAll(
    ".hero-wrapper h1, .hero-wrapper p, .status-pill, section, .editorial-card, .scroll-item-card, .grid-block, .list-item-card, .search-bar, footer"
  );
  
  targetElements.forEach(element => {
    element.classList.add("reveal-on-scroll");
    scrollObserver.observe(element);
  });
});
