import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Check, X, Star, ArrowRight, Sun, Wind, Snowflake,
  ShieldCheck, Users, Heart, Menu, Phone, XIcon,
  ChevronLeft, Zap, Calendar, Info, Sparkles,
} from "lucide-react";
import QuizModal from "./components/QuizModal";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  IMAGE ASSETS — Google Drive (add referrerPolicy="no-referrer") ║
  ║  For production: migrate to Cloudinary or your own CDN       ║
  ╚══════════════════════════════════════════════════════════════╝
*/
const IMG = {
  logo:      "https://lh3.googleusercontent.com/d/1ogIwyqP41cbmi0AhyMkIHTW5DHJqzSIX",
  hero:      "https://lh3.googleusercontent.com/d/17yeef5yaqoLazZcZfvdqGzsLpQVxStM4",
  story:     "https://lh3.googleusercontent.com/d/1PKnhwtemTrD4nSHGmijiNxAkulaZmGUr",
  window:    "https://lh3.googleusercontent.com/d/1vZGU132_9oDTQuiXEoNtdMwf4yJ9g9G9",
  solar:     "https://lh3.googleusercontent.com/d/1bM-4WuGFcO55nJzg--5a-EnGv0mpo57C",
  bird:      "https://lh3.googleusercontent.com/d/1RoYPkmJZIf16iFOvw8eUHRLYXfEJHwla",
  christmas: "https://lh3.googleusercontent.com/d/1wT6WDoT1C1o4mYRmhp8QpNz2Mj3kSHvB",
};

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  GOOGLE REVIEWS — fetched server-side via /api/reviews       ║
  ╚══════════════════════════════════════════════════════════════╝
*/

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  GHL WEBHOOK — paste your Inbound Webhook URL below          ║
  ╚══════════════════════════════════════════════════════════════╝
*/
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/EmqV3yHGqNtAgSD5vZXQ/webhook-trigger/2f29cb6a-7ba0-4132-88e4-53c79c2fd356";

const FALLBACK_REVIEWS = [
  { author_name: "Samantha Johnson", rating: 5, relative_time_description: "2 weeks ago", text: "Peace cleaned every window in our home and they look absolutely flawless. The team was on time, professional, and left zero streaks. Already booked our next appointment!", profile_photo_url: "" },
  { author_name: "John Peterson", rating: 5, relative_time_description: "1 month ago", text: "Signed up for the Pro Package and it's been the best decision. They handle everything — scheduling, reminders, the actual cleaning. I don't think about it anymore.", profile_photo_url: "" },
  { author_name: "Natalie Martinez", rating: 5, relative_time_description: "3 weeks ago", text: "Our solar panels were producing 30% less before Peace cleaned them. After one visit we saw an immediate jump back to full output. They really know what they're doing.", profile_photo_url: "" },
  { author_name: "Isabella Ruiz", rating: 5, relative_time_description: "2 months ago", text: "From the first phone call to the final walkthrough, the experience was seamless. You can tell Jack and Ben genuinely care about every home they service.", profile_photo_url: "" },
  { author_name: "Michael Torres", rating: 5, relative_time_description: "1 week ago", text: "Best service in the Coachella Valley, hands down. On time, thorough, and the results speak for themselves. Our neighbors keep asking who we use!", profile_photo_url: "" },
  { author_name: "Gabrielle Walker", rating: 5, relative_time_description: "3 months ago", text: "We had bird proofing done on our solar panels and a full window clean in one visit. The crew was friendly and efficient — highly recommend Peace to everyone.", profile_photo_url: "" },
];

const C = { navy:"#3d4b65", sage:"#8a9d89", cream:"#f4f1ea", offwhite:"#e6e6e6", white:"#ffffff" };
const fontSerif = `"Fraunces","Playfair Display",Georgia,serif`;
const fontSans = `"Inter",system-ui,-apple-system,sans-serif`;
const fontDisplay = `"Space Grotesk",sans-serif`;

