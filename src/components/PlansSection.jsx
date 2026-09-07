import { Check, X, ArrowRight } from "lucide-react";
import { PLANS, C, fontSerif, fontSans, fontDisplay } from "../data/siteData";
import { useReveal } from "../hooks/useReveal";

/*
  Reusable "Save BIG with Packages" plans section.
  Mirrors the home page (App.jsx) plans section 1:1 — same markup, styles, data
  (sourced from the canonical PLANS export in siteData). It is fully self-contained:
  it ships its own scoped CSS reset + grid + reveal animation so it renders identically
  on pages that don't include the home page's GlobalStyles (e.g. ServicePage).
*/

const PlansStyles = () => (
  <style>{`
    .ps-root *,.ps-root *::before,.ps-root *::after{box-sizing:border-box}
    .ps-root h2,.ps-root h3,.ps-root p,.ps-root ul,.ps-root li{margin:0;padding:0}
    .ps-fade{opacity:0;transform:translateY(36px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
    .ps-fade.visible{opacity:1;transform:translateY(0)}
    .ps-price-card{opacity:0;transform:translateY(50px) scale(.96);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
    .ps-price-card.visible{opacity:1;transform:translateY(0) scale(1)}
    .ps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
    @media(max-width:768px){.ps-grid{grid-template-columns:1fr;gap:20px}}
  `}</style>
);

const PricingCard = ({ plan, index }) => {
  const ref = useReveal(index * 0.18);
  return (
    <div ref={ref} className="ps-price-card" style={{
      background: C.cream, color: C.navy, borderRadius: 28, padding: 36, position: "relative",
      border: plan.hl ? `5px solid ${plan.borderColor}` : `2px solid ${plan.borderColor}`,
      display: "flex", flexDirection: "column", height: "100%",
      boxShadow: plan.hl ? `0 16px 48px rgba(138,157,137,.35)` : "0 8px 32px rgba(0,0,0,.15)",
    }}>
      {plan.hl && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: C.sage, color: C.navy, fontFamily: fontDisplay, fontSize: 10, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", padding: "6px 20px", borderRadius: 999, whiteSpace: "nowrap" }}>Most Popular</div>}
      <h3 style={{ fontFamily: fontSerif, fontSize: 24, fontWeight: 400, marginBottom: 32, color: C.navy }}>{plan.name}</h3>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 18, flexGrow: 1 }}>
        {plan.features.map(f => (
          <li key={f.t} style={{ display: "flex", alignItems: "center", gap: 14, opacity: f.on ? 1 : .4, fontFamily: fontSans, fontSize: 15, color: C.navy }}>
            {f.on ? <Check size={16} color={C.sage} /> : <X size={16} color="#c97070" />}{f.t}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function PlansSection({ onQuizOpen }) {
  const headingRef = useReveal(0);
  return (
    <section id="plans" className="ps-root" style={{ padding: "100px 24px", background: C.navy, color: C.cream }}>
      <PlansStyles />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={headingRef} className="ps-fade">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: fontSerif, fontSize: "clamp(32px,5vw,52px)", fontWeight: 400, marginBottom: 16, letterSpacing: "-.02em" }}>Save BIG with Packages</h2>
            <p style={{ fontFamily: fontSans, opacity: .85, fontSize: 18, fontWeight: 500 }}>Never worry about keeping up on cleanings again.</p>
          </div>
        </div>
        <div className="ps-grid" style={{ marginBottom: 56 }}>
          {PLANS.map((plan, i) => <PricingCard key={i} plan={plan} index={i} />)}
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={onQuizOpen} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 16,
            width: "100%", maxWidth: 640, padding: "28px 48px", borderRadius: 999,
            background: C.sage, color: C.navy, fontFamily: fontDisplay, fontSize: 20, fontWeight: 700,
            letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer",
            boxShadow: `0 30px 60px ${C.sage}44`, borderBottom: `4px solid ${C.navy}15`, border: "none", transition: "all .4s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.sage; e.currentTarget.style.transform = "translateY(0)"; }}>
            Get a Quick and Easy Quote <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
