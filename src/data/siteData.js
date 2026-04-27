/* Shared constants, images, and data for Peace Solar & Window Cleaning */

export const IMG = {
  logo:      "https://lh3.googleusercontent.com/d/1ogIwyqP41cbmi0AhyMkIHTW5DHJqzSIX",
  hero:      "https://lh3.googleusercontent.com/d/17yeef5yaqoLazZcZfvdqGzsLpQVxStM4",
  story:     "https://lh3.googleusercontent.com/d/1PKnhwtemTrD4nSHGmijiNxAkulaZmGUr",
  window:    "https://lh3.googleusercontent.com/d/1vZGU132_9oDTQuiXEoNtdMwf4yJ9g9G9",
  solar:     "https://lh3.googleusercontent.com/d/1bM-4WuGFcO55nJzg--5a-EnGv0mpo57C",
  bird:      "https://lh3.googleusercontent.com/d/1RoYPkmJZIf16iFOvw8eUHRLYXfEJHwla",
  christmas: "https://lh3.googleusercontent.com/d/1wT6WDoT1C1o4mYRmhp8QpNz2Mj3kSHvB",
};

export const C = { navy:"#3d4b65", sage:"#8a9d89", cream:"#f4f1ea", offwhite:"#e6e6e6", white:"#ffffff" };
export const fontSerif = `"Fraunces","Playfair Display",Georgia,serif`;
export const fontSans = `"Inter",system-ui,-apple-system,sans-serif`;
export const fontDisplay = `"Space Grotesk",sans-serif`;

export const PHONE = "760-299-5187";
export const PHONE_LINK = "tel:7602995187";
export const trackPhoneClick = () => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'phone_call_click' }); };
export const BUSINESS_NAME = "Peace Solar & Window Cleaning";
export const DOMAIN = "https://peace-services.com";

export const AREAS = [
  { slug: "palm-desert", name: "Palm Desert", description: "The heart of the Coachella Valley and our most active service area. Palm Desert homeowners rely on Peace for crystal-clear windows and peak solar panel performance year-round." },
  { slug: "la-quinta", name: "La Quinta", description: "Home to world-class golf communities and luxury estates, La Quinta homeowners trust Peace to keep their solar panels efficient and windows sparkling in the desert sun." },
  { slug: "indio", name: "Indio", description: "The City of Festivals deserves spotless homes. From the neighborhoods near the polo grounds to downtown Indio, we keep solar panels clean and windows streak-free." },
  { slug: "rancho-mirage", name: "Rancho Mirage", description: "Known for its luxury resorts and retirement communities, Rancho Mirage homeowners count on Peace for premium solar and window cleaning with white-glove service." },
  { slug: "cathedral-city", name: "Cathedral City", description: "Cathedral City's growing communities deserve top-tier cleaning services. We serve residential and commercial properties throughout Cat City with professional results." },
  { slug: "coachella", name: "Coachella", description: "The eastern gateway to the valley, Coachella is one of the fastest-growing communities in the desert. We help homeowners protect their solar investment with regular cleaning." },
  { slug: "indian-wells", name: "Indian Wells", description: "One of the most exclusive communities in the valley, Indian Wells homeowners expect the best. Peace delivers premium solar panel and window cleaning to match." },
  { slug: "bermuda-dunes", name: "Bermuda Dunes", description: "Nestled between Indio and La Quinta, Bermuda Dunes is home to beautiful golf course communities. We keep your solar panels and windows in pristine condition." },
  { slug: "palm-springs", name: "Palm Springs", description: "The iconic desert city known for mid-century modern architecture and vibrant culture. Palm Springs homeowners trust Peace for expert solar panel and window cleaning year-round." },
  { slug: "desert-hot-springs", name: "Desert Hot Springs", description: "Famous for its natural hot mineral springs and wellness retreats, Desert Hot Springs homeowners count on Peace to keep solar panels efficient and windows spotless." },
];

