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
  // 2. HIGH-VISIBILITY SCROLL REVEAL 
  // ==========================================
  const targetElements = document.querySelectorAll(
    ".hero-wrapper h1, .hero-wrapper p, section, .scroll-item-card, .grid-block, footer, .list-item-card"
  );

  // A. Set dramatic starting positions
  targetElements.forEach(element => {
    element.style.opacity = "0";
    // ENHANCED: Increased distance from 30px to 70px for a more obvious slide-up effect
    element.style.transform = "translateY(70px)"; 
    // ENHANCED: Extended duration to 1.8 seconds for a more visible, sweeping fade
    element.style.transition = "opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)";
    element.style.willChange = "opacity, transform";
  });

  // B. Setup the tracking engine
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
        
        observer.unobserve(el); // Keeps elements locked at 100% visible
      }
    });
  }, {
    root: null, 
    // ENHANCED: Adjusted trigger area so elements wait a bit longer before fading in
    rootMargin: "0px 0px -50px 0px", 
    threshold: 0.01 
  });

  // C. Execute tracking
  targetElements.forEach(element => scrollObserver.observe(element));
});
