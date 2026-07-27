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
  // 2. SELF-CONTAINED JAVASCRIPT FADE ANIMATION
  // ==========================================
  const targetElements = document.querySelectorAll(".reveal-on-scroll");

  // A. Initialize the starting hidden styles directly via JS
  targetElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
    element.style.willChange = "opacity, transform";
  });

  // B. Trigger the permanent 100% visible styles when scrolled into view
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        observer.unobserve(el); // Locks it at 100% permanently
      }
    });
  }, {
    root: null, 
    rootMargin: "0px", 
    threshold: 0.01   
  });

  // Start watching the elements
  targetElements.forEach(element => scrollObserver.observe(element));
});