export const SERVICES = [
  {
    slug: "solar-panel-cleaning",
    title: "Solar Panel Cleaning",
    shortTitle: "Solar Cleaning",
    icon: "Sun",
    img: "https://lh3.googleusercontent.com/d/14O2JK5nQRUfMvcRJ0IVpsEdIJLmJyXkq",
    metaTitle: "Solar Panel Cleaning in Coachella Valley | Peace Solar & Window",
    metaDescription: "Professional solar panel cleaning in Coachella Valley. Restore up to 30% lost energy output. Serving Palm Desert, La Quinta, Indio & more. Free quotes!",
    heroHeadline: "Solar Panel Cleaning That Pays for Itself",
    heroSubtext: "Desert dust, pollen, and bird droppings can reduce your solar panel output by up to 30%. Our professional cleaning restores full efficiency so your panels generate maximum savings.",
    sections: [
      {
        heading: "Why Your Solar Panels Need Professional Cleaning",
        content: `Living in the Coachella Valley means your solar panels face unique challenges. Between the desert dust storms, mineral-rich hard water spots, and year-round pollen, your panels are constantly losing efficiency. Most homeowners don't realize their solar panels are underperforming until they see a spike in their electricity bill.

Studies show that dirty solar panels can lose 20-30% of their energy output. In the Coachella Valley's extreme heat, that translates to hundreds of dollars in lost savings each year. Professional solar panel cleaning restores your system to peak performance, maximizing your return on investment.

Unlike DIY cleaning methods, our team uses purified water systems and soft-bristle techniques recommended by major solar manufacturers. This protects your panels' anti-reflective coating while removing stubborn desert grime that garden hoses simply can't handle.`
      },
      {
        heading: "Our Solar Panel Cleaning Process",
        content: `Every Peace solar cleaning follows a meticulous 4-step process:

1. **Pre-Inspection**: We check every panel for damage, loose connections, and critter activity before we start. If we spot anything concerning, we document it and let you know.

2. **Purified Water Rinse**: We use a deionized water system that leaves zero mineral deposits. This is critical in the Coachella Valley where tap water is notoriously hard and would leave white spots on your panels.

3. **Soft-Brush Detailing**: Stubborn buildup like bird droppings and tree sap gets gentle scrubbing with manufacturer-approved soft brushes. No harsh chemicals, no pressure washing.

4. **Post-Clean Verification**: We visually inspect every panel after cleaning and document the results. Many of our customers see an immediate jump in their solar app's production readings.`
      },
      {
        heading: "How Often Should You Clean Solar Panels in the Desert?",
        content: `The Coachella Valley's desert climate means more frequent cleaning than most areas of the country. We recommend:

- **Quarterly cleaning** for maximum efficiency (our Quarterly Pro Package includes this with 20% off)
- **Bi-annual cleaning** at minimum — before and after summer is ideal
- **After dust storms** — a single haboob can coat your panels and cut output immediately

Our most popular option is the Quarterly Pro Package. Your cleanings are automatically scheduled, you save 20% on every visit, and you get unlimited rain insurance so we'll come back free if rain dirties your panels between visits.`
      }
    ],
    faq: [
      { q: "How much does solar panel cleaning cost in the Coachella Valley?", a: "Pricing depends on the number of panels and accessibility. We provide free, no-obligation quotes. Most residential systems cost between $150-$350 per cleaning, with significant savings available through our subscription packages." },
      { q: "Will cleaning my solar panels void the warranty?", a: "No — in fact, most solar manufacturers recommend regular professional cleaning. We use only manufacturer-approved methods: purified water and soft brushes, never harsh chemicals or pressure washers." },
      { q: "How quickly will I see results after cleaning?", a: "Most homeowners see an immediate improvement in their solar monitoring app within 24 hours. Customers typically report 15-30% increases in energy production after a professional cleaning." },
      { q: "Do you clean solar panels on tile roofs and two-story homes?", a: "Yes, we're fully equipped and insured for all roof types including tile, flat, and steep-pitch roofs. We clean both single and multi-story homes safely." },
    ]
  },
  {
    slug: "window-cleaning",
    title: "Window Cleaning",
    shortTitle: "Window Cleaning",
    icon: "Wind",
    img: "https://lh3.googleusercontent.com/d/1s3U7p1MWwh0F2vbeerpAl1OLVRhMo41E",
    metaTitle: "Window Cleaning in Coachella Valley | Peace Solar & Window",
    metaDescription: "Professional window cleaning in Palm Desert, La Quinta, Indio & Coachella Valley. Interior & exterior. Streak-free guaranteed. 100+ 5-star reviews. Free quotes!",
    heroHeadline: "Crystal Clear Windows, Guaranteed",
    heroSubtext: "Desert dust, hard water stains, and mineral buildup don't stand a chance. Our professional window cleaning leaves every pane streak-free and sparkling — inside and out.",
    sections: [
      {
        heading: "Professional Window Cleaning for Desert Homes",
        content: `Coachella Valley homeowners know the struggle: you clean your windows and within days, desert dust and hard water spots are back. That's because standard cleaning methods don't address the mineral-rich water and fine sand particles unique to our desert climate.

Peace Solar & Window Cleaning uses professional-grade purified water systems and specialized squeegee techniques that deliver a streak-free finish that lasts. We clean both exterior and interior windows, frames, screens, and tracks — leaving your home looking brand new.

Whether you have floor-to-ceiling glass walls overlooking the mountains, skylights, or standard residential windows, our team handles it all with care and precision. We're fully insured and trained for multi-story homes, tile roofs, and hard-to-reach windows.`
      },
      {
        heading: "Interior & Exterior Window Cleaning",
        content: `We offer two levels of window cleaning service:

**Exterior Only** — Perfect for maintenance between full cleans. We clean all exterior glass surfaces, remove cobwebs and debris from frames, and ensure your home's curb appeal stays sharp.

**Interior & Exterior** — Our full-service option. We clean both sides of every window, detail the frames and sills, clean screens, and remove built-up dust from tracks. This is the service most of our recurring customers choose.

Both options include our satisfaction guarantee: if you find a single streak, we'll come back and make it right, no questions asked.`
      },
      {
        heading: "Why Desert Homes Need Regular Window Cleaning",
        content: `The Coachella Valley presents unique challenges for keeping windows clean:

- **Hard water deposits**: Our local water is among the hardest in California. Sprinkler overspray and rain create stubborn mineral spots that etch into glass over time if not properly removed.
- **Desert dust and sand**: Fine particulate from the valley floor and seasonal wind events coats everything. When combined with morning dew, it creates a gritty film.
- **Sun damage**: UV exposure accelerates oxidation on window frames and seals. Regular cleaning helps identify deterioration before it becomes costly.

We recommend quarterly window cleaning for most Coachella Valley homes, especially those near golf courses, construction zones, or open desert areas.`
      }
    ],
    faq: [
      { q: "Do you clean both inside and outside windows?", a: "Yes! We offer both exterior-only and full interior + exterior window cleaning. Most of our recurring customers will choose to add inside whenever they feel its needed." },
      { q: "How do you handle hard water stains on windows?", a: "We use professional-grade purified water and specialized hard water removal techniques designed for the Coachella Valley's mineral-heavy water. For severe buildup, we use safe restoration compounds that won't damage your glass." },
      { q: "Do you clean screens and tracks?", a: "Yes, our full-service window cleaning includes frames, sills, dusting your screens, and slider tracks with an interior cleaning." },
      { q: "How often should I get my windows cleaned in the desert?", a: "We recommend quarterly cleaning for most desert homes. Our Quarterly Pro Package makes this easy with automatic scheduling, 20% off every clean, and unlimited rain insurance." },
    ]
  },
  {
    slug: "bird-proofing",
    title: "Bird Proofing",
    shortTitle: "Bird Proofing",
    icon: "ShieldCheck",
    img: "https://lh3.googleusercontent.com/d/1fXCi6JCHUa5f7HFjMCXEb-DdDqKl5aoY",
    metaTitle: "Solar Panel Bird Proofing in Coachella Valley | Peace Solar & Window",
    metaDescription: "Protect your solar panels from pigeons and birds. Professional bird proofing and critter guard installation in Coachella Valley. Prevent nesting damage. Free quotes!",
    heroHeadline: "Protect Your Solar Investment from Birds",
    heroSubtext: "Pigeons and other birds love nesting under solar panels. Their droppings, debris, and nesting materials damage wiring, reduce efficiency, and create health hazards. Our bird proofing stops them for good.",
    sections: [
      {
        heading: "Why Solar Panels Attract Birds in the Coachella Valley",
        content: `Solar panels create the perfect shelter for pigeons, doves, and other desert birds. The gap between your panels and the roof provides shade from the brutal Coachella Valley sun, protection from predators, and a warm roosting spot.

The problem? Bird nesting under solar panels causes serious damage:

- **Droppings corrode wiring and panels**, leading to expensive repairs and voided warranties
- **Nesting materials block airflow**, causing panels to overheat and lose efficiency
- **Accumulated debris traps moisture**, which can damage your roof underneath
- **Health hazard**: bird droppings carry bacteria and fungi that become airborne

Left unchecked, bird damage can cost thousands in solar panel repairs and roof damage. Bird proofing is a one-time investment that protects your solar system for years.`
      },
      {
        heading: "Our Bird Proofing Installation Process",
        content: `Peace installs professional-grade critter guards (also called solar panel bird mesh) that create a physical barrier preventing birds from nesting under your panels.

**What's included:**
- Full removal of existing nests, droppings, and debris from under panels
- Thorough cleaning of panels and surrounding roof area
- Installation of heavy-duty galvanized mesh clips around the entire perimeter of your solar array
- Mesh is attached without drilling into your roof or panels — no warranty violations
- Clean, low-profile finish that's virtually invisible from the ground

Our critter guards are built to withstand the Coachella Valley's extreme temperatures, UV exposure, and wind. They come with a workmanship guarantee and typically last 10+ years without maintenance.`
      },
      {
        heading: "Signs You Need Bird Proofing",
        content: `Not sure if you have a bird problem? Look for these signs:

- Pigeons roosting on or around your solar panels, especially in early morning or evening
- Bird droppings on your panels, roof, or patio below the panels
- Visible nesting material (twigs, leaves, feathers) poking out from under panels
- Scratching or cooing sounds coming from your roof
- Decreased solar panel output on your monitoring app
- Stains on your roof or fascia boards below the panel array

If you've noticed any of these signs, don't wait. Bird damage compounds quickly — the longer birds nest, the more damage they cause. We offer free inspections and can usually install bird proofing on the same visit as a solar panel cleaning.`
      }
    ],
    faq: [
      { q: "Will bird proofing damage my solar panels or roof?", a: "No. Our critter guards attach with specialized clips that don't require drilling into your roof or panels. Your solar warranty stays fully intact." },
      { q: "How long does bird proofing last?", a: "Our special material galvanized mesh PVC critter guards are designed for the desert climate and typically last as long as your solar system. Material is extremely important to install, to prevent the problem getting worse. They're UV-resistant and rated for high winds." },
      { q: "Can you remove existing bird nests before installing?", a: "Yes, nest and debris removal is included in every bird proofing installation. We fully clean the area under your panels before installing the mesh barrier." },
      { q: "How much does solar panel bird proofing cost?", a: "Pricing greatly depends on the perimeter of the solar system (amount of mesh needed) and how much waste we find under the panels. We provide free quotes in person quotes." },
    ]
  },
  {
    slug: "holiday-lighting",
    title: "Holiday Lighting",
    shortTitle: "Holiday Lighting",
    icon: "Snowflake",
    img: IMG.christmas,
    metaTitle: "Holiday Light Installation in Coachella Valley | Peace Solar & Window",
    metaDescription: "Professional holiday light installation & removal in Coachella Valley. Custom designs for homes and businesses. Hassle-free from setup to takedown. Free quotes!",
    heroHeadline: "Effortless Holiday Lighting for Your Home",
    heroSubtext: "Skip the ladder and the tangled lights. We design, install, maintain, and remove holiday lighting so you can enjoy the season stress-free.",
    sections: [
      {
        heading: "Professional Holiday Light Installation",
        content: `The holidays should be about enjoying time with family — not spending weekends on a ladder untangling lights. Peace Solar & Window Cleaning offers full-service holiday lighting for homes and businesses across the Coachella Valley.

From classic warm white rooflines to full custom displays, we handle every detail:

- **Custom design consultation** — We work with you to create the perfect look for your home
- **Professional installation** — Our trained team handles all the ladder work safely
- **Maintenance** — If a bulb goes out or a strand shifts, we come back and fix it
- **Takedown and storage** — After the season, we remove everything and can store your lights for next year

Our holiday lighting service runs from early November through January. We recommend booking early — our schedule fills up fast in the Coachella Valley.`
      },
      {
        heading: "Residential & Commercial Holiday Lighting",
        content: `**For Homeowners:** Transform your home into the neighborhood showpiece. We offer roofline lighting, tree wrapping, palm tree wrapping, neatly wired to an automatic timer. Choose from classic, modern, or custom color schemes.

**For Businesses:** Make your storefront or office stand out during the busiest shopping season. Professional holiday lighting increases foot traffic and creates a welcoming atmosphere for customers. We work with HOAs, shopping centers, restaurants, and office buildings.

**For HOAs & Property Managers:** We offer community-wide holiday lighting packages for common areas, clubhouses, and entrances. Consistent, professional results across your entire property.`
      }
    ],
    faq: [
      { q: "When should I book holiday light installation?", a: "We recommend booking by early October to secure your preferred installation date. Our November and December schedule fills up quickly. Installation typically begins in early November." },
      { q: "Do you provide the lights or do I need to buy them?", a: "We provide all of the lights, we offer premium commercial-grade LED lights. We only install lights we provide" },
      { q: "Do you take down the lights after the holidays?", a: "Yes! Takedown and removal is included in our full-service package. We typically schedule removals for January. We can also store your lights for next season." },
      { q: "Do you do commercial holiday lighting?", a: "Absolutely. We serve businesses, HOAs, shopping centers, and commercial properties throughout the Coachella Valley." },
    ]
  },
];

