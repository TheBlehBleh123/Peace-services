# Implementation Roadmap: Peace Solar & Window Cleaning

---

## Phase 1: Foundation (Weeks 1-4)

### Week 1-2: Technical Infrastructure

- [ ] **Migrate from SPA to multi-page architecture**
  - Add React Router (or migrate to Next.js/Astro)
  - Create route structure: /, /services/*, /areas-served/*, /about, /contact, /pricing, /get-quote
  - Ensure each route returns server-rendered or pre-rendered HTML

- [ ] **Move images off Google Drive**
  - Host locally or use CDN (Cloudflare Images, ImageKit)
  - Convert to WebP format
  - Add descriptive alt text to all images
  - Implement lazy loading

- [ ] **Add foundational SEO elements**
  - Unique `<title>` and `<meta description>` per page
  - Open Graph and Twitter Card meta tags
  - Canonical tags
  - robots.txt
  - XML sitemap

### Week 3-4: Core Pages & Schema

- [ ] **Build core pages with SEO content**
  - Homepage (500+ words, clear value prop, service area)
  - About page (Jack & Ben's story, E-E-A-T signals)
  - Contact page with embedded map
  - Pricing/packages page

- [ ] **Implement LocalBusiness schema**
  - Site-wide LocalBusiness JSON-LD
  - Service schema on service pages
  - AggregateRating on reviews page

- [ ] **Set up analytics**
  - Google Analytics 4
  - Google Search Console (verify domain)
  - Set up conversion tracking (quote form submissions)

---

## Phase 2: Expansion (Weeks 5-12)

### Week 5-8: Service & Location Pages

- [ ] **Create dedicated service pages** (800+ words each)
  - /services/window-cleaning
  - /services/solar-panel-cleaning
  - /services/bird-proofing
  - /services/holiday-lighting

- [ ] **Create location pages** (500+ words, 40%+ unique each)
  - /areas-served/palm-desert
  - /areas-served/palm-springs
  - /areas-served/la-quinta
  - /areas-served/indio
  - /areas-served/cathedral-city
  - /areas-served/rancho-mirage
  - /areas-served/indian-wells
  - /areas-served/coachella

- [ ] **Internal linking structure**
  - Service pages link to relevant location pages
  - Location pages link to all available services
  - Homepage links to top services and locations
  - Footer navigation with service and area links

### Week 5-6: Google Business Profile

- [ ] Create/verify GBP listing
- [ ] Set primary category and additional categories
- [ ] Add all service areas (individual cities)
- [ ] Upload 20+ photos
- [ ] Set business hours
- [ ] Add services with descriptions
- [ ] Set up review request workflow

### Week 9-12: Blog Launch & Citations

- [ ] **Launch blog with initial posts**
  - "How Often Should You Clean Solar Panels in the Desert?" (1,500+ words)
  - "Complete Guide to Window Cleaning in Coachella Valley" (1,500+ words)
  - "Why Bird Proofing Your Solar Panels Saves Thousands" (1,500+ words)
  - "Solar Panel Cleaning: Before and After Results" (1,500+ words)

- [ ] **Build Tier 1 citations**
  - Apple Business Connect
  - Bing Places
  - Yelp
  - Facebook Business
  - BBB

- [ ] **Submit to data aggregators**
  - Data Axle
  - Foursquare
  - Neustar/TransUnion Digital

---

## Phase 3: Scale (Weeks 13-24)

### Content Expansion

- [ ] Publish 2 blog posts per month (see CONTENT-CALENDAR.md)
- [ ] Create before/after gallery page with optimized images
- [ ] Add FAQ page targeting voice search queries
- [ ] Create seasonal landing pages (monsoon prep, summer solar maintenance)

### Local SEO Amplification

- [ ] Build Tier 2 citations (Angi, Thumbtack, Nextdoor, HomeStars)
- [ ] Pursue local backlinks (Coachella Valley Chamber of Commerce, local news)
- [ ] Set up GBP posting schedule (1-2x/week)
- [ ] Implement review generation workflow (post-service follow-up)

### Performance Optimization

- [ ] Audit Core Web Vitals and optimize
- [ ] Implement image CDN with automatic format negotiation
- [ ] Optimize JavaScript bundle size
- [ ] Add service worker for repeat visitors

---

## Phase 4: Authority (Months 7-12)

### Thought Leadership

- [ ] Create definitive guides ("The Complete Coachella Valley Solar Panel Maintenance Guide")
- [ ] Pursue local media mentions and features
- [ ] Partner with local solar installers for referral content
- [ ] Create video content (cleaning process, tips) for YouTube and GBP

### Advanced SEO

- [ ] Implement advanced schema (VideoObject, HowTo for process content)
- [ ] A/B test title tags and meta descriptions
- [ ] Build service + city combination pages for top-performing pairs
- [ ] Monitor and optimize for AI search visibility (ChatGPT, Perplexity)

### GEO Optimization

- [ ] Get listed on curated "best of" Coachella Valley lists
- [ ] Build Reddit presence in relevant local/home improvement subreddits
- [ ] Create `llms.txt` file for AI crawler guidance
- [ ] Monitor brand citations in AI-generated answers

---

## Resource Requirements

| Resource | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|----------|---------|---------|---------|---------|
| Developer | 40-60 hrs | 30-40 hrs | 10-15 hrs | 10 hrs |
| Content Writer | 5 hrs | 30-40 hrs | 15-20 hrs/mo | 10-15 hrs/mo |
| Photography | - | 5 hrs | 2 hrs/mo | 2 hrs/mo |
| GBP Management | 3 hrs | 2 hrs/week | 2 hrs/week | 1 hr/week |

---

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| SPA migration breaks existing functionality | Thorough testing, keep existing code as fallback |
| Google Drive image URLs break | Redirect old URLs, update all references |
| GBP verification delays (video verification) | Start early in Phase 1 |
| Thin location page content | Research each city for unique local details before writing |
| Review velocity drops | Automate post-service review request emails |
