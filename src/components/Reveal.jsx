import { useReveal } from "../hooks/useReveal";

/*
  Reveal — thin wrapper that fades a block up as it scrolls into view, reusing
  the shared useReveal observer. Content is only hidden via the `.reveal` CSS
  class, which both the reduced-motion media rule and the hook's fail-safes
  override, so nothing ever stays permanently invisible.
*/
export const Reveal = ({ children, delay = 0, className = "", style, id }) => {
  const ref = useReveal(delay);
  return (
    <div ref={ref} id={id} className={className ? `reveal ${className}` : "reveal"} style={style}>
      {children}
    </div>
  );
};

/*
  RevealStyles — self-contained animation CSS for pages that don't include the
  home page's GlobalStyles (ServicePage / AreaPage). Matches App.jsx's keyframes
  and signature easing so the landing pages feel identical to the home page.
  Safe to render more than once. NOTE: the same keyframe/class definitions live
  inline in App.jsx's GlobalStyles for the home page; keep them in sync.
*/
export const RevealStyles = () => (
  <style>{`
    @keyframes heroReveal{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scalePulse{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
    @keyframes kenburns{0%{transform:scale(1)}100%{transform:scale(1.06)}}

    /* Hero entrance on load — staggered, matches App.jsx hero classes */
    .hero-anim{animation:heroReveal 1s cubic-bezier(.22,1,.36,1) forwards}
    .hero-anim-d1{animation:heroReveal .6s .2s cubic-bezier(.22,1,.36,1) both}
    .hero-anim-d2{animation:scalePulse .7s .5s cubic-bezier(.22,1,.36,1) both}
    .hero-anim-d3{animation:heroReveal .6s .65s cubic-bezier(.22,1,.36,1) both}

    /* Hero photo slow zoom (same as .svc-card img on the home page) */
    .reveal-kenburns{animation:kenburns 20s ease-in-out infinite alternate}

    /* Scroll reveal — subtle fade-up; hidden until the observer adds .visible */
    .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
    .reveal.visible{opacity:1;transform:translateY(0)}

    /* Accessibility + fail-safe: reduced-motion users see everything instantly,
       and content is never left hidden if animations are suppressed. */
    @media (prefers-reduced-motion: reduce){
      .hero-anim,.hero-anim-d1,.hero-anim-d2,.hero-anim-d3{animation:none!important}
      .reveal-kenburns{animation:none!important}
      .reveal{opacity:1!important;transform:none!important;transition:none!important}
    }
  `}</style>
);
