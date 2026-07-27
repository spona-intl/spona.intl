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
  // FEATURE 3: REAL-TIME SYMMETRIC PERIPHERAL FOCUS ENGINE
  // ==========================================================================
  const targetElements = document.querySelectorAll(
    ".hero-wrapper h1, .hero-wrapper p, .status-pill, section, .editorial-card, .scroll-item-card, .grid-block, .list-item-card, .search-bar, footer"
  );

  // Apply the baseline transition tracking class layout rules immediately
  targetElements.forEach(el => el.classList.add("reveal-on-scroll"));

  function updatePeripheralFocus() {
    const viewportCenter = window.innerHeight / 2;

    targetElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + (rect.height / 2);

      // Verify if the component is physically visible inside the browser window bounds
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        // Calculate how far away the element center is from the screen center fold line
        const distanceToCenter = Math.abs(viewportCenter - elementCenter);
        
        // Define a safe activation viewport field depth boundary zone (e.g., 250 pixels)
        const maxDistanceRange = window.innerHeight * 0.45;

        // Calculate a linear percentage scale ratio ranging between 0 (centered) and 1 (far away)
        const distanceRatio = Math.min(distanceToCenter / maxDistanceRange, 1);

        // Map the calculation directly to scale between 1.0 (100% focused) and 0.6 (60% peripheral opacity)
        const targetOpacity = 1 - (distanceRatio * 0.4);
        // Map the position scale to shrink slightly from 1 to 0.96 in peripheral view ports
        const targetScale = 1 - (distanceRatio * 0.04);

        // Apply styles directly to layout inline elements
        element.style.opacity = targetOpacity;
        element.style.transform = `scale(${targetScale})`;
      } else {
        // Safe baseline reset value for items completely rolled off-screen out of sight
        element.style.opacity = "0.6";
        element.style.transform = "scale(0.96)";
      }
    });
  }

  // Bind the calculation framework thread onto passive browser scroll and window resize actions
  window.addEventListener("scroll", updatePeripheralFocus, { passive: true });
  window.addEventListener("resize", updatePeripheralFocus, { passive: true });

  // Execute initial calculation sweep instantly upon loading page trees
  updatePeripheralFocus();

});
