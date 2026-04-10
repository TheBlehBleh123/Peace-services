import { useParams, Link } from "react-router-dom";
import { AREAS, SERVICES, C, fontSerif, fontSans, fontDisplay, PHONE, PHONE_LINK, DOMAIN, BUSINESS_NAME } from "../data/siteData";
import SEOHead from "../components/SEOHead";
import { ReviewsSection } from "../components/ReviewMarquee";
import { Phone, ArrowRight, ChevronRight, MapPin } from "lucide-react";

const AREA_DETAILS = {
  "palm-desert": {
    tagline: "Palm Desert's Trusted Solar & Window Cleaning Team",
    landmarks: "El Paseo Shopping District, The Living Desert Zoo, Palm Desert Civic Center, College of the Desert",
    neighborhoods: "South Palm Desert, Silver Spur Ranch, Palm Desert Country Club, The Palms, Portola area, University Park",
    localContent: `Palm Desert sits at the center of the Coachella Valley and is home to some of the most beautiful residential communities in the desert. With over 300 days of sunshine per year, solar panels are incredibly popular here — and they need regular cleaning to perform at their best.

The desert dust that blows off the Santa Rosa Mountains, combined with Palm Desert's notoriously hard water, creates a stubborn film on windows and solar panels. Sprinkler overspray from the lush golf course communities adds mineral deposits that standard cleaning can't remove.

Whether you live in the gated communities along Fred Waring Drive, the luxury estates near Bighorn, or the family neighborhoods around Palm Desert High School, Peace Solar & Window Cleaning provides reliable, scheduled service that keeps your home looking its best.`,
    customerTypes: "Palm Desert homeowners, El Paseo business owners, HOA communities near the country clubs, snowbirds with seasonal homes",
  },
  "la-quinta": {
    tagline: "La Quinta's Premier Solar & Window Cleaning Service",
    landmarks: "PGA West, La Quinta Resort & Club, SilverRock Resort, La Quinta Cove, Bear Creek Trail",
    neighborhoods: "PGA West, La Quinta Country Club, Tradition, The Citrus, La Quinta Cove, Rancho La Quinta",
    localContent: `La Quinta is known for its world-class golf communities and stunning mountain backdrop. Homes here often feature expansive windows and large solar installations — both of which need professional maintenance in the desert climate.

The Santa Rosa and San Jacinto Mountains that frame La Quinta create unique wind patterns that carry fine desert sand through the cove. This, combined with the seasonal pollen from date palms and citrus orchards, coats solar panels and windows faster than in other parts of the valley.

Our La Quinta customers include many snowbirds who want their homes maintained while they're away, property managers overseeing vacation rentals at PGA West, and year-round residents in Tradition and La Quinta Country Club who take pride in their home's appearance.`,
    customerTypes: "PGA West homeowners, snowbirds, vacation rental property managers, La Quinta Cove residents, golf community HOAs",
  },
  "indio": {
    tagline: "Indio's Go-To Solar Panel & Window Cleaning Experts",
    landmarks: "Empire Polo Club, Coachella Valley Music Festival grounds, Fantasy Springs Resort Casino, Indio International Tamale Festival",
    neighborhoods: "Shadow Hills, Terra Lago, Plantation, Heritage Palms, Indian Palms Country Club, Sun City Shadow Hills",
    localContent: `Indio — the City of Festivals — is one of the fastest-growing cities in the Coachella Valley. New housing developments and solar installations are popping up across the east valley, and homeowners need reliable maintenance services to keep up.

Indio's position in the eastern valley means it gets hit first by windstorms coming through the San Gorgonio Pass. These events deposit heavy layers of dust on solar panels and windows, significantly reducing solar output and home curb appeal.

From the established communities at Shadow Hills and Sun City to the newer developments in Terra Lago, Peace serves all of Indio with the same professional, scheduled service. Many of our Indio customers are on our Quarterly Pro Package for hassle-free maintenance year-round.`,
    customerTypes: "New homeowners in developments, Sun City retirees, property managers, agricultural community homeowners, HOA boards",
  },
  "rancho-mirage": {
    tagline: "Rancho Mirage's Preferred Solar & Window Cleaning Professionals",
    landmarks: "Eisenhower Medical Center, The River at Rancho Mirage, Agua Caliente Casino, Sunnylands Center & Gardens",
    neighborhoods: "Thunderbird Heights, The Springs, Rancho Mirage Country Club, Tamarisk, Mission Hills",
    localContent: `Rancho Mirage is synonymous with desert luxury. The city's upscale communities feature some of the most impressive homes in the valley, with floor-to-ceiling windows, custom architecture, and premium solar installations that deserve premium care.

Homeowners in communities like Thunderbird Heights and The Springs expect white-glove service, and that's exactly what Peace delivers. Our team arrives on time, works efficiently, and leaves your property spotless — every single visit.

Rancho Mirage's many retirement communities also benefit from our subscription packages. We handle the scheduling, show up when planned, and take the worry of home maintenance off your plate. It's the kind of reliable service that Rancho Mirage residents deserve.`,
    customerTypes: "Luxury homeowners, retirement community residents, country club members, seasonal residents, commercial properties along Highway 111",
  },
  "cathedral-city": {
    tagline: "Cathedral City's Reliable Solar & Window Cleaning Service",
    landmarks: "Cathedral City Town Center, Desert Hot Springs border, Date Palm Drive corridor, Cathedral Canyon Country Club",
    neighborhoods: "Cathedral Canyon, Vista del Monte, Dream Homes, Panorama, Cove area, Rio Vista",
    localContent: `Cathedral City — affectionately known as "Cat City" — offers some of the most affordable housing in the central valley, making it a popular choice for families and first-time homebuyers. Many of these newer homes come equipped with solar panels that need regular maintenance.

Located between Palm Springs and Rancho Mirage, Cathedral City experiences the same desert dust, hard water, and wind patterns as its neighbors. Solar panels and windows here need the same professional care.

Peace serves all Cathedral City neighborhoods, from the established areas near Date Palm Drive to the growing communities along East Palm Canyon. Our competitive pricing and subscription packages make professional cleaning accessible for every homeowner.`,
    customerTypes: "Young families, first-time homeowners with solar, small business owners along Date Palm Drive, HOA communities",
  },
  "coachella": {
    tagline: "Coachella's Trusted Solar Panel & Window Cleaning Team",
    landmarks: "Coachella Valley Preserve, Spotlight 29 Casino, Bagdouma Park, Avenue 48 commercial corridor",
    neighborhoods: "Pacific Mayfield, Coachella Crossroads, La Entrada, Monument Park area, Avenue 50 corridor",
    localContent: `The city of Coachella is the eastern anchor of the valley and one of its fastest-growing communities. New housing developments are bringing thousands of new solar-equipped homes to the area, and homeowners need reliable local services.

Coachella's position at the east end of the valley means it catches the brunt of windstorms rolling through the pass. These events can coat solar panels in a thick layer of fine dust overnight, dramatically cutting energy production.

Peace is committed to serving the growing Coachella community with the same professional quality we bring to every city in the valley. Our scheduling and pricing make it easy for new homeowners to keep their solar investment performing at its peak.`,
    customerTypes: "New development homeowners, growing families, solar-equipped home buyers, small businesses",
  },
  "indian-wells": {
    tagline: "Indian Wells' Elite Solar & Window Cleaning Service",
    landmarks: "Indian Wells Tennis Garden (BNP Paribas Open), Indian Wells Golf Resort, The Vintage Club, Eldorado Country Club",
    neighborhoods: "Indian Wells Country Club, The Reserve, The Vintage Club, Eldorado, Mountain View Villas",
    localContent: `Indian Wells is one of the most exclusive communities in the Coachella Valley. With a small population and some of the highest property values in the desert, homeowners here expect nothing less than perfection from their service providers.

The city's luxury homes often feature dramatic glass walls with mountain views, custom solar installations, and meticulous landscaping. These homes deserve cleaning services that match their quality — and that's where Peace comes in.

Our Indian Wells clients appreciate our attention to detail, our reliability, and our discretion. We work around your schedule, take care to protect your landscaping and property, and deliver results that meet the highest standards.`,
    customerTypes: "Luxury estate homeowners, country club residents, seasonal residents with high-end properties, property managers",
  },
  "bermuda-dunes": {
    tagline: "Bermuda Dunes' Dependable Solar & Window Cleaning",
    landmarks: "Bermuda Dunes Airport, Bermuda Dunes Country Club, Washington Street corridor, Desert Willow area",
    neighborhoods: "Bermuda Dunes Country Club, Four Seasons, The Palms, Desert Willow, Washington Charter corridor",
    localContent: `Bermuda Dunes is a charming community nestled between Indio and La Quinta. Known for its country club community and the small regional airport, Bermuda Dunes offers a quieter desert lifestyle with easy access to the entire valley.

Many Bermuda Dunes homes sit along golf course fairways, where sprinkler overspray and fertilizer dust create stubborn deposits on windows and solar panels. The community's mature landscaping also means more pollen and debris buildup throughout the year.

Peace serves the Bermuda Dunes community with the same professional standards and convenient scheduling that our customers across the valley have come to expect. Whether you're in the country club community or the newer developments near Desert Willow, we've got you covered.`,
    customerTypes: "Country club residents, golf course homeowners, families, snowbirds, Four Seasons community members",
  },
};

