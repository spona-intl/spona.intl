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
  // 2. AUTOMATIC BLANKET SCROLL REVEAL 
  // ==========================================
  // Targets all content items automatically so you don't need manual classes
  const targetElements = document.querySelectorAll(
    ".hero-wrapper h1, .hero-wrapper p, section, .scroll-item-card, .grid-block, footer, .list-item-card"
  );

  // A. Set initial hidden states across your entire site layout
  targetElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
    element.style.willChange = "opacity, transform";
  });

  // B. Setup the viewport tracking engine
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        // requestAnimationFrame forces the browser to play the transition smoothly
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
        
        observer.unobserve(el); // Locks at 100% permanent visibility
      }
    });
  }, {
    root: null, 
    rootMargin: "0px 0px -20px 0px", // Triggers just as elements enter the screen bounds
    threshold: 0.01 
  });

  // C. Execute the tracking loop
  targetElements.forEach(element => scrollObserver.observe(element));
});
