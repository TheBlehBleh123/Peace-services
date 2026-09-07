import { useParams, Link } from "react-router-dom";
import { SERVICES, AREAS, C, fontSerif, fontSans, fontDisplay, IMG, PHONE, PHONE_LINK, DOMAIN, trackPhoneClick } from "../data/siteData";
import SEOHead from "../components/SEOHead";
import PlansSection from "../components/PlansSection";
import { ReviewsSection, GoogleG } from "../components/ReviewMarquee";
import { Reveal, RevealStyles } from "../components/Reveal";
import { Phone, ArrowRight, ChevronRight, Star } from "lucide-react";

export default function ServicePage({ onQuizOpen }) {
  const { slug } = useParams();
  const service = SERVICES.find(s => s.slug === slug);

  if (!service) return <NotFound />;

  const otherServices = SERVICES.filter(s => s.slug !== slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.metaDescription,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${DOMAIN}/#business`,
      "name": "Peace Solar & Window Cleaning",
      "telephone": "+1-760-299-5187"
    },
    "areaServed": AREAS.map(a => ({ "@type": "City", "name": a.name })),
    "url": `${DOMAIN}/services/${service.slug}`
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.navy, fontFamily: fontSans }}>
      <SEOHead
        title={service.metaTitle}
        description={service.metaDescription}
        path={`/services/${service.slug}`}
        schema={schema}
      />
      <RevealStyles />

      {/* Breadcrumb */}
      <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 0", fontSize: 13, fontFamily: fontDisplay }}>
        <Link to="/" style={{ color: C.sage, textDecoration: "none" }}>Home</Link>
        <ChevronRight size={12} style={{ margin: "0 8px", opacity: 0.4 }} />
        <span style={{ opacity: 0.5 }}>Services</span>
        <ChevronRight size={12} style={{ margin: "0 8px", opacity: 0.4 }} />
        <span>{service.title}</span>
      </nav>

      {/* Hero */}
      <header style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px" }}>
        <h1 className="hero-anim" style={{ fontFamily: fontSerif, fontSize: "clamp(32px,5vw,56px)", fontWeight: 400, letterSpacing: "-.02em", marginBottom: 20, lineHeight: 1.1 }}>
          {service.heroHeadline}
        </h1>
        <p className="hero-anim-d1" style={{ fontSize: 18, fontWeight: 500, color: `${C.navy}aa`, lineHeight: 1.8, maxWidth: 720, marginBottom: 32 }}>
          {service.heroSubtext}
        </p>
        <div className="hero-anim-d2" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <button onClick={onQuizOpen} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: C.sage, color: C.navy, padding: "16px 36px", borderRadius: 999,
            fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, letterSpacing: ".1em",
            textTransform: "uppercase", border: "none", cursor: "pointer",
            boxShadow: `0 12px 32px ${C.sage}44`, transition: "all .3s",
          }}>
            Get a Free Quote <ArrowRight size={18} />
          </button>
          <a href={PHONE_LINK} onClick={trackPhoneClick} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.navy, color: C.cream, padding: "16px 28px", borderRadius: 999,
            fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, letterSpacing: ".1em",
            textTransform: "uppercase", textDecoration: "none", transition: "all .3s",
          }}>
            <Phone size={14} /> {PHONE}
          </a>
        </div>
        {/* Trust Badge */}
        <div className="hero-anim-d3" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, background: C.cream, border: `1px solid ${C.navy}15`, borderRadius: 999, padding: "8px 18px", width: "fit-content" }}>
          <GoogleG size={16} />
          <div style={{ display: "flex", gap: 2 }}>{[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#FBBC05" color="#FBBC05" />)}</div>
          <span style={{ fontFamily: fontDisplay, fontSize: 12, fontWeight: 700, color: C.navy, letterSpacing: ".03em" }}>200+ Five-Star Reviews</span>
        </div>
      </header>

      {/* Service Image */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <div className="hero-anim-d3" style={{ borderRadius: 24, overflow: "hidden" }}>
          <img src={service.img} alt={`${service.title} in Coachella Valley`} referrerPolicy="no-referrer" className="reveal-kenburns"
            style={{ width: "100%", height: 400, objectFit: "cover", borderRadius: 24, display: "block" }} />
        </div>
      </div>

      {/* Plans — Window Cleaning & Solar Panel Cleaning only (same section as the home page) */}
      {(slug === "window-cleaning" || slug === "solar-panel-cleaning") && (
        <PlansSection onQuizOpen={onQuizOpen} />
      )}

      {/* Content Sections */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        {service.sections.map((section, i) => (
          <Reveal key={i} delay={i * 0.1} style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: fontSerif, fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 400, marginBottom: 20, letterSpacing: "-.01em" }}>
              {section.heading}
            </h2>
            <div style={{ fontSize: 16, fontWeight: 500, color: `${C.navy}bb`, lineHeight: 1.9, whiteSpace: "pre-line" }}>
              {section.content.split("**").map((part, j) =>
                j % 2 === 1 ? <strong key={j} style={{ color: C.navy, fontWeight: 600 }}>{part}</strong> : part
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {/* FAQ Section */}
      {service.faq && (
        <section style={{ background: C.offwhite, padding: "80px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Reveal>
              <h2 style={{ fontFamily: fontSerif, fontSize: "clamp(28px,4vw,40px)", fontWeight: 400, marginBottom: 40, textAlign: "center" }}>
                Frequently Asked Questions
              </h2>
            </Reveal>
            {service.faq.map((item, i) => (
              <Reveal key={i} delay={i * 0.08} style={{ marginBottom: 32, padding: 28, background: C.white, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
                <h3 style={{ fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: ".02em" }}>
                  {item.q}
                </h3>
                <p style={{ fontSize: 15, fontWeight: 500, color: `${C.navy}aa`, lineHeight: 1.8 }}>{item.a}</p>
              </Reveal>
            ))}
          </div>

          {/* FAQ Schema */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": service.faq.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": { "@type": "Answer", "text": item.a }
            }))
          })}} />
        </section>
      )}

      {/* Reviews Marquee */}
      <ReviewsSection heading={`What Customers Say About Our ${service.shortTitle}`} />

      {/* CTA Section */}
      <section style={{ background: C.navy, padding: "80px 24px", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: fontSerif, fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: C.cream, marginBottom: 16 }}>
            Ready for {service.title}?
          </h2>
          <p style={{ fontSize: 18, fontWeight: 500, color: `${C.cream}bb`, marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
            Get a Quick and Easy Quote. Serving all of Coachella Valley.
          </p>
          <button onClick={onQuizOpen} style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: C.sage, color: C.navy, padding: "20px 44px", borderRadius: 999,
            fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, letterSpacing: ".1em",
            textTransform: "uppercase", border: "none", cursor: "pointer",
            boxShadow: `0 16px 40px ${C.sage}44`, transition: "all .3s",
          }}>
            Get a Free Quote <ArrowRight size={20} />
          </button>
        </Reveal>
      </section>

      {/* Areas Served */}
      <section style={{ padding: "80px 24px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: fontSerif, fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 400, marginBottom: 32, textAlign: "center" }}>
              {service.title} Areas We Serve
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {AREAS.map((area, i) => (
              <Reveal key={area.slug} delay={i * 0.06} style={{ height: "100%" }}>
                <Link to={`/areas/${area.slug}`} style={{
                  display: "block", height: "100%",
                  padding: "20px 24px", background: C.offwhite, borderRadius: 14,
                  textDecoration: "none", color: C.navy, fontFamily: fontDisplay,
                  fontSize: 14, fontWeight: 600, letterSpacing: ".04em",
                  transition: "all .3s", textAlign: "center",
                }}>
                  {service.shortTitle} in {area.name}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section style={{ padding: "60px 24px 80px", background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <h3 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 400, marginBottom: 24, textAlign: "center" }}>
              Our Other Services
            </h3>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {otherServices.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08} style={{ height: "100%" }}>
                <Link to={`/services/${s.slug}`} style={{
                  display: "block", height: "100%",
                  padding: 24, background: C.white, borderRadius: 16,
                  textDecoration: "none", color: C.navy, transition: "all .3s",
                  boxShadow: "0 2px 12px rgba(0,0,0,.04)",
                }}>
                  <h4 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, letterSpacing: ".04em", marginBottom: 8 }}>{s.title}</h4>
                  <p style={{ fontSize: 14, color: `${C.navy}88`, lineHeight: 1.6 }}>{s.heroSubtext.slice(0, 120)}...</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: `"Inter",sans-serif` }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 48, marginBottom: 16 }}>404</h1>
        <p style={{ marginBottom: 24 }}>Service not found.</p>
        <Link to="/" style={{ color: "#8a9d89" }}>Back to Home</Link>
      </div>
    </div>
  );
}
