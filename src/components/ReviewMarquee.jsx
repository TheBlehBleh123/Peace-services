import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const C = { navy:"#3d4b65", sage:"#8a9d89", cream:"#f4f1ea", offwhite:"#e6e6e6", white:"#ffffff" };
const fontSans = `"Inter",system-ui,-apple-system,sans-serif`;
const fontDisplay = `"Space Grotesk",sans-serif`;

const FALLBACK_REVIEWS = [
  { author_name: "Samantha Johnson", rating: 5, relative_time_description: "2 weeks ago", text: "Peace cleaned every window in our home and they look absolutely flawless. The team was on time, professional, and left zero streaks. Already booked our next appointment!", profile_photo_url: "" },
  { author_name: "John Peterson", rating: 5, relative_time_description: "1 month ago", text: "Signed up for the Pro Package and it's been the best decision. They handle everything — scheduling, reminders, the actual cleaning. I don't think about it anymore.", profile_photo_url: "" },
  { author_name: "Natalie Martinez", rating: 5, relative_time_description: "3 weeks ago", text: "Our solar panels were producing 30% less before Peace cleaned them. After one visit we saw an immediate jump back to full output. They really know what they're doing.", profile_photo_url: "" },
  { author_name: "Isabella Ruiz", rating: 5, relative_time_description: "2 months ago", text: "From the first phone call to the final walkthrough, the experience was seamless. You can tell Jack and Ben genuinely care about every home they service.", profile_photo_url: "" },
  { author_name: "Michael Torres", rating: 5, relative_time_description: "1 week ago", text: "Best service in the Coachella Valley, hands down. On time, thorough, and the results speak for themselves. Our neighbors keep asking who we use!", profile_photo_url: "" },
  { author_name: "Gabrielle Walker", rating: 5, relative_time_description: "3 months ago", text: "We had bird proofing done on our solar panels and a full window clean in one visit. The crew was friendly and efficient — highly recommend Peace to everyone.", profile_photo_url: "" },
];

export const GoogleG = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const ReviewCard = ({review}) => (
  <div className="review-card" style={{
    flexShrink:0,width:360,padding:28,borderRadius:20,
    background:C.cream,border:`1px solid ${C.navy}12`,
    boxShadow:"0 4px 24px rgba(0,0,0,.05)",
    display:"flex",flexDirection:"column",gap:14,cursor:"default",
  }}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{
          width:40,height:40,borderRadius:"50%",
          background:review.profile_photo_url?`url(${review.profile_photo_url}) center/cover`:`${C.sage}25`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:fontDisplay,fontSize:15,fontWeight:700,color:C.navy,
        }}>{!review.profile_photo_url&&review.author_name[0]}</div>
        <div>
          <div style={{fontFamily:fontDisplay,fontSize:12,fontWeight:700,letterSpacing:".04em",color:C.navy}}>{review.author_name}</div>
          <div style={{fontFamily:fontSans,fontSize:11,color:`${C.navy}88`,marginTop:1}}>{review.relative_time_description}</div>
        </div>
      </div>
      <GoogleG size={20}/>
    </div>
    <div style={{display:"flex",gap:2}}>
      {[...Array(5)].map((_,i)=><Star key={i} size={14} fill={i<review.rating?"#FBBC05":"#ddd"} color={i<review.rating?"#FBBC05":"#ddd"}/>)}
    </div>
    <p style={{fontFamily:fontSans,fontSize:14,fontWeight:500,color:`${C.navy}bb`,lineHeight:1.7,flexGrow:1}}>"{review.text}"</p>
  </div>
);

export const ReviewMarquee = ({reviews,reverse=false}) => (
  <div className="marquee-wrap" style={{overflow:"hidden",padding:"12px 0"}}>
    <div className="marquee-track" style={{display:"flex",gap:20,width:"max-content",animation:`${reverse?"marquee-right":"marquee-left"} 50s linear infinite`}}>
      {[...reviews,...reviews].map((r,i)=><ReviewCard key={i} review={r}/>)}
    </div>
  </div>
);

export const useGoogleReviews = () => {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [rating, setRating] = useState(5);
  const [totalReviews, setTotalReviews] = useState(81);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        if (cancelled) return;
        if (data.reviews?.length) setReviews(data.reviews);
        if (data.rating) setRating(data.rating);
        if (data.totalReviews) setTotalReviews(data.totalReviews);
      })
      .catch(() => { /* keep FALLBACK_REVIEWS */ });
    return () => { cancelled = true; };
  }, []);
  return { reviews, rating, totalReviews };
};

/* ═══ REVIEWS SECTION — reusable across pages ═══ */
export const ReviewsSection = ({ heading = "What Our Customers Say" }) => {
  const { reviews, rating, totalReviews } = useGoogleReviews();
  const halfReviews = Math.ceil(reviews.length / 2);
  const reviewsRow1 = reviews.slice(0, halfReviews);
  const reviewsRow2 = reviews.slice(halfReviews);

  return (
    <section style={{ padding: "80px 0", background: C.cream, overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <GoogleG size={28} />
          <div style={{ display: "flex", gap: 3 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#FBBC05" color="#FBBC05" />)}
          </div>
          <span style={{ fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, color: C.navy, letterSpacing: ".04em" }}>
            {rating} · {totalReviews}+ Reviews
          </span>
        </div>
        <h2 style={{ fontFamily: `"Fraunces","Playfair Display",Georgia,serif`, fontSize: "clamp(28px,4vw,40px)", fontWeight: 400, color: C.navy, letterSpacing: "-.02em" }}>
          {heading}
        </h2>
      </div>
      <ReviewMarquee reviews={reviewsRow1} />
      <ReviewMarquee reviews={reviewsRow2} reverse />
    </section>
  );
};

export default ReviewsSection;