export default function AreaPage({ onQuizOpen }) {
  const { slug } = useParams();
  const area = AREAS.find(a => a.slug === slug);
  const details = AREA_DETAILS[slug];

  if (!area || !details) return <NotFound />;

  const otherAreas = AREAS.filter(a => a.slug !== slug);

  const metaTitle = `${area.name} Solar & Window Cleaning | ${BUSINESS_NAME}`;
  const metaDesc = `Professional solar panel cleaning, window cleaning & bird proofing in ${area.name}, CA. Serving ${details.neighborhoods.split(",").slice(0,3).join(",")} & more. 5-star rated. Free quotes!`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": `${BUSINESS_NAME} - ${area.name}`,
    "description": `Professional solar panel cleaning, window cleaning, bird proofing, and holiday lighting in ${area.name}, California.`,
    "telephone": "+1-760-299-5187",
    "url": `${DOMAIN}/areas/${area.slug}`,
    "areaServed": { "@type": "City", "name": area.name, "containedInPlace": { "@type": "State", "name": "California" } },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "100", "bestRating": "5" },
    "priceRange": "$$"
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.navy, fontFamily: fontSans }}>
      <SEOHead title={metaTitle} description={metaDesc} path={`/areas/${area.slug}`} schema={schema} />

      {/* Breadcrumb */}
      <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 0", fontSize: 13, fontFamily: fontDisplay }}>
        <Link to="/" style={{ color: C.sage, textDecoration: "none" }}>Home</Link>
        <ChevronRight size={12} style={{ margin: "0 8px", opacity: 0.4 }} />
        <span style={{ opacity: 0.5 }}>Areas Served</span>
        <ChevronRight size={12} style={{ margin: "0 8px", opacity: 0.4 }} />
        <span>{area.name}</span>
      </nav>

      {/* Hero */}
      <header style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <MapPin size={20} color={C.sage} />
          <span style={{ fontFamily: fontDisplay, fontSize: 13, fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: C.sage }}>
            {area.name}, California
          </span>
        </div>
        <h1 style={{ fontFamily: fontSerif, fontSize: "clamp(32px,5vw,56px)", fontWeight: 400, letterSpacing: "-.02em", marginBottom: 20, lineHeight: 1.1 }}>
          {details.tagline}
        </h1>
        <p style={{ fontSize: 18, fontWeight: 500, color: `${C.navy}aa`, lineHeight: 1.8, maxWidth: 720, marginBottom: 32 }}>
          {area.description}
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <button onClick={onQuizOpen} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: C.sage, color: C.navy, padding: "16px 36px", borderRadius: 999,
            fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, letterSpacing: ".1em",
            textTransform: "uppercase", border: "none", cursor: "pointer",
            boxShadow: `0 12px 32px ${C.sage}44`,
          }}>
            Get a Free Quote <ArrowRight size={18} />
          </button>
          <a href={PHONE_LINK} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.navy, color: C.cream, padding: "16px 28px", borderRadius: 999,
            fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, letterSpacing: ".1em",
            textTransform: "uppercase", textDecoration: "none",
          }}>
            <Phone size={14} /> {PHONE}
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: `${C.navy}bb`, lineHeight: 1.9, whiteSpace: "pre-line" }}>
          {details.localContent}
        </div>
      </div>

      {/* Services Available */}
      <section style={{ background: C.offwhite, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: fontSerif, fontSize: "clamp(28px,4vw,40px)", fontWeight: 400, marginBottom: 40, textAlign: "center" }}>
            Services Available in {area.name}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {SERVICES.map(s => (
              <Link key={s.slug} to={`/services/${s.slug}`} style={{
                padding: 28, background: C.white, borderRadius: 20, textDecoration: "none", color: C.navy,
                boxShadow: "0 4px 16px rgba(0,0,0,.05)", transition: "transform .3s",
              }}>
                <img src={s.img} alt={`${s.title} in ${area.name}`} referrerPolicy="no-referrer"
                  style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12, marginBottom: 16 }} />
                <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, letterSpacing: ".04em", marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: `${C.navy}88`, lineHeight: 1.6 }}>
                  Professional {s.shortTitle.toLowerCase()} services in {area.name} and surrounding areas.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Local Details */}
      <section style={{ padding: "80px 24px", background: C.cream }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: fontSerif, fontSize: 32, fontWeight: 400, marginBottom: 24 }}>
            Neighborhoods We Serve in {area.name}
          </h2>
          <p style={{ fontSize: 16, fontWeight: 500, color: `${C.navy}bb`, lineHeight: 1.8, marginBottom: 24 }}>
            {details.neighborhoods}
          </p>

          <h3 style={{ fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, letterSpacing: ".04em", marginBottom: 12, marginTop: 40 }}>
            Nearby Landmarks
          </h3>
          <p style={{ fontSize: 16, fontWeight: 500, color: `${C.navy}bb`, lineHeight: 1.8, marginBottom: 24 }}>
            {details.landmarks}
          </p>

          <h3 style={{ fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, letterSpacing: ".04em", marginBottom: 12, marginTop: 40 }}>
            Who We Serve in {area.name}
          </h3>
          <p style={{ fontSize: 16, fontWeight: 500, color: `${C.navy}bb`, lineHeight: 1.8 }}>
            {details.customerTypes}
          </p>
        </div>
      </section>

      {/* Reviews Marquee */}
      <ReviewsSection heading={`Trusted by Homeowners in ${area.name}`} />

      {/* CTA */}
      <section style={{ background: C.navy, padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: fontSerif, fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: C.cream, marginBottom: 16 }}>
          Serving {area.name} and All of Coachella Valley
        </h2>
        <p style={{ fontSize: 18, fontWeight: 500, color: `${C.cream}bb`, marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
          Get a Quick and Easy Quote. 400+ families served. 100+ five-star reviews.
        </p>
        <button onClick={onQuizOpen} style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: C.sage, color: C.navy, padding: "20px 44px", borderRadius: 999,
          fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, letterSpacing: ".1em",
          textTransform: "uppercase", border: "none", cursor: "pointer",
          boxShadow: `0 16px 40px ${C.sage}44`,
        }}>
          Get a Free Quote <ArrowRight size={20} />
        </button>
      </section>

      {/* Other Areas */}
      <section style={{ padding: "60px 24px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h3 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 400, marginBottom: 24, textAlign: "center" }}>
            Other Areas We Serve
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {otherAreas.map(a => (
              <Link key={a.slug} to={`/areas/${a.slug}`} style={{
                padding: "12px 24px", background: C.offwhite, borderRadius: 999,
                textDecoration: "none", color: C.navy, fontFamily: fontDisplay,
                fontSize: 13, fontWeight: 600, letterSpacing: ".04em", transition: "all .3s",
              }}>
                {a.name}
              </Link>
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
        <p style={{ marginBottom: 24 }}>Area not found.</p>
        <Link to="/" style={{ color: "#8a9d89" }}>Back to Home</Link>
      </div>
    </div>
  );
}
