// Vercel Serverless Function — Google Places Reviews Proxy
// Fetches 5 live reviews from Google, then supplements with curated
// backup reviews to ensure 12-16 unique reviews are always displayed.

const PLACE_ID = "ChIJ3wZR2lr92oAR1ch_JMP5GcY";

// In-memory cache (persists across warm invocations on same Vercel instance)
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Curated backup reviews — real review content from your Google listing.
// These fill in when the API only returns 5. Update periodically by
// copying fresh reviews from your Google Business Profile.
const BACKUP_REVIEWS = [
  { author_name: "Jamie Morreale", profile_photo_url: "", rating: 5, relative_time_description: "a month ago", text: "They were extremely easy to work with and did an amazing job. They showed up and we're quick and efficient and worked around my schedule and my unique needs. Highly recommend, will definitely have them out again." },
  { author_name: "Christine McCarron", profile_photo_url: "", rating: 5, relative_time_description: "a month ago", text: "I have already recommended these guys at my work place! They have the best attitude and were very good at their job! They worked quickly because I had a dentist appointment that I forgot I booked months ago. They were excellent and I thought the price was reasonable." },
  { author_name: "Pedro D Reyes", profile_photo_url: "", rating: 5, relative_time_description: "2 months ago", text: "Peace Solar Cleaning was amazing from start to finish and extremely easy to work with. They took the time to explain the entire process in a way that actually made sense. Highly recommend their services to anyone in the valley." },
  { author_name: "FELIPE S", profile_photo_url: "", rating: 5, relative_time_description: "a month ago", text: "I'm glad I went with Peace solar and window cleaning. Jack was very helpful with options on pigeon deterrents. Installation was easy and fast. Definitely would recommend to my friends and family." },
  { author_name: "Salam Khoury Ramirez", profile_photo_url: "", rating: 5, relative_time_description: "3 months ago", text: "Excellent job every time! We've used Peace Solar and Window Cleaning in the past for cleaning services and more recently for Christmas light hanging. Their work is impeccable and the crew is professional, kind, and eager to serve." },
  { author_name: "John Lehman", profile_photo_url: "", rating: 5, relative_time_description: "4 months ago", text: "Amazing work by this team. Great guys, hard workers, quality products and attention to detail. Were super happy with our Christmas light installation and will be working with them again for our windows and solar cleaning." },
  { author_name: "Louie Becerra", profile_photo_url: "", rating: 5, relative_time_description: "a month ago", text: "Jack and Ben are friendly and professional. I had a bad pigeon problem (a flock of them) under my solar panels. I'm glad I called them out here. Great job! And they worked on my panels while it was raining." },
  { author_name: "Rosario Cracchiolo", profile_photo_url: "", rating: 5, relative_time_description: "6 months ago", text: "We had a big problem with pigeons, and they were making a mess on our property. Jason and his team came out and did a wonderful job installing spikes on the roof, and they were so helpful in guiding us through other ways to keep the pigeons away." },
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=1800");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  // Return cached data if still fresh
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return res.status(200).json(cache.data);
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?key=${apiKey}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
    });

    let liveReviews = [];
    let rating = 5;
    let totalReviews = 81;

    if (response.ok) {
      const data = await response.json();
      rating = data.rating || 5;
      totalReviews = data.userRatingCount || 81;
      liveReviews = (data.reviews || []).map((r) => ({
        author_name: r.authorAttribution?.displayName || "Google User",
        profile_photo_url: r.authorAttribution?.photoUri || "",
        rating: r.rating || 5,
        relative_time_description: r.relativePublishTimeDescription || "",
        text: r.text?.text || "",
      }));
    }

    // Merge: live reviews first, then backups (skip any name collisions)
    const seen = new Set(liveReviews.map((r) => r.author_name.toLowerCase().trim()));
    const supplemental = BACKUP_REVIEWS.filter(
      (r) => !seen.has(r.author_name.toLowerCase().trim())
    );
    const allReviews = [...liveReviews, ...supplemental];

    const result = {
      reviews: allReviews,
      rating,
      totalReviews,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: result, timestamp: now };
    return res.status(200).json(result);
  } catch (err) {
    console.error("Reviews API error:", err);
    // On error, return backup reviews so the site never looks empty
    return res.status(200).json({
      reviews: BACKUP_REVIEWS,
      rating: 5,
      totalReviews: 81,
      fetchedAt: new Date().toISOString(),
    });
  }
}
