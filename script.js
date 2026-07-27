document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================================================
  // FEATURE 1: PERSISTENT NAV SCROLL STATE (LOCK HORIZONTAL POSITION)
  // ==========================================================================
  const navLinksContainer = document.querySelector(".nav-links");

  if (navLinksContainer) {
    // Check if a layout scroll coordinate was stored in memory on the previous page
    const savedScrollPosition = sessionStorage.getItem("navScrollLeft");
    if (savedScrollPosition) {
      // Instantly force the navbar container to stay where the user left it
      navLinksContainer.scrollLeft = parseInt(savedScrollPosition, 10);
    }

    // Watch for link clicks to save the position before the fresh page loads
    navLinksContainer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        sessionStorage.setItem("navScrollLeft", navLinksContainer.scrollLeft);
      });
    });
  }

  // ==========================================================================
  // FEATURE 2: DYNAMIC 10+ LANGUAGE SWITCHING INTERNATIONALIZATION ENGINE
  // ==========================================================================
  const languageSelect = document.getElementById("languageSelect");

  // Asynchronously fetch JSON dictionary file from your GitHub locales/ folder
  async function setLanguage(lang) {
    try {
      // Points dynamically to your GitHub repository layout path structure
      const response = await fetch(`./locales/${lang}.json`);
      
      if (!response.ok) {
        throw new Error(`Could not load language asset payload: ${lang}`);
      }
      
      const translation = await response.json();

      // Scan the entire document map for targets marked with matching data-i18n attributes
      document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translation[key]) {
          element.textContent = translation[key];
        }
      });

      // Persist the preference locally so subpages load directly in this language
      localStorage.setItem("preferredLanguage", lang);
      if (languageSelect) languageSelect.value = lang;

      // Update accessibility profile tag mapping for international SEO compliance
      document.documentElement.lang = lang;

    } catch (error) {
      console.error("i18n Core Exception Fallback triggered:", error);
      // Failsafe configuration: fall back onto native English baseline files
      if (lang !== "en") setLanguage("en");
    }
  }

  // Detect starting language configuration sequence: Preference > Browser settings > Default
  const savedLang = localStorage.getItem("preferredLanguage");
  const browserLang = navigator.language;
  
  // Isolate country region codes from basic browser locale signals
  let defaultLang = "en";
  if (savedLang) {
    defaultLang = savedLang;
  } else if (browserLang.startsWith("zh")) {
    defaultLang = browserLang.includes("TW") || browserLang.includes("HK") ? "zh-TW" : "zh-CN";
  } else {
    defaultLang = browserLang.split("-")[0];
  }

  // Validate initialization choice against your portfolio of 10+ intended variants
  const supportedLangs = ["en", "zh-TW", "hi", "es", "fr", "ru", "fil"];
  if (!supportedLangs.includes(defaultLang)) {
    defaultLang = "en";
  }

  // Execute initial translation layout sweep mapping sequence
  if (languageSelect) {
    setLanguage(defaultLang);

    // Watch for active adjustments triggered by the user via the selector dropdown pill
    languageSelect.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  }

  // ==========================================================================
  // FEATURE 3: VIEWPORT OBSERVER (HIGH-VISIBILITY 2D SCROLL REVEAL ENGINE)
  // ==========================================================================
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Direct execution: flips the visibility class instantly
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); 
      }
    });
  }, {
    root: null, 
    rootMargin: "0px 0px -40px 0px", // Activates cleanly as items cross the screen fold
    threshold: 0.01 
  });

  // Automatically find and track all major layout components on the page
  const targetElements = document.querySelectorAll(
    ".hero-wrapper h1, .hero-wrapper p, section, .scroll-item-card, footer"
  );
  
  targetElements.forEach(element => {
    // Add the starting class dynamically so your HTML files stay clean
    element.classList.add("reveal-on-scroll");
    scrollObserver.observe(element);
  });

});
