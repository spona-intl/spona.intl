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
  // 2. STAGGERED 3D REVEAL TRIGGER ENGINE
  // ==========================================
  const targetElements = document.querySelectorAll(
    ".hero-wrapper h1, .hero-wrapper p, section, .scroll-item-card, .grid-block, footer, .list-item-card"
  );

  let revealQueue = [];
  let revealTimeout = null;

  // Process the queue with a tight, satisfying stagger delay
  function processQueue() {
    revealQueue.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("is-visible");
      }, index * 120); // 120ms ripple delay between adjacent items
    });
    // Clear queue after firing transitions
    revealQueue = [];
    revealTimeout = null;
  }

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add to staggering batch queue
        revealQueue.push(entry.target);
        observer.unobserve(entry.target); 

        // Batch multiple elements hitting the screen at the exact same time
        if (!revealTimeout) {
          revealTimeout = setTimeout(processQueue, 30);
        }
      }
    });
  }, {
    root: null, 
    rootMargin: "0px 0px -40px 0px", // Triggers aggressively just above the viewport base fold
    threshold: 0.01 
  });

  targetElements.forEach(element => scrollObserver.observe(element));
});
