# Site Structure: Peace Solar & Window Cleaning

---

## URL Hierarchy

```
peace-services.com
│
├── / (Homepage)
│   ├── Hero + CTA
│   ├── Services overview (links to each service)
│   ├── Service area map
│   ├── Social proof (reviews, stats)
│   └── About teaser (links to /about)
│
├── /services/
│   ├── /window-cleaning
│   ├── /solar-panel-cleaning
│   ├── /bird-proofing
│   └── /holiday-lighting
│
├── /areas/
│   ├── /palm-desert
│   ├── /la-quinta
│   ├── /indio
│   ├── /rancho-mirage
│   ├── /cathedral-city
│   ├── /coachella
│   ├── /indian-wells
│   └── /bermuda-dunes
│
├── /pricing (3 packages: One-Time, Bi-Annual, Quarterly Pro)
├── /about (Jack & Ben's story, team, values)
├── /reviews (Google Reviews integration + testimonials)
├── /gallery (before/after photos organized by service)
├── /blog/ (articles index)
│   └── /blog/[slug] (individual posts)
├── /contact (form, phone, email, service area map)
├── /get-quote (multi-step quiz form)
└── /faq
```

**Total pages at launch:** ~20 (home + 4 services + 8 locations + about + reviews + gallery + pricing + contact + get-quote + faq)

---

## Internal Linking Map

### Homepage Links To:

- All 4 service pages (prominent service cards)
- Top 3-4 location pages (service area section)
- /pricing (CTA)
- /get-quote (primary CTA)
- /about (story teaser)
- /reviews (social proof)
- Latest 2-3 blog posts (when blog launches)

### Service Page Links To:

| From | Links To |
|------|----------|
| /services/window-cleaning | /services/solar-panel-cleaning, /pricing, /get-quote, 2-3 location pages, related blog posts |
| /services/solar-panel-cleaning | /services/bird-proofing, /pricing, /get-quote, 2-3 location pages, related blog posts |
| /services/bird-proofing | /services/solar-panel-cleaning, /pricing, /get-quote, related blog posts |
| /services/holiday-lighting | /pricing, /get-quote, /gallery, related blog posts |

### Location Page Links To:

Each location page links to:
- All 4 service pages
- /pricing
- /get-quote
- /reviews
- 1-2 neighboring location pages
- Relevant blog posts

### Blog Post Links To:

Each post should link to:
- 1-2 relevant service pages
- 1 relevant location page
- 1-2 other blog posts
- /get-quote (CTA)

---

## Navigation Structure

### Header Nav

```
[Logo]  Services v  Areas Served v  Pricing  About  Reviews  Blog  [Get a Quote - button]
          ├── Window Cleaning        ├── Palm Desert
          ├── Solar Panel Cleaning   ├── Palm Springs
          ├── Bird Proofing          ├── La Quinta
          └── Holiday Lighting       ├── Indio
                                     ├── Cathedral City
                                     ├── Rancho Mirage
                                     ├── Indian Wells
                                     └── Coachella
```

### Footer Nav

```
Services                Areas We Serve           Company              Connect
├── Window Cleaning     ├── Palm Desert          ├── About Us         ├── Get a Quote
├── Solar Cleaning      ├── Palm Springs         ├── Reviews          ├── Phone: [number]
├── Bird Proofing       ├── La Quinta            ├── Gallery          ├── Email: [email]
└── Holiday Lighting    ├── Indio                ├── Blog             ├── Facebook
                        ├── Cathedral City       └── FAQ              ├── Instagram
                        ├── Rancho Mirage                             └── Yelp
                        ├── Indian Wells
                        └── Coachella

[Peace Solar & Window Cleaning logo]
[NAP: Business Name, Service Area, Phone]
```

---

## Page Title & Meta Description Templates

| Page Type | Title Template | Meta Description Template |
|-----------|---------------|--------------------------|
| Homepage | Peace Solar & Window Cleaning \| Coachella Valley, CA | Professional solar panel cleaning, window cleaning & bird proofing in Coachella Valley. 400+ families served. 5-star rated. Get a free quote today. |
| Service | [Service] in Coachella Valley \| Peace Solar & Window | Professional [service] for Coachella Valley homes. [Key benefit]. Trusted by 400+ families. Schedule your cleaning today. |
| Location | [Service Area]: Solar & Window Cleaning \| Peace | Solar panel cleaning, window cleaning & bird proofing in [City], CA. Serving [City] and surrounding areas. 5-star rated. Free quotes. |
| Blog | [Post Title] \| Peace Solar & Window Cleaning | [Compelling summary under 155 chars with primary keyword and CTA] |
| About | About Us \| Peace Solar & Window Cleaning | Meet Jack & Ben, founders of Peace Solar & Window Cleaning. Serving 400+ Coachella Valley families with 5-star rated cleaning services. |
| Pricing | Cleaning Plans & Pricing \| Peace Solar & Window | Choose from one-time, bi-annual, or quarterly cleaning packages. Save up to 20% with our Quarterly Pro Package. Get your quote today. |

---

## Breadcrumb Structure

```
Home > Services > Window Cleaning
Home > Areas Served > Palm Desert
Home > Blog > How Often Should You Clean Solar Panels?
```

Implement with BreadcrumbList schema on every page.

---

## Orphan Page Prevention

Every page must be linked from:
1. At least one navigation element (header, footer, or sidebar)
2. At least one contextual in-content link from another page
3. The XML sitemap
