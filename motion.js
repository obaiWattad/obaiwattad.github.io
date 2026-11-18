(() => {
  const header = document.querySelector(".header");
  const banner = document.querySelector(".hero-banner");
  const scene = banner.querySelector(".hero-scene");
  let previousY = Math.max(0, scrollY);
  let directionChangeY = previousY;
  let movingDown = false;
  let scrollFrame;

  header.setAttribute("data-live", "");
  banner.setAttribute("data-live", "");

  function updateScroll() {
    scrollFrame = undefined;

    const y = Math.max(0, scrollY);
    const sceneEnd = banner.offsetHeight;
    const pinnedTravel = sceneEnd - scene.offsetHeight;
    const travel = pinnedTravel || Math.max(160, Math.min(264, innerHeight * .26));
    const reveal = Math.min(1, y / travel);
    if (y !== previousY && (y > previousY) !== movingDown) {
      movingDown = y > previousY;
      directionChangeY = previousY;
    }

    if (y <= sceneEnd) {
      header.removeAttribute("data-scrolling-down");
    } else if (Math.abs(y - directionChangeY) >= 24) {
      header.toggleAttribute("data-scrolling-down", movingDown);
    }

    header.toggleAttribute("data-immersive", reveal < .42);
    scene.style.setProperty("--scene-reveal", reveal.toFixed(3));
    previousY = y;
  }

  function requestScrollUpdate() {
    if (scrollFrame === undefined) scrollFrame = requestAnimationFrame(updateScroll);
  }

  addEventListener("scroll", requestScrollUpdate, { passive: true });
  addEventListener("resize", requestScrollUpdate);
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", requestScrollUpdate);
  requestScrollUpdate();

  if (!("IntersectionObserver" in window)) return;

  const entrances = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.setAttribute("data-visible", "");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.18 });

  for (const preview of document.querySelectorAll("[data-reveal]")) {
    entrances.observe(preview);
  }
})();
