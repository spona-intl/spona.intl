document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. PERSISTENT HORIZONTAL SCROLL POSITION
  // ==========================================
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

  // ==========================================
  // 2. LIGHTWEIGHT SCROLL TRIGGER ENGINE
  // ==========================================
  const targetElements = document.querySelectorAll(
    ".hero-wrapper h1, .hero-wrapper p, section, .scroll-item-card, .grid-block, footer, .list-item-card"
  );

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Simply flip the switch. CSS takes over the physical rendering work perfectly.
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); 
      }
    });
  }, {
    root: null, 
    rootMargin: "0px 0px -60px 0px", // Triggers right as elements clear the bottom screen edge
    threshold: 0.01 
  });

  targetElements.forEach(element => scrollObserver.observe(element));
});
