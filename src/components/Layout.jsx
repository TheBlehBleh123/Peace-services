import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { C, fontSerif, fontSans, fontDisplay, IMG, PHONE_LINK, AREAS, SERVICES } from "../data/siteData";
import { Phone, Menu, XIcon, ChevronDown } from "lucide-react";

/** Shared Navbar + Footer for all pages (not homepage, which has its own) */
export function SiteNavbar({ onQuizOpen }) {
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    const h = () => setScrollProgress(Math.min(1, window.scrollY / 120));
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrolled = scrollProgress > 0.1;
  const lnk = { fontFamily: fontDisplay, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: C.navy, textDecoration: "none", transition: "color .3s" };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: `rgba(244,241,234,${Math.max(scrollProgress * 0.93, 0.85)})`,
      backdropFilter: `blur(${Math.max(scrollProgress * 20, 12)}px)`,
      WebkitBackdropFilter: `blur(${Math.max(scrollProgress * 20, 12)}px)`,
      borderBottom: `1px solid ${C.navy}11`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1400, margin: "0 auto", padding: "0 20px 0 4px" }}>
        <Link to="/" style={{ lineHeight: 0, marginLeft: 0 }}>
          <img src={IMG.logo} alt="Peace Solar & Window Cleaning" referrerPolicy="no-referrer"
            style={{ height: 80 - scrollProgress * 20, width: "auto", transition: "height .15s linear", display: "block" }} />
        </Link>
        <div className="desk-only" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* Services dropdown */}
          <div style={{ position: "relative" }} className="nav-dropdown">
            <span style={{ ...lnk, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              Services <ChevronDown size={10} />
            </span>
            <div className="nav-dropdown-menu" style={{
              display: "none", position: "absolute", top: "100%", left: -16, background: C.cream,
              borderRadius: 12, padding: "12px 0", boxShadow: "0 8px 32px rgba(0,0,0,.1)",
              minWidth: 220, zIndex: 60, border: `1px solid ${C.navy}10`,
            }}>
              {SERVICES.map(s => (
                <Link key={s.slug} to={`/services/${s.slug}`}
                  style={{ display: "block", padding: "10px 20px", fontSize: 13, fontFamily: fontDisplay, color: C.navy, textDecoration: "none", letterSpacing: ".06em" }}>
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
          {/* Areas dropdown */}
          <div style={{ position: "relative" }} className="nav-dropdown">
            <span style={{ ...lnk, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              Areas <ChevronDown size={10} />
            </span>
            <div className="nav-dropdown-menu" style={{
              display: "none", position: "absolute", top: "100%", left: -16, background: C.cream,
              borderRadius: 12, padding: "12px 0", boxShadow: "0 8px 32px rgba(0,0,0,.1)",
              minWidth: 200, zIndex: 60, border: `1px solid ${C.navy}10`,
            }}>
              {AREAS.map(a => (
                <Link key={a.slug} to={`/areas/${a.slug}`}
                  style={{ display: "block", padding: "10px 20px", fontSize: 13, fontFamily: fontDisplay, color: C.navy, textDecoration: "none", letterSpacing: ".06em" }}>
                  {a.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/" style={lnk}>Pricing</Link>
          <a href={PHONE_LINK} style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: C.navy, color: C.cream,
            padding: "10px 22px", borderRadius: 999, fontFamily: fontDisplay, fontSize: 11,
            letterSpacing: ".15em", textTransform: "uppercase", textDecoration: "none", transition: "all .3s",
          }}>
            <Phone size={13} /> Call Now
          </a>
        </div>
        <button className="mob-only" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: C.navy, padding: 8, display: "flex" }}>
          {open ? <XIcon size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="mob-only" style={{ background: C.cream, borderBottom: `1px solid ${C.navy}15`, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontFamily: fontDisplay, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: `${C.navy}55`, fontWeight: 700 }}>Services</span>
          {SERVICES.map(s => (
            <Link key={s.slug} to={`/services/${s.slug}`} onClick={() => setOpen(false)}
              style={{ fontFamily: fontDisplay, fontSize: 13, letterSpacing: ".08em", color: C.navy, textDecoration: "none", paddingLeft: 12 }}>
              {s.title}
            </Link>
          ))}
          <span style={{ fontFamily: fontDisplay, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: `${C.navy}55`, fontWeight: 700, marginTop: 8 }}>Areas We Serve</span>
          {AREAS.map(a => (
            <Link key={a.slug} to={`/areas/${a.slug}`} onClick={() => setOpen(false)}
              style={{ fontFamily: fontDisplay, fontSize: 13, letterSpacing: ".08em", color: C.navy, textDecoration: "none", paddingLeft: 12 }}>
              {a.name}
            </Link>
          ))}
          <a href={PHONE_LINK} onClick={() => setOpen(false)} style={{ fontFamily: fontDisplay, fontSize: 13, fontWeight: 700, color: C.sage, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <Phone size={14} /> Call Now
          </a>
        </div>
      )}
      <style>{`
        .nav-dropdown:hover .nav-dropdown-menu { display: block !important; }
        .nav-dropdown-menu a:hover { background: ${C.offwhite}; }
      `}</style>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ padding: "64px 24px 48px", borderTop: `1px solid ${C.navy}12`, background: C.cream }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          {/* Services */}
          <div>
            <h4 style={{ fontFamily: fontDisplay, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Services</h4>
            {SERVICES.map(s => (
              <Link key={s.slug} to={`/services/${s.slug}`} style={{ display: "block", fontFamily: fontSans, fontSize: 14, color: `${C.navy}88`, textDecoration: "none", marginBottom: 10, fontWeight: 500 }}>
                {s.title}
              </Link>
            ))}
          </div>
          {/* Areas */}
          <div>
            <h4 style={{ fontFamily: fontDisplay, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Areas We Serve</h4>
            {AREAS.map(a => (
              <Link key={a.slug} to={`/areas/${a.slug}`} style={{ display: "block", fontFamily: fontSans, fontSize: 14, color: `${C.navy}88`, textDecoration: "none", marginBottom: 10, fontWeight: 500 }}>
                {a.name}
              </Link>
            ))}
          </div>
          {/* Company */}
          <div>
            <h4 style={{ fontFamily: fontDisplay, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Company</h4>
            <Link to="/" style={{ display: "block", fontFamily: fontSans, fontSize: 14, color: `${C.navy}88`, textDecoration: "none", marginBottom: 10, fontWeight: 500 }}>Home</Link>
            <a href="/#story" style={{ display: "block", fontFamily: fontSans, fontSize: 14, color: `${C.navy}88`, textDecoration: "none", marginBottom: 10, fontWeight: 500 }}>About Us</a>
            <a href="/#plans" style={{ display: "block", fontFamily: fontSans, fontSize: 14, color: `${C.navy}88`, textDecoration: "none", marginBottom: 10, fontWeight: 500 }}>Pricing</a>
          </div>
          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: fontDisplay, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Contact</h4>
            <a href={PHONE_LINK} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: fontSans, fontSize: 14, color: C.navy, textDecoration: "none", marginBottom: 10, fontWeight: 600 }}>
              <Phone size={14} /> (760) 299-5187
            </a>
            <p style={{ fontFamily: fontSans, fontSize: 14, color: `${C.navy}88`, fontWeight: 500, lineHeight: 1.6 }}>
              Serving the entire Coachella Valley, CA
            </p>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.navy}10`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Link to="/" style={{ lineHeight: 0 }}>
            <img src={IMG.logo} alt="Peace Logo" referrerPolicy="no-referrer" style={{ height: 50, width: "auto" }} />
          </Link>
          <span style={{ fontFamily: fontDisplay, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", opacity: .35 }}>
            &copy; 2026 Peace Solar & Window Cleaning. Coachella Valley, CA.
          </span>
          <div style={{ display: "flex", gap: 28 }}>
            {[["Instagram","https://www.instagram.com/peacesolarcleaning/"],["Facebook","https://www.facebook.com/p/Peace-Solar-Window-Cleaning-61577626017665/"]].map(([label,url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: fontDisplay, fontSize: 12, fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: C.navy, textDecoration: "none" }}>{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
