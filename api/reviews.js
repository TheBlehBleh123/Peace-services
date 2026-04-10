// Vercel Serverless Function — Google Places Reviews Proxy
// Fetches from BOTH the new and legacy Places APIs to maximize unique reviews
// New API → 5 most relevant; Legacy API (newest sort) → 5 newest
// Merged & deduplicated → up to 10 unique real reviews

const PLACE_ID = "ChIJ3wZR2lr92oAR1ch_JMP5GcY";

// In-memory cache (persists across warm invocations on same Vercel instance)
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

// Normalize a review from the NEW Places API format
function normalizeNew(r) {
  return {
    author_name: r.authorAttribution?.displayName || "Google User",
    profile_photo_url: r.authorAttribution?.photoUri || "",
    rating: r.rating || 5,
    relative_time_description: r.relativePublishTimeDescription || "",
    text: r.text?.text || "",
  };
}

// Normalize a review from the LEGACY Places API format
function normalizeLegacy(r) {
  return {
    author_name: r.author_name || "Google User",
    profile_photo_url: r.profile_photo_url || "",
    rating: r.rating || 5,
    relative_time_description: r.relative_time_description || "",
    text: r.text || "",
  };
}

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
    // Fire both API calls in parallel for speed
    const [newApiRes, legacyRelevantRes, legacyNewestRes] = await Promise.allSettled([
      // 1) New Places API — returns 5 most relevant reviews
      fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?key=${apiKey}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "reviews,rating,userRatingCount",
        },
      }),
      // 2) Legacy Places API — most relevant (default sort)
      fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&reviews_sort=most_relevant&key=${apiKey}`),
      // 3) Legacy Places API — newest sort (different set of reviews)
      fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&reviews_sort=newest&key=${apiKey}`),
    ]);

    let allReviews = [];
    let rating = 5;
    let totalReviews = 0;

    // Process New API response
    if (newApiRes.status === "fulfilled" && newApiRes.value.ok) {
      const data = await newApiRes.value.json();
      rating = data.rating || 5;
      totalReviews = data.userRatingCount || 0;
      const reviews = (data.reviews || []).map(normalizeNew);
      allReviews.push(...reviews);
    }

    // Process Legacy API (most relevant) response
    if (legacyRelevantRes.status === "fulfilled" && legacyRelevantRes.value.ok) {
      const data = await legacyRelevantRes.value.json();
      if (data.result?.reviews) {
        const reviews = data.result.reviews.map(normalizeLegacy);
        allReviews.push(...reviews);
      }
      // Use legacy rating/count as fallback
      if (!totalReviews && data.result?.user_ratings_total) {
        totalReviews = data.result.user_ratings_total;
      }
    }

    // Process Legacy API (newest) response
    if (legacyNewestRes.status === "fulfilled" && legacyNewestRes.value.ok) {
      const data = await legacyNewestRes.value.json();
      if (data.result?.reviews) {
        const reviews = data.result.reviews.map(normalizeLegacy);
        allReviews.push(...reviews);
      }
    }

    // Deduplicate by author_name (keep first occurrence)
    const seen = new Set();
    const uniqueReviews = [];
    for (const r of allReviews) {
      const key = r.author_name.toLowerCase().trim();
      if (!seen.has(key) && r.text) {
        seen.add(key);
        uniqueReviews.push(r);
      }
    }

    if (uniqueReviews.length === 0) {
      return res.status(502).json({ error: "No reviews returned from Google" });
    }

    const result = {
      reviews: uniqueReviews,
      rating,
      totalReviews,
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
