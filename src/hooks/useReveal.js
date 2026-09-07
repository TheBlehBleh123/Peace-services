import { useEffect, useRef } from "react";

/*
  Shared reveal-on-scroll hook — the single source of truth for the site's
  scroll-entrance motion. Mirrors the home page (App.jsx) exactly:
    - IntersectionObserver -> adds `.visible` at threshold .15
    - staggered transition-delay
    - signature easing lives in the CSS (cubic-bezier(.22,1,.36,1))
  Used by PlansSection, ServicePage and AreaPage so every page feels identical.

  Two fail-safes ensure content is NEVER left permanently hidden:
    - prefers-reduced-motion  -> reveal instantly, no transition
    - no IntersectionObserver -> reveal instantly
*/
export const useReveal = (delay = 0) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      el.classList.add("visible");
      return;
    }

    el.style.transitionDelay = `${delay}s`;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
};
