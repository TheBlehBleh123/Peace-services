// Vercel Serverless Function — Google Places Reviews Proxy
// Keeps the API key server-side and caches results for 24 hours

const PLACE_ID = "ChIJ3wZR2lr92oAR1ch_JMP5GcY";

// In-memory cache (persists across warm invocations on same Vercel instance)
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

export default async function handler(req, res) {
  // CORS headers for the frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200");

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
    // Use Places API (New) — placeDetails with reviews field
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews,rating,userRatingCount&key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Google Places API error:", response.status, errText);
      return res.status(502).json({ error: "Failed to fetch reviews from Google" });
    }

    const data = await response.json();

    // Normalize reviews to a consistent format for the frontend
    const reviews = (data.reviews || []).map((r) => ({
      author_name: r.authorAttribution?.displayName || "Google User",
      profile_photo_url: r.authorAttribution?.photoUri || "",
      rating: r.rating || 5,
      relative_time_description: r.relativePublishTimeDescription || "",
      text: r.text?.text || "",
    }));

    const result = {
      reviews,
      rating: data.rating || 5,
      totalReviews: data.userRatingCount || 0,
      fetchedAt: new Date().toISOString(),
    };

    // Update cache
    cache = { data: result, timestamp: now };

    return res.status(200).json(result);
  } catch (err) {
    console.error("Reviews API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
