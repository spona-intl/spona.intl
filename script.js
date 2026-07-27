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
  // 2. SELF-CONTAINED JAVASCRIPT FADE REVEAL
  // ==========================================
  const targetElements = document.querySelectorAll(".reveal-on-scroll");

  // A. Set initial hidden styles immediately on page load
  targetElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
    element.style.willChange = "opacity, transform";
  });

  // B. Setup the intersection viewport tracking engine
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        // FIX: requestAnimationFrame tells the browser to process the visual 
        // update on the very next screen frame, resolving the animation skip.
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
        
        observer.unobserve(el); // Stops tracking so the elements stay fully visible
      }
    });
  }, {
    root: null, 
    rootMargin: "0px", 
    threshold: 0.01 // Triggers immediately as soon as 1px of the item cuts onto the screen
  });

  // C. Fire the observer tracking link loop
  targetElements.forEach(element => scrollObserver.observe(element));
});