const GoogleG = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ═══ GLOBAL STYLES ═══ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
    body{overflow-x:hidden}
    @keyframes marquee-left{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes marquee-right{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
    @keyframes heroReveal{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scalePulse{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
    @keyframes kenburns{0%{transform:scale(1)}100%{transform:scale(1.06)}}

    .fade-in-up{opacity:0;transform:translateY(36px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
    .fade-in-up.visible{opacity:1;transform:translateY(0)}

    /* Staggered pricing cards — slide up + scale */
    .price-card{opacity:0;transform:translateY(50px) scale(.96);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
    .price-card.visible{opacity:1;transform:translateY(0) scale(1)}

    .hero-anim{animation:heroReveal 1s cubic-bezier(.22,1,.36,1) forwards}
    .hero-anim-d1{animation:heroReveal .6s .2s cubic-bezier(.22,1,.36,1) both}
    .hero-anim-d2{animation:scalePulse .7s .5s cubic-bezier(.22,1,.36,1) both}

    /* Ken Burns slow zoom on service cards */
    .svc-card img{animation:kenburns 20s ease-in-out infinite alternate;transition:transform .8s cubic-bezier(.22,1,.36,1)}
    .svc-card:hover img{transform:scale(1.12)!important;animation-play-state:paused}
    .svc-card{transition:transform .4s cubic-bezier(.22,1,.36,1)}
    .svc-card:hover{transform:translateY(-8px)}

    /* Review card hover lift + marquee pause */
    .review-card{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease}
    .review-card:hover{transform:translateY(-6px);box-shadow:0 12px 36px rgba(0,0,0,.1)!important}
    .marquee-track{display:flex;gap:20;width:max-content}
    .marquee-wrap:hover .marquee-track{animation-play-state:paused!important}

    /* Value prop icon float */
    .val-icon{transition:transform .3s ease}

    @media(min-width:769px){.mob-only{display:none!important}}
    @media(max-width:768px){.desk-only{display:none!important}}
    .hero-h1{font-size:clamp(34px,6.5vw,80px)}
    .hero-sub{font-size:clamp(15px,2vw,20px)}
    .hero-img-wrap{height:75vh}
    .hero-btm-h2{font-size:clamp(24px,4vw,48px)}
    .vals-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:48px}
    .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
    .svc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
    .story-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
    @media(max-width:1024px){.svc-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:768px){
      .sec-hero-text{padding-top:90px!important}
      .nav-logo{height:80px!important}
      .hero-photo{object-position:center 90%!important}
      .hero-img-wrap{height:55vh;border-radius:20px!important}
      .hero-bottom{flex-direction:column!important;align-items:center!important;text-align:center!important;padding:60px 20px 20px!important}
      .stats-row{width:100%;justify-content:center}
      .stat-box{flex:1;padding:14px 16px!important;min-width:auto!important;border-radius:14px!important}
      .stat-num{font-size:26px!important}
      .stat-lbl{font-size:8px!important;letter-spacing:.15em!important}
      .vals-grid{grid-template-columns:1fr;gap:40px}
      .price-grid{grid-template-columns:1fr;gap:20px}
      .svc-grid{grid-template-columns:1fr;gap:16px}
      .story-grid{grid-template-columns:1fr;gap:40px}
      .footer-row{flex-direction:column!important;text-align:center}
      .cta-main{font-size:15px!important;padding:18px 32px!important;letter-spacing:.1em!important}
    }
  `}</style>
);

const Grain = () => (
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:.022,
    backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>
);

/* ═══ HOOKS ═══ */
const useFadeIn = (delay=0, cls="fade-in-up") => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.transitionDelay = `${delay}s`;
    const obs = new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("visible");obs.unobserve(el)}},{threshold:.15});
    obs.observe(el);
    return ()=>obs.disconnect();
  }, [delay]);
  return ref;
};

const FadeIn = ({children,delay=0})=>{const ref=useFadeIn(delay);return<div ref={ref} className="fade-in-up">{children}</div>};

/* ★ ANIMATION 1: Counter hook — counts from 0 to target when scrolled into view */
const useCountUp = (target, duration = 5000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: .3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { ref, count };
};

/* ★ ANIMATION 3: Value prop icon parallax */
const useIconParallax = () => {
  const ref = useRef(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * 0.08;
      setY(-offset);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return { ref, y };
};

const useParallax = () => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const h = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height + window.innerHeight)));
      setOffset(progress * 200);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return { ref, offset };
};

const useGoogleReviews = () => {
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

/* ═══ STAT COUNTER COMPONENT ═══ */
const AnimatedStat = ({ target, suffix = "+", label }) => {
  const { ref, count } = useCountUp(target);
  return (
    <div ref={ref} className="stat-box" style={{
      background:"rgba(0,0,0,.60)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
      border:"2px solid rgba(255,255,255,.45)",borderRadius:18,padding:"20px 28px",
      textAlign:"center",minWidth:180,boxShadow:"0 8px 32px rgba(0,0,0,.3)",
    }}>
      <div className="stat-num" style={{fontFamily:fontSerif,fontSize:38,fontWeight:700,color:"#fff",textShadow:"0 2px 12px rgba(0,0,0,1)",lineHeight:1.1}}>
        {count}{suffix}
      </div>
      <div className="stat-lbl" style={{fontFamily:fontDisplay,fontSize:10,textTransform:"uppercase",letterSpacing:".22em",fontWeight:800,color:"#fff",marginTop:4}}>{label}</div>
    </div>
  );
};

/* ═══ VALUE PROP WITH ICON PARALLAX ═══ */
const ValueProp = ({ icon, title, desc, delay }) => {
  const { ref: iconRef, y } = useIconParallax();
  const fadeRef = useFadeIn(delay);
  return (
    <div ref={fadeRef} className="fade-in-up">
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
        <div ref={iconRef} className="val-icon" style={{
          width:72,height:72,borderRadius:"50%",background:`${C.sage}15`,
          display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,
          transform:`translateY(${y}px)`,transition:"transform .1s linear",
        }}>{icon}</div>
        <h3 style={{fontFamily:fontSerif,fontSize:26,fontWeight:400,marginBottom:14,letterSpacing:"-.01em"}}>{title}</h3>
        <p style={{fontFamily:fontSans,fontSize:15,fontWeight:500,color:`${C.navy}aa`,lineHeight:1.8,maxWidth:320}}>{desc}</p>
      </div>
    </div>
  );
};

/* ═══ NAVBAR — smooth scroll-linked opacity ═══ */
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const h = () => {
      const p = Math.min(1, window.scrollY / 120); // fully opaque by 120px
      setScrollProgress(p);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrolled = scrollProgress > 0.1;
  const lnk = {fontFamily:fontDisplay,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:C.navy,textDecoration:"none",transition:"color .3s"};

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:50,
      transition:"border-bottom .4s",
      background:`rgba(244,241,234,${scrollProgress * 0.93})`,
      backdropFilter:`blur(${scrollProgress * 20}px)`,
      WebkitBackdropFilter:`blur(${scrollProgress * 20}px)`,
      borderBottom:scrolled?`1px solid ${C.navy}11`:"1px solid transparent",
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:1400,margin:"0 auto",padding:"0 20px 0 4px"}}>
        <a href="#" style={{lineHeight:0,marginLeft:0}}>
          <img src={IMG.logo} alt="Peace Solar & Window Cleaning" referrerPolicy="no-referrer" className="nav-logo"
            style={{height:80 - scrollProgress * 20,width:"auto",transition:"height .15s linear",display:"block"}}/>
        </a>
        <div className="desk-only" style={{display:"flex",alignItems:"center",gap:36}}>
          {[["services","Services"],["plans","Plans"],["story","Our Story"]].map(([id,label])=>(
            <a key={id} href={`#${id}`} style={lnk} onMouseEnter={e=>e.target.style.color=C.sage} onMouseLeave={e=>e.target.style.color=C.navy}>{label}</a>
          ))}
          <a href="tel:7602995187" style={{
            display:"inline-flex",alignItems:"center",gap:8,background:C.navy,color:C.cream,padding:"10px 22px",borderRadius:999,
            fontFamily:fontDisplay,fontSize:11,letterSpacing:".15em",textTransform:"uppercase",textDecoration:"none",transition:"all .3s",
          }} onMouseEnter={e=>{e.currentTarget.style.background=C.sage;e.currentTarget.style.color=C.navy}}
             onMouseLeave={e=>{e.currentTarget.style.background=C.navy;e.currentTarget.style.color=C.cream}}>
            <Phone size={13}/> Call Now
          </a>
        </div>
        <button className="mob-only" onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",color:C.navy,padding:8,display:"flex"}}>
          {open?<XIcon size={24}/>:<Menu size={24}/>}
        </button>
      </div>
      {open&&(
        <div className="mob-only" style={{background:C.cream,borderBottom:`1px solid ${C.navy}15`,padding:"24px 28px",display:"flex",flexDirection:"column",gap:20}}>
          {[["#services","Services"],["#plans","Plans"],["#story","Our Story"]].map(([h,l])=>(
            <a key={l} href={h} onClick={()=>setOpen(false)} style={{fontFamily:fontDisplay,fontSize:13,letterSpacing:".12em",textTransform:"uppercase",color:C.navy,textDecoration:"none"}}>{l}</a>
          ))}
          <a href="tel:7602995187" onClick={()=>setOpen(false)} style={{fontFamily:fontDisplay,fontSize:13,fontWeight:700,color:C.sage,textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
            <Phone size={14}/> Call Now
          </a>
        </div>
      )}
    </nav>
  );
};

/* ═══ REVIEW CARD — with hover lift ═══ */
const ReviewCard = ({review}) => (
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

/* ═══ REVIEW MARQUEE — pauses on hover ═══ */
const ReviewMarquee = ({reviews,reverse=false,speed=25}) => (
  <div className="marquee-wrap" style={{overflow:"hidden",padding:"12px 0"}}>
    <div className="marquee-track" style={{display:"flex",gap:20,width:"max-content",animation:`${reverse?"marquee-right":"marquee-left"} ${speed}s linear infinite`}}>
      {[...reviews,...reviews].map((r,i)=><ReviewCard key={i} review={r}/>)}
    </div>
  </div>
);

/* ═══ SERVICE CARD — Ken Burns continuous zoom ═══ */
const SERVICE_SLUGS = { "Window Cleaning": "window-cleaning", "Solar Cleaning": "solar-panel-cleaning", "Bird Proofing": "bird-proofing", "Holiday Lighting": "holiday-lighting" };
const ServiceCard = ({service,index}) => {
  const ref = useFadeIn(index*.12);
  const slug = SERVICE_SLUGS[service.title] || "";
  return (
    <Link to={`/services/${slug}`} ref={ref} className="fade-in-up svc-card" style={{position:"relative",height:420,borderRadius:24,overflow:"hidden",cursor:"pointer",textDecoration:"none",display:"block"}}>
      <img src={service.img} alt={`${service.title} services in Coachella Valley`} referrerPolicy="no-referrer" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(61,75,101,.85) 0%, transparent 55%)"}}/>
      <div style={{position:"absolute",bottom:28,left:28,color:C.cream}}>
        <div style={{opacity:.7,marginBottom:8}}>{service.icon}</div>
        <h4 style={{fontFamily:fontSerif,fontSize:22,fontWeight:400}}>{service.title}</h4>
      </div>
    </Link>
  );
};

/* ═══ PRICING CARD — staggered reveal ═══ */
const PricingCard = ({plan,index}) => {
  const ref = useFadeIn(index * 0.18, "price-card");
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    el.style.transitionDelay=`${index*0.18}s`;
    const obs = new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("visible");obs.unobserve(el)}},{threshold:.15});
    obs.observe(el);
    return()=>obs.disconnect();
  },[index]);

  return (
    <div ref={ref} className="price-card" style={{
      background:C.cream,color:C.navy,borderRadius:28,padding:36,position:"relative",
      border:plan.hl?`5px solid ${plan.borderColor}`:`2px solid ${plan.borderColor}`,
      display:"flex",flexDirection:"column",height:"100%",
      boxShadow:plan.hl?`0 16px 48px rgba(138,157,137,.35)`:"0 8px 32px rgba(0,0,0,.15)",
    }}>
      {plan.hl&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:C.sage,color:C.navy,fontFamily:fontDisplay,fontSize:10,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",padding:"6px 20px",borderRadius:999,whiteSpace:"nowrap"}}>Most Popular</div>}
      <h3 style={{fontFamily:fontSerif,fontSize:24,fontWeight:400,marginBottom:32,color:C.navy}}>{plan.name}</h3>
      <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:18,flexGrow:1}}>
        {plan.features.map(f=>(
          <li key={f.t} style={{display:"flex",alignItems:"center",gap:14,opacity:f.on?1:.4,fontFamily:fontSans,fontSize:15,color:C.navy}}>
            {f.on?<Check size={16} color={C.sage}/>:<X size={16} color="#c97070"/>}{f.t}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function App() {
  const { reviews, rating, totalReviews } = useGoogleReviews();
  const [heroDrift, setHeroDrift] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const h = () => {
      const drift = Math.min(window.scrollY * 0.12, 50); // moves at 12% scroll speed, caps at 50px
      setHeroDrift(drift);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const services = [
    {title:"Window Cleaning",icon:<Wind size={22}/>,img:IMG.window},
    {title:"Solar Cleaning",icon:<Sun size={22}/>,img:IMG.solar},
    {title:"Bird Proofing",icon:<ShieldCheck size={22}/>,img:IMG.bird},
    {title:"Holiday Lighting",icon:<Snowflake size={22}/>,img:IMG.christmas},
  ];
  const plans = [
    {name:"One-Time Cleaning",features:[{t:"Full Price",on:false},{t:"Auto-Scheduled",on:false},{t:"Unlimited Rain-Insurance",on:false}],hl:false,borderColor:"#000000"},
    {name:"Bi-Annual Basic Package",features:[{t:"10% OFF Each Clean",on:true},{t:"Scheduled 2x a year",on:true},{t:"Unlimited Rain-Insurance",on:false}],hl:false,borderColor:"#000000"},
    {name:"Quarterly Pro Package",features:[{t:"20% OFF Each Clean",on:true},{t:"Scheduled 4x a year",on:true},{t:"Unlimited Rain-Insurance",on:true}],hl:true,borderColor:C.sage},
  ];

  // Single-row marquee — all reviews together to avoid visible repetition
  const reviewsRow1 = reviews;
  const reviewsRow2 = [...reviews].reverse();

  return (
    <div style={{minHeight:"100vh",overflowX:"hidden",background:C.cream,color:C.navy,fontFamily:fontSans}}>
      <GlobalStyles/><Grain/><Navbar/>

      {/* ═══ 1 · HERO TEXT ═══ */}
      <section className="sec-hero-text" style={{paddingTop:110,paddingBottom:8,textAlign:"center",position:"relative",zIndex:2}}>
        <div className="hero-anim" style={{maxWidth:920,margin:"0 auto",padding:"0 24px"}}>
          <span className="hero-anim-d1" style={{fontFamily:fontDisplay,fontWeight:700,letterSpacing:".25em",textTransform:"uppercase",fontSize:14,color:C.sage,display:"block",marginBottom:20}}>
            The Valley's #1 Solar &amp; Window Cleaner
          </span>
          <h1 className="hero-h1" style={{fontFamily:fontSerif,fontWeight:300,lineHeight:1.0,letterSpacing:"-.02em",marginBottom:28}}>
            Coachella Valley Homeowners — <span style={{fontStyle:"italic",color:C.sage,fontWeight:600}}>Never</span> worry about cleanings again
          </h1>
          <p className="hero-sub" style={{fontFamily:fontSans,fontWeight:500,color:`${C.navy}bb`,maxWidth:620,margin:"0 auto",lineHeight:1.8,marginBottom:40}}>
            We believe Exterior Cleanings should bring you peace of mind. We bring a new standard of service that's as reliable as the Desert Sun.
          </p>
        </div>
        <div className="hero-anim-d2" style={{display:"flex",justifyContent:"center",padding:"0 24px",marginBottom:32}}>
          <button onClick={()=>setQuizOpen(true)} className="cta-main" style={{
            display:"inline-flex",alignItems:"center",justifyContent:"center",gap:16,
            width:"100%",maxWidth:680,background:C.sage,color:C.navy,
            padding:"22px 48px",borderRadius:999,
            fontFamily:fontDisplay,fontWeight:700,fontSize:18,
            letterSpacing:".12em",textTransform:"uppercase",
            border:`2px solid ${C.sage}40`,boxShadow:`0 20px 50px ${C.sage}55`,
            transition:"all .4s cubic-bezier(.22,1,.36,1)",cursor:"pointer",
          }}
            onMouseEnter={e=>{e.currentTarget.style.background=C.cream;e.currentTarget.style.boxShadow=`0 30px 70px ${C.sage}66`;e.currentTarget.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.sage;e.currentTarget.style.boxShadow=`0 20px 50px ${C.sage}55`;e.currentTarget.style.transform="translateY(0)"}}>
            Get a Quick and Easy Quote <ArrowRight size={22}/>
          </button>
        </div>
      </section>

      {/* ═══ 2 · HERO IMAGE — STICKY, content scrolls over it ═══ */}
      <div style={{position:"relative",zIndex:1}}>
        <div className="hero-img-wrap" style={{
          position:"sticky",top:0,zIndex:1,
          width:"100%",overflow:"hidden",
          borderRadius:0,
        }}>
          <img src={IMG.hero} alt="Professional solar panel and window cleaning team in Coachella Valley, California" referrerPolicy="no-referrer" className="hero-photo"
            style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 85%",display:"block",
              transform:`translateY(${heroDrift}px) scale(${1 + heroDrift * 0.001})`,transition:"transform .1s linear"}}/>
          
          {/* Desktop overlay — hidden on mobile */}
          <div className="hero-bottom desk-only" style={{
            position:"absolute",bottom:0,left:0,right:0,padding:"80px 32px 32px",
            background:"linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.55) 40%, rgba(0,0,0,.15) 70%, transparent 100%)",
            display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,
          }}>
            <div style={{maxWidth:500,background:"rgba(0,0,0,.3)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",borderRadius:16,padding:"20px 24px"}}>
              <h2 className="hero-btm-h2" style={{
                fontFamily:fontSerif,fontWeight:400,color:"#fff",marginBottom:8,
                letterSpacing:"-.02em",
              }}>Join the Peace Family</h2>
              <p style={{fontFamily:fontSans,fontSize:16,color:"#fff",opacity:.95,lineHeight:1.6,fontWeight:500}}>
                Over 400 families in the Coachella Valley trust PEACE for their window and solar cleaning needs.
              </p>
            </div>
            <div className="stats-row" style={{display:"flex",gap:14}}>
              <AnimatedStat target={400} suffix="+" label="Families Served"/>
              <AnimatedStat target={100} suffix="+" label="5-Star Reviews"/>
            </div>
          </div>

          {/* Mobile: light gradient just for a soft bottom edge */}
          <div className="mob-only" style={{
            position:"absolute",bottom:0,left:0,right:0,height:80,
            background:"linear-gradient(to top, rgba(0,0,0,.25) 0%, transparent 100%)",
          }}/>
        </div>

        {/* Mobile content below the image — hidden on desktop */}
        <div className="mob-only" style={{
          background:C.sage,padding:"28px 24px",textAlign:"center",
          display:"flex",flexDirection:"column",alignItems:"center",gap:16,
        }}>
          <h2 style={{fontFamily:fontSerif,fontWeight:400,color:C.navy,fontSize:28,letterSpacing:"-.02em"}}>
            Join the Peace Family
          </h2>
          <p style={{fontFamily:fontSans,fontSize:16,color:C.navy,fontWeight:500,opacity:.9,lineHeight:1.6,maxWidth:400}}>
            Over 400 families in the Coachella Valley trust PEACE for their window and solar cleaning needs.
          </p>
          <div style={{display:"flex",gap:14,marginTop:8,width:"100%",justifyContent:"center"}}>
            <AnimatedStat target={400} suffix="+" label="Families Served"/>
            <AnimatedStat target={100} suffix="+" label="5-Star Reviews"/>
          </div>
        </div>

        {/* ═══ CONTENT THAT SCROLLS OVER THE HERO ═══ */}
        <div style={{position:"relative",zIndex:2}}>

          {/* ═══ 3 · VALUES — icon parallax ═══ */}
          <section style={{padding:"80px 24px",background:C.offwhite,borderRadius:"28px 28px 0 0",marginTop:-20}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <div className="vals-grid">
                {[
                  {t:"Trustworthy",d:"We are stable and honest, and this is our foundation. No hidden fees, just clear results.",icon:<ShieldCheck color={C.sage} size={34}/>},
                  {t:"Ambitious",d:"We are developing, and you will notice it every time you contact us. Constantly improving our craft.",icon:<Users color={C.sage} size={34}/>},
                  {t:"Attentive",d:"Our standard is to always keep excellent quality. We sweat the small stuff so you don't have to.",icon:<Heart color={C.sage} size={34}/>},
                ].map((v,i)=>(
                  <ValueProp key={i} icon={v.icon} title={v.t} desc={v.d} delay={i*.15}/>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ 4 · PACKAGES — staggered card reveals ═══ */}
          <section id="plans" style={{padding:"100px 24px",background:C.navy,color:C.cream}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <FadeIn>
                <div style={{textAlign:"center",marginBottom:64}}>
                  <h2 style={{fontFamily:fontSerif,fontSize:"clamp(32px,5vw,52px)",fontWeight:400,marginBottom:16,letterSpacing:"-.02em"}}>Save BIG with Packages</h2>
                  <p style={{fontFamily:fontSans,opacity:.85,fontSize:18,fontWeight:500}}>Never worry about keeping up on cleanings again.</p>
                </div>
              </FadeIn>
              <div className="price-grid" style={{marginBottom:56}}>
                {plans.map((plan,i)=><PricingCard key={i} plan={plan} index={i}/>)}
              </div>
              <div style={{textAlign:"center"}}>
                <button onClick={()=>setQuizOpen(true)} style={{
                  display:"inline-flex",alignItems:"center",justifyContent:"center",gap:16,
                  width:"100%",maxWidth:640,padding:"28px 48px",borderRadius:999,
                  background:C.sage,color:C.navy,fontFamily:fontDisplay,fontSize:20,fontWeight:700,
                  letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",
                  boxShadow:`0 30px 60px ${C.sage}44`,borderBottom:`4px solid ${C.navy}15`,border:"none",transition:"all .4s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.cream;e.currentTarget.style.transform="translateY(-2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.sage;e.currentTarget.style.transform="translateY(0)"}}>
                  Get a Quick and Easy Quote <ArrowRight size={24}/>
                </button>
              </div>
            </div>
          </section>

          {/* ═══ 5 · SERVICES — Ken Burns zoom ═══ */}
          <section id="services" style={{padding:"100px 24px",background:C.cream}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <FadeIn>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:56,flexWrap:"wrap",gap:24}}>
                  <div style={{maxWidth:520}}>
                    <h2 style={{fontFamily:fontSerif,fontSize:"clamp(32px,5vw,52px)",fontWeight:400,marginBottom:16,letterSpacing:"-.02em"}}>Our Services</h2>
                    <p style={{fontFamily:fontSans,color:`${C.navy}aa`,fontSize:16,fontWeight:500,lineHeight:1.7}}>From the desert sun to the winter lights, we keep your home shining year-round.</p>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    {["Residential","Commercial"].map(tag=>(
                      <span key={tag} style={{padding:"6px 18px",borderRadius:999,border:`1px solid ${C.navy}18`,fontFamily:fontDisplay,fontSize:11,letterSpacing:".15em",textTransform:"uppercase"}}>{tag}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <div className="svc-grid">
                {services.map((s,i)=><ServiceCard key={i} service={s} index={i}/>)}
              </div>
            </div>
          </section>

          {/* ═══ 6 · GOOGLE REVIEWS — hover lift + marquee pause ═══ */}
          <section style={{padding:"80px 0",overflow:"hidden",background:C.cream}}>
            <FadeIn>
              <div style={{textAlign:"center",marginBottom:48,padding:"0 24px"}}>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginBottom:16}}>
                  <GoogleG size={28}/>
                  <h2 style={{fontFamily:fontSerif,fontSize:"clamp(28px,4vw,44px)",fontWeight:400,letterSpacing:"-.02em",margin:0}}>Google Reviews</h2>
                </div>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10}}>
                  <div style={{display:"flex",gap:2}}>{[...Array(5)].map((_,i)=><Star key={i} size={16} fill="#FBBC05" color="#FBBC05"/>)}</div>
                  <span style={{fontFamily:fontDisplay,fontSize:13,fontWeight:700}}>5.0 — Rated by 100+ families</span>
                </div>
                <p style={{fontFamily:fontSans,fontSize:15,fontWeight:500,color:`${C.navy}99`,marginTop:8}}>Real reviews from real homeowners across the Coachella Valley</p>
              </div>
            </FadeIn>
            <ReviewMarquee reviews={reviewsRow1}/>
            <ReviewMarquee reviews={reviewsRow2} reverse/>
          </section>

          {/* ═══ 7 · OUR STORY ═══ */}
          <section id="story" style={{padding:"100px 24px",background:C.offwhite}}>
            <div className="story-grid" style={{maxWidth:1200,margin:"0 auto"}}>
              <FadeIn>
                <div style={{borderRadius:28,overflow:"hidden",aspectRatio:"4/5"}}>
                  <img src={IMG.story} alt="Peace Solar & Window Cleaning founders Jack and Ben in the Coachella Valley" referrerPolicy="no-referrer" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              </FadeIn>
              <FadeIn delay={.2}>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <h2 style={{fontFamily:fontSerif,fontSize:"clamp(32px,5vw,52px)",fontWeight:400,marginBottom:32,letterSpacing:"-.02em"}}>Our Story</h2>
                  <p style={{fontFamily:fontSans,fontSize:18,color:`${C.navy}aa`,lineHeight:1.9,marginBottom:24,fontWeight:500}}>
                    Fueled by a lifelong friendship, Founders Jack and Ben started Peace after seeing homeowners trapped in solar contracts that required cleanings without providing a solution.
                  </p>
                  <p style={{fontFamily:fontSans,fontSize:18,color:`${C.navy}aa`,lineHeight:1.9,fontWeight:500}}>
                    Today, we go beyond just solar. Our mission is to reinvent your home and remove the stress of upkeep through a NEW standard of service that is as reliable as the Desert Sun.
                  </p>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══ FOOTER ═══ */}
          <footer style={{padding:"64px 24px 48px",borderTop:`1px solid ${C.navy}12`,background:C.cream}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:40,marginBottom:48}}>
                <div>
                  <h4 style={{fontFamily:fontDisplay,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",marginBottom:16,fontWeight:700}}>Services</h4>
                  {[["window-cleaning","Window Cleaning"],["solar-panel-cleaning","Solar Panel Cleaning"],["bird-proofing","Bird Proofing"],["holiday-lighting","Holiday Lighting"]].map(([slug,name])=>(
                    <Link key={slug} to={`/services/${slug}`} style={{display:"block",fontFamily:fontSans,fontSize:14,color:`${C.navy}88`,textDecoration:"none",marginBottom:10,fontWeight:500}}>{name}</Link>
                  ))}
                </div>
                <div>
                  <h4 style={{fontFamily:fontDisplay,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",marginBottom:16,fontWeight:700}}>Areas We Serve</h4>
                  {[["palm-desert","Palm Desert"],["la-quinta","La Quinta"],["indio","Indio"],["rancho-mirage","Rancho Mirage"],["cathedral-city","Cathedral City"],["coachella","Coachella"],["indian-wells","Indian Wells"],["bermuda-dunes","Bermuda Dunes"]].map(([slug,name])=>(
                    <Link key={slug} to={`/areas/${slug}`} style={{display:"block",fontFamily:fontSans,fontSize:14,color:`${C.navy}88`,textDecoration:"none",marginBottom:10,fontWeight:500}}>{name}</Link>
                  ))}
                </div>
                <div>
                  <h4 style={{fontFamily:fontDisplay,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",marginBottom:16,fontWeight:700}}>Company</h4>
                  <a href="#story" style={{display:"block",fontFamily:fontSans,fontSize:14,color:`${C.navy}88`,textDecoration:"none",marginBottom:10,fontWeight:500}}>About Us</a>
                  <a href="#plans" style={{display:"block",fontFamily:fontSans,fontSize:14,color:`${C.navy}88`,textDecoration:"none",marginBottom:10,fontWeight:500}}>Pricing</a>
                </div>
                <div>
                  <h4 style={{fontFamily:fontDisplay,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",marginBottom:16,fontWeight:700}}>Contact</h4>
                  <a href="tel:7602995187" style={{display:"flex",alignItems:"center",gap:8,fontFamily:fontSans,fontSize:14,color:C.navy,textDecoration:"none",marginBottom:10,fontWeight:600}}>
                    <Phone size={14}/> (760) 299-5187
                  </a>
                  <p style={{fontFamily:fontSans,fontSize:14,color:`${C.navy}88`,fontWeight:500,lineHeight:1.6}}>Serving the entire Coachella Valley, CA</p>
                </div>
              </div>
              <div style={{borderTop:`1px solid ${C.navy}10`,paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
                <a href="#" style={{lineHeight:0}}><img src={IMG.logo} alt="Peace Logo" referrerPolicy="no-referrer" style={{height:50,width:"auto"}}/></a>
                <span style={{fontFamily:fontDisplay,fontSize:10,letterSpacing:".2em",textTransform:"uppercase",opacity:.35}}>© 2026 Peace Solar & Window Cleaning. Coachella Valley, CA.</span>
                <div style={{display:"flex",gap:28}}>
                  {["Instagram","Facebook"].map(s=>(
                    <a key={s} href="#" style={{fontFamily:fontDisplay,fontSize:12,fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",color:C.navy,textDecoration:"none",transition:"color .3s"}}
                      onMouseEnter={e=>e.target.style.color=C.sage} onMouseLeave={e=>e.target.style.color=C.navy}>{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </footer>

        </div>{/* end scrolling content */}
      </div>{/* end sticky hero wrapper */}

      {/* Quiz Modal */}
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
    </div>
  );
}