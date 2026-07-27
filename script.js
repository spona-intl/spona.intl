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
  // 2. STAGGERED REVEAL TRIGGER ENGINE
  // ==========================================
  const targetElements = document.querySelectorAll(
    ".hero-wrapper h1, .hero-wrapper p, section, .scroll-item-card, .grid-block, footer, .list-item-card"
  );

  let revealQueue = [];
  let revealTimeout = null;

  function processQueue() {
    revealQueue.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("is-visible");
      }, index * 150); // 150ms delay between item entrances
    });
    revealQueue = [];
    revealTimeout = null;
  }

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealQueue.push(entry.target);
        observer.unobserve(entry.target); 

        if (!revealTimeout) {
          revealTimeout = setTimeout(processQueue, 40);
        }
      }
    });
  }, {
    root: null, 
    rootMargin: "0px 0px -20px 0px", // Triggers right as elements break the bottom fold
    threshold: 0.01 
  });

  targetElements.forEach(element => scrollObserver.observe(element));
});