export const PLANS = [
  {name:"One-Time Cleaning",features:[{t:"Full Price",on:false},{t:"Auto-Scheduled",on:false},{t:"Unlimited Rain-Insurance",on:false}],hl:false,borderColor:"#000000"},
  {name:"Bi-Annual Basic Package",features:[{t:"10% OFF Each Clean",on:true},{t:"Scheduled 2x a year",on:true},{t:"Unlimited Rain-Insurance",on:false}],hl:false,borderColor:"#000000"},
  {name:"Quarterly Pro Package",features:[{t:"20% OFF Each Clean",on:true},{t:"Scheduled 4x a year",on:true},{t:"Unlimited Rain-Insurance",on:true}],hl:true,borderColor:"#8a9d89"},
];

export const FALLBACK_REVIEWS = [
  // Takeout reviews (from Google Business Profile export)
  { author_name: "Bryson Lundquist", rating: 5, relative_time_description: "2 days ago", text: "Peace cleaning came and cleaned my solar panels. He did a great job and was very professional. Would highly recommended them." },
  { author_name: "Allen Philip Gapuz", rating: 5, relative_time_description: "a week ago", text: "Did a good job! Very nice guys, easy to talk to with regards to issues that needed resolving.. good luck and thank you!" },
  { author_name: "Roger", rating: 5, relative_time_description: "2 weeks ago", text: "Outstanding service cleaning our solar panels. So careful not to damage the roof or the difficult access to it. Highly recommended them." },
  { author_name: "Holly DeTizio", rating: 5, relative_time_description: "2 weeks ago", text: "The Peace Family did a very great job at pigeon proofing my solar panels. Great communication, fast service, friendly and knowledgeable." },
  { author_name: "R. Travis Lee", rating: 5, relative_time_description: "2 weeks ago", text: "These guys are prompt, efficient, and professional. Couldn't ask for better." },
  { author_name: "Joe Camareno", rating: 5, relative_time_description: "3 weeks ago", text: "Fantastic results. Jack and his crew were great in my home with a dog and two cats. I am very happy and I look forward to the next visit in six months." },
  { author_name: "Kathleen Rippinger Russell", rating: 5, relative_time_description: "3 weeks ago", text: "I highly recommend this place. The owner is great. They do a good job. They come every six months and you get a better deal when they do that and your windows are clean all year long." },
  { author_name: "Bryan Wilson", rating: 5, relative_time_description: "3 weeks ago", text: "The team is prompt, courteous and extremely professional. They treat your home as it was their own. It's also super cool to see your solar production JUMP after the cleaning of your solar panels. Higher solar production, means a lower electric bill!" },
  { author_name: "Christian Parto", rating: 5, relative_time_description: "a month ago", text: "Very professional. They leave my windows and solar panels always crystal clear. These guys are very respectful too. Hands down." },
  { author_name: "Debbie Feller Glassman", rating: 5, relative_time_description: "a month ago", text: "The best windows, screens, frames job we ever had. Truly. The two young men who run this company are so nice, friendly and professional. We will only use them from here on in." },
  { author_name: "John Hunter", rating: 5, relative_time_description: "a month ago", text: "Excellent job by these guys. Highly recommend them. We gave 4 levels including 'roof only access window' and was no problem. Friendly and knowledgeable, will definitely use them again." },
  { author_name: "Nigel Banister", rating: 5, relative_time_description: "a month ago", text: "The gentlemen were professional, detailed and efficient." },
  { author_name: "Nicole Boyles", rating: 5, relative_time_description: "a month ago", text: "Peace solar is professional and have great communication. The guys are knowledgeable and work hard. They knew exactly what the problem was and knew exactly what to do!" },
  { author_name: "Foster Marruffo", rating: 5, relative_time_description: "2 months ago", text: "I have finally found the perfect cleaners for my Solar Panels! I would 100% recommend Jack (Peace Solar and Window Cleaning) and his team to keep my solar panels clean!" },
  // Previously sourced reviews
  { author_name: "Jamie Morreale", rating: 5, relative_time_description: "a month ago", text: "They were extremely easy to work with and did an amazing job. They showed up and were quick and efficient and worked around my schedule and my unique needs. Highly recommend, will definitely have them out again." },
  { author_name: "Christine McCarron", rating: 5, relative_time_description: "2 months ago", text: "I have already recommended these guys at my work place! They have the best attitude and were very good at their job! They worked quickly because I had a dentist appointment that I forgot I booked months ago. They were excellent and I thought the price was reasonable." },
  { author_name: "Pedro D Reyes", rating: 5, relative_time_description: "2 months ago", text: "Peace Solar Cleaning was amazing from start to finish and extremely easy to work with. They took the time to explain the entire process in a way that actually made sense. Highly recommend their services to anyone in the valley." },
  { author_name: "Felipe S", rating: 5, relative_time_description: "3 months ago", text: "I'm glad I went with Peace solar and window cleaning. Jack was very helpful with options on pigeon deterrents. Installation was easy and fast. Definitely would recommend to my friends and family." },
  { author_name: "Salam Khoury Ramirez", rating: 5, relative_time_description: "3 months ago", text: "Excellent job every time! We've used Peace Solar and Window Cleaning in the past for cleaning services and more recently for Christmas light hanging. Their work is impeccable and the crew is professional, kind, and eager to serve." },
  { author_name: "John Lehman", rating: 5, relative_time_description: "4 months ago", text: "Amazing work by this team. Great guys, hard workers, quality products and attention to detail. Were super happy with our Christmas light installation and will be working with them again for our windows and solar cleaning." },
  { author_name: "Louie Becerra", rating: 5, relative_time_description: "3 months ago", text: "Jack and Ben are friendly and professional. I had a bad pigeon problem (a flock of them) under my solar panels. I'm glad I called them out here. Great job! And they worked on my panels while it was raining." },
  { author_name: "Rosario Cracchiolo", rating: 5, relative_time_description: "5 months ago", text: "We had a big problem with pigeons, and they were making a mess on our property. Jason and his team came out and did a wonderful job installing spikes on the roof, and they were so helpful in guiding us through other ways to keep the pigeons away." },
];

export const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/EmqV3yHGqNtAgSD5vZXQ/webhook-trigger/2f29cb6a-7ba0-4132-88e4-53c79c2fd356";
