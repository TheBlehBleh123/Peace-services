// src/pages/GiveawayPage.jsx
//
// Peace holiday "home transformation" giveaway — conversion landing page.
// Brand: navy #3d4b65, sage #8a9d89, cream #f4f1ea; Fraunces / Inter / Space Grotesk.
// Holiday-light border on top/left/right (NO bottom), rendered as repeating
// radial-gradient dots so it scales perfectly at any width (mobile-safe).
// "What you win" is a Hormozi value stack: MAIN PRIZE (framed in lights) + two BONUSES.
// Bare layout — main.jsx renders /holiday-giveaway without the site nav.

import React, { useEffect, useRef, useState } from 'react';

// ── OWNER CONFIG ─────────────────────────────────────────────────────────────
const VSL_EMBED_URL = 'https://www.youtube.com/embed/J0uU0FbZPAc?rel=0&modestbranding=1&playsinline=1';
const TERMS_URL = '/holiday-giveaway-official-rules.pdf';
const ENTRIES_CLOSE = new Date('2026-10-06T06:59:00Z'); // Oct 5, 2026 11:59 PM PT
const LS_REF = 'peace_giveaway_ref';
const LS_EMAIL = 'peace_giveaway_email';
const LS_VERIFIED = 'peace_giveaway_verified'; // remembers a confirmed email on this device
const PRIZE_VALUE = '$3,000';
// Social — single source of truth (used by the share button + the follow line).
const IG_URL = 'https://www.instagram.com/peaceservices/';
const FB_URL = 'https://www.facebook.com/p/Peace-Solar-Window-Cleaning-61577626017665/';
// ─────────────────────────────────────────────────────────────────────────────

function captureReferralCode() {
  if (typeof window === 'undefined') return '';
  let code = '';
  try {
    const url = new URL(window.location.href);
    code =
      url.searchParams.get('ref') ||
      url.searchParams.get('referral_code') ||
      url.searchParams.get('referrer') ||
      url.searchParams.get('uvref') ||
      url.searchParams.get('rc') ||
      '';
    if (!code) {
      const m = window.location.pathname.match(/\/ref\/([^/?#]+)/i);
      if (m) code = m[1];
    }
  } catch { /* ignore malformed URLs */ }
  code = (code || '').trim();
  if (code) {
    try { localStorage.setItem(LS_REF, code); } catch { /* ignore */ }
    return code;
  }
  try { return localStorage.getItem(LS_REF) || ''; } catch { return ''; }
}

async function fetchStatus(email) {
  const r = await fetch(`/api/giveaway-status?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.ok) throw new Error(data.error || 'Could not load your entries.');
  return data;
}

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const s = Math.floor(diff / 1000);
  return {
    closed: diff <= 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { if (el) el.classList.add('in'); return undefined; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); obs.unobserve(el); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, className = '' }) {
  const ref = useReveal();
  return <div ref={ref} className={`pg-reveal ${className}`}>{children}</div>;
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,600;1,9..144,700&family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=Archivo+Black&display=swap');

.pg-root {
  --navy:#3d4b65; --navy-deep:#333f56; --sage:#8a9d89; --sage-ink:#59705b;
  --cream:#f4f1ea; --offwhite:#e6e6e6; --white:#fff;
  --serif:"Fraunces","Playfair Display",Georgia,serif;
  --sans:"Inter",system-ui,-apple-system,sans-serif;
  --disp:"Space Grotesk",sans-serif;
  font-family:var(--sans); color:var(--navy); background:var(--cream);
  line-height:1.55; min-height:100vh; overflow-x:clip; -webkit-font-smoothing:antialiased;
}
.pg-root *,.pg-root *::before,.pg-root *::after{box-sizing:border-box;}
.pg-wrap{max-width:940px;margin:0 auto;padding:0 34px;}
.pg-narrow{max-width:540px;margin:0 auto;}
.pg-reveal{opacity:0;transform:translateY(24px);transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1);}
.pg-reveal.in{opacity:1;transform:none;}

/* ── HOLIDAY-LIGHT BORDER (top + left + right only; gradient dots = mobile-safe) ── */
.pg-lights{position:fixed;inset:0;pointer-events:none;z-index:120;}
.pg-lights .edge{position:absolute;filter:drop-shadow(0 0 4px rgba(255,214,140,.55));animation:pg-tw 2.6s ease-in-out infinite;}
.pg-lights .edge.top{top:0;left:0;right:0;height:18px;
  background:
    radial-gradient(circle 7px at 15px 9px,#e5484d 90%,transparent 91%),
    radial-gradient(circle 7px at 45px 9px,#3fae5a 90%,transparent 91%),
    radial-gradient(circle 7px at 75px 9px,#4a86e8 90%,transparent 91%),
    radial-gradient(circle 7px at 105px 9px,#f0b429 90%,transparent 91%),
    radial-gradient(circle 7px at 135px 9px,#f4ecd6 90%,transparent 91%);
  background-repeat:repeat-x;background-size:150px 18px;}
.pg-lights .edge.left,.pg-lights .edge.right{top:0;bottom:0;width:13px;
  background:
    radial-gradient(circle 5px at 6px 15px,#e5484d 90%,transparent 91%),
    radial-gradient(circle 5px at 6px 45px,#3fae5a 90%,transparent 91%),
    radial-gradient(circle 5px at 6px 75px,#4a86e8 90%,transparent 91%),
    radial-gradient(circle 5px at 6px 105px,#f0b429 90%,transparent 91%),
    radial-gradient(circle 5px at 6px 135px,#f4ecd6 90%,transparent 91%);
  background-repeat:repeat-y;background-size:13px 150px;}
.pg-lights .edge.left{left:0;} .pg-lights .edge.right{right:0;animation-delay:1.3s;}
.pg-lights .edge.top{animation-delay:.6s;}
@keyframes pg-tw{0%,100%{opacity:1;}50%{opacity:.72;}}
@media (prefers-reduced-motion: reduce){.pg-lights .edge{animation:none;}}

/* ── COUNTDOWN STRIP ─────────────────────────────────────────────────── */
.pg-strip{position:fixed;top:0;left:0;right:0;z-index:60;background:var(--navy);color:var(--cream);
  padding:8px 20px 10px;text-align:center;border-bottom:1px solid rgba(255,255,255,.08);}
.pg-strip .lbl{display:block;font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:var(--sage);margin-bottom:5px;}
.pg-timer{display:flex;align-items:stretch;justify-content:space-between;gap:10px;max-width:680px;margin:0 auto;}
.pg-t-unit{flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--cream);border-radius:11px;padding:6px 4px 5px;box-shadow:0 6px 16px rgba(0,0,0,.22);}
.pg-t-num{font-family:'Archivo Black',var(--disp);font-weight:400;font-size:clamp(23px,5.4vw,33px);line-height:1;color:var(--navy);font-variant-numeric:tabular-nums;letter-spacing:.01em;}
.pg-t-lbl{font-family:var(--disp);font-weight:700;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--navy);opacity:.55;margin-top:3px;}
.pg-strip .closed-txt{font-family:var(--serif);font-weight:700;font-size:22px;color:#fff;}

/* ── HERO ────────────────────────────────────────────────────────────── */
.pg-hero{min-height:100vh;min-height:calc(100dvh - 72px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px 0 12px;}
.pg-eyebrow{font-family:var(--disp);font-weight:700;letter-spacing:.22em;text-transform:uppercase;font-size:12.5px;color:var(--sage-ink);}
.pg-h1{font-family:var(--serif);font-weight:700;letter-spacing:-.015em;line-height:.98;font-size:clamp(34px,6vw,64px);margin:12px auto 0;max-width:15ch;color:var(--sage);}
.pg-h1 em{font-style:normal;text-transform:uppercase;color:#cf3a30;font-weight:700;letter-spacing:.005em;}
.pg-value-line{font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.14em;font-size:clamp(15px,2.6vw,21px);color:var(--navy);margin-top:14px;}
.pg-value-line b{color:#cf3a30;font-size:1.35em;}
.pg-hsub{font-family:var(--sans);font-weight:600;color:rgba(61,75,101,.68);font-size:clamp(12.5px,1.7vw,14.5px);margin:11px auto 0;white-space:nowrap;}
.pg-vsl{position:relative;width:100%;max-width:380px;aspect-ratio:9/16;max-height:78vh;margin:18px auto 0;background:var(--navy-deep);border-radius:18px;overflow:hidden;box-shadow:0 26px 60px rgba(61,75,101,.3);border:1px solid rgba(61,75,101,.12);}
.pg-vsl iframe{position:absolute;inset:0;width:100%;height:100%;border:0;}
.pg-vsl-ph{position:absolute;inset:0;display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center;color:rgba(244,241,234,.82);text-align:center;padding:18px;}
.pg-play{width:70px;height:70px;border-radius:50%;background:var(--sage);color:var(--navy);display:grid;place-items:center;font-size:24px;box-shadow:0 12px 28px rgba(138,157,137,.5);}
.pg-vsl-ph .cap{font-family:var(--disp);text-transform:uppercase;letter-spacing:.14em;font-size:10.5px;}
.pg-vsl-unmute{position:absolute;inset:0;z-index:2;display:flex;align-items:flex-end;justify-content:center;padding-bottom:20px;background:transparent;border:0;cursor:pointer;}
.pg-vsl-unmute span{display:inline-flex;align-items:center;gap:8px;background:rgba(20,26,38,.8);color:#fff;font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:12.5px;padding:11px 20px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.4);animation:pg-pulse 1.8s ease-in-out infinite;}
@keyframes pg-pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
.pg-scroll{margin:20px auto 0;display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;width:100%;}
.pg-scroll .t{font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.2em;font-size:13.5px;color:var(--navy);}
.pg-scroll svg{color:var(--sage);animation:pg-bob 1.4s ease-in-out infinite;}
.pg-arrows{display:flex;flex-direction:column;align-items:center;}
.pg-arrows svg{color:var(--sage);animation:pg-bob 1.4s ease-in-out infinite;margin-top:-9px;}
.pg-arrows svg:nth-child(2){animation-delay:.16s;} .pg-arrows svg:nth-child(3){animation-delay:.32s;}
@keyframes pg-bob{0%,100%{transform:translateY(0);opacity:.5;}50%{transform:translateY(7px);opacity:1;}}

/* ── SECTIONS ────────────────────────────────────────────────────────── */
.pg-sec{padding:44px 0;}
.pg-sec-off{background:var(--offwhite);}
.pg-sec-title{font-family:var(--serif);font-weight:700;letter-spacing:-.02em;font-size:clamp(27px,4.2vw,44px);text-align:center;margin:0 0 6px;}
.pg-sec-title em{font-style:normal;color:var(--sage);}
.pg-sec-lede{font-family:var(--sans);font-weight:600;text-align:center;color:rgba(61,75,101,.7);font-size:16px;max-width:48ch;margin:0 auto 30px;}

/* ── WHAT YOU WIN — Hormozi value stack ──────────────────────────────── */
.pg-checks{list-style:none;margin:0;padding:0;display:grid;gap:11px;text-align:left;}
.pg-checks li{position:relative;padding-left:32px;font-family:var(--sans);font-weight:600;font-size:16px;color:var(--navy);line-height:1.45;}
.pg-checks li::before{content:"✓";position:absolute;left:0;top:-1px;color:var(--sage);font-weight:800;font-size:18px;}

/* main prize — framed in lights */
.pg-prize{position:relative;max-width:620px;margin:0 auto;background:#fff;border:1px solid rgba(61,75,101,.1);border-radius:22px;box-shadow:0 22px 52px rgba(61,75,101,.16);padding:32px 32px 28px;}
.pg-prize-body{text-align:center;}
.pg-tag{display:inline-block;background:var(--sage);color:var(--navy);font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.16em;font-size:12px;padding:7px 18px;border-radius:999px;}
.pg-prize-name{font-family:var(--serif);font-weight:700;font-size:clamp(25px,4.4vw,32px);color:var(--navy);margin:16px 0 16px;line-height:1.05;}
.pg-prize .pg-checks{display:inline-grid;margin:0 auto;}
.pg-val{margin-top:18px;font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:14px;color:var(--sage-ink);}
/* light frame around the prize box */
.pg-boxlights{position:absolute;inset:0;border-radius:22px;pointer-events:none;}
.pg-boxlights .edge{position:absolute;filter:drop-shadow(0 0 3px rgba(255,214,140,.6));}
.pg-boxlights .edge.top,.pg-boxlights .edge.bottom{left:16px;right:16px;height:10px;
  background:
    radial-gradient(circle 4px at 10px 5px,#e5484d 90%,transparent 91%),
    radial-gradient(circle 4px at 30px 5px,#3fae5a 90%,transparent 91%),
    radial-gradient(circle 4px at 50px 5px,#4a86e8 90%,transparent 91%),
    radial-gradient(circle 4px at 70px 5px,#f0b429 90%,transparent 91%),
    radial-gradient(circle 4px at 90px 5px,#f4ecd6 90%,transparent 91%);
  background-repeat:repeat-x;background-size:100px 10px;}
.pg-boxlights .edge.top{top:-4px;} .pg-boxlights .edge.bottom{bottom:-4px;}
.pg-boxlights .edge.left,.pg-boxlights .edge.right{top:16px;bottom:16px;width:10px;
  background:
    radial-gradient(circle 4px at 5px 10px,#e5484d 90%,transparent 91%),
    radial-gradient(circle 4px at 5px 30px,#3fae5a 90%,transparent 91%),
    radial-gradient(circle 4px at 5px 50px,#4a86e8 90%,transparent 91%),
    radial-gradient(circle 4px at 5px 70px,#f0b429 90%,transparent 91%),
    radial-gradient(circle 4px at 5px 90px,#f4ecd6 90%,transparent 91%);
  background-repeat:repeat-y;background-size:10px 100px;}
.pg-boxlights .edge.left{left:-4px;} .pg-boxlights .edge.right{right:-4px;}

.pg-plus{text-align:center;font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.18em;font-size:13px;color:var(--sage-ink);margin:22px auto;}
.pg-bonus{position:relative;max-width:620px;margin:14px auto 0;background:rgba(138,157,137,.08);border:2.5px solid var(--sage);border-radius:18px;padding:18px 22px;}
.pg-btag{font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:12px;color:var(--sage-ink);}
.pg-bonus-name{font-family:var(--serif);font-weight:700;font-size:21px;color:var(--navy);margin:5px 0 7px;line-height:1.1;}
.pg-bonus-name .note{font-family:var(--sans);font-weight:600;font-size:13px;color:rgba(61,75,101,.5);}
.pg-bonus-desc{font-family:var(--sans);font-weight:600;font-size:15px;color:rgba(61,75,101,.75);margin:0;line-height:1.5;}
.pg-bigvalue{text-align:center;margin-top:30px;font-family:var(--serif);font-weight:700;line-height:.92;letter-spacing:-.02em;text-transform:uppercase;font-size:clamp(46px,11vw,100px);color:var(--navy);}
.pg-bigvalue .amt{color:#cf3a30;}

/* opt-in cue + form */
.pg-optcue{text-align:center;margin-bottom:6px;}
.pg-optcue .t{font-family:var(--serif);font-style:italic;font-weight:700;font-size:26px;color:var(--navy);}
.pg-card{background:var(--white);border:1px solid rgba(61,75,101,.1);border-radius:24px;box-shadow:0 24px 58px rgba(61,75,101,.14);padding:30px 26px;}
.pg-card-head{text-align:center;margin-bottom:18px;}
.pg-field{margin-bottom:13px;text-align:left;}
.pg-field label{display:block;font-family:var(--disp);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--sage-ink);margin-bottom:6px;}
.pg-field input{width:100%;padding:15px;font-size:16px;border-radius:12px;border:1.5px solid rgba(61,75,101,.2);font-family:var(--sans);font-weight:500;color:var(--navy);background:var(--cream);}
.pg-field input:focus{outline:none;border-color:var(--sage);box-shadow:0 0 0 3px rgba(138,157,137,.22);background:#fff;}
.pg-error{background:#f6ecec;color:#9c4a42;border:1px solid #e6cbc7;border-radius:12px;padding:11px 13px;font-size:14px;margin-bottom:13px;font-weight:600;}
.pg-cta{display:inline-flex;align-items:center;justify-content:center;gap:12px;width:100%;background:var(--sage);color:var(--navy);border:none;cursor:pointer;padding:20px 30px;border-radius:999px;font-family:var(--disp);font-weight:700;font-size:17px;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 18px 42px rgba(138,157,137,.55);transition:all .3s cubic-bezier(.22,1,.36,1);}
.pg-cta:hover{background:var(--navy);color:var(--cream);transform:translateY(-2px);}
.pg-cta:disabled{opacity:.6;cursor:default;transform:none;}
.pg-fine{text-align:center;color:rgba(61,75,101,.65);font-size:12.5px;margin-top:14px;}
.pg-fine a{color:var(--sage-ink);font-weight:600;}
.pg-refer{margin:0 0 15px;background:rgba(138,157,137,.14);border:1px solid rgba(138,157,137,.42);border-radius:12px;padding:12px 14px;font-family:var(--sans);font-weight:600;font-size:13.5px;color:var(--navy);line-height:1.45;text-align:center;}
.pg-refer b{color:var(--sage-ink);}
.pg-consent{display:flex;gap:10px;align-items:flex-start;text-align:left;margin:0 0 15px;font-family:var(--sans);font-size:11.5px;line-height:1.45;color:rgba(61,75,101,.8);font-weight:500;cursor:pointer;}
.pg-consent input{margin-top:2px;width:18px;height:18px;flex:0 0 auto;accent-color:var(--sage-ink);cursor:pointer;}
.pg-consent a{color:var(--sage-ink);font-weight:700;}
.pg-verify-note{background:#fdf3e2;border:1px solid #efd9ac;border-radius:12px;padding:12px 14px;font-family:var(--sans);font-weight:600;font-size:13.5px;color:#8a6a2c;line-height:1.5;margin:2px auto 16px;max-width:44ch;}
.pg-verify-note b{color:#6f5320;}
.pg-verify-issue{background:#fbeaea;border:1px solid #e6c3c0;border-radius:12px;padding:12px 14px;font-family:var(--sans);font-weight:600;font-size:13.5px;color:#8a3d36;line-height:1.5;margin:0 auto 18px;max-width:46ch;text-align:center;}
.pg-verify-issue b{color:#6f2e28;}
.pg-follow{font-family:var(--sans);font-size:12.5px;color:rgba(61,75,101,.7);margin-top:16px;}
.pg-follow a{color:var(--sage-ink);font-weight:700;}

/* states */
.pg-state{text-align:center;}
.pg-badge{font-size:44px;}
.pg-state h2{font-family:var(--serif);font-weight:700;color:var(--navy);font-size:clamp(25px,4vw,36px);margin:8px 0;}
.pg-state p{font-weight:500;color:rgba(61,75,101,.75);font-size:16.5px;margin:0 auto 8px;max-width:44ch;line-height:1.6;}
.pg-linkrow{display:flex;gap:8px;margin:18px 0 8px;}
.pg-linkrow input{flex:1;padding:14px 13px;font-size:14px;border-radius:12px;border:1.5px solid rgba(61,75,101,.2);background:var(--cream);color:var(--navy);font-weight:500;}
.pg-copy{width:auto;padding:14px 22px;font-size:13px;white-space:nowrap;}
.pg-entries{background:rgba(138,157,137,.15);border:1px solid rgba(138,157,137,.42);border-radius:16px;padding:18px;margin:18px 0;}
.pg-stat-num{font-family:var(--serif);font-weight:700;color:var(--sage-ink);font-size:46px;line-height:1;}
.pg-stat-lbl{font-family:var(--disp);text-transform:uppercase;letter-spacing:.16em;font-size:11px;color:var(--sage-ink);margin-top:5px;font-weight:700;}
.pg-shares{display:flex;gap:9px;justify-content:center;flex-wrap:wrap;margin-top:8px;}
.pg-share{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;padding:12px 17px;border-radius:999px;font-family:var(--disp);font-weight:700;font-size:12px;letter-spacing:.06em;text-transform:uppercase;background:var(--navy);color:var(--cream);border:none;cursor:pointer;}
.pg-share:hover{background:var(--navy-deep);}
.pg-ig-note{margin-top:10px;font-family:var(--sans);font-weight:600;font-size:13px;color:var(--sage-ink);}

.pg-footer{background:var(--cream);border-top:1px solid rgba(61,75,101,.12);padding:26px 0 30px;text-align:center;}
.pg-footer .np{font-family:var(--disp);font-weight:700;letter-spacing:.18em;color:var(--navy);font-size:12px;text-transform:uppercase;}
.pg-footer p{color:rgba(61,75,101,.6);font-size:12px;margin:9px auto 0;max-width:60ch;line-height:1.6;}
.pg-footer a{color:var(--sage-ink);font-weight:600;}

/* ── MOBILE ──────────────────────────────────────────────────────────── */
@media (max-width:640px){
  .pg-wrap{padding:0 26px;}          /* clears the 18px side light strips */
  .pg-hero{min-height:auto;justify-content:flex-start;padding:18px 0 22px;}
  .pg-timer{gap:6px;}
  .pg-t-unit{padding:6px 2px 5px;border-radius:10px;}
  .pg-prize{padding:28px 22px 24px;}
  .pg-bonus{padding:16px 18px;}
  .pg-linkrow{flex-direction:column;} .pg-copy{width:100%;}
}
@media (max-width:380px){
  .pg-timer{gap:4px;}
  .pg-t-lbl{font-size:8px;letter-spacing:.06em;}
  .pg-hsub{font-size:11.5px;}
}
`;

function Chevron({ size = 30 }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function CountdownTimer({ cd }) {
  const units = [[cd.days, 'Days'], [cd.hours, 'Hrs'], [cd.minutes, 'Min'], [cd.seconds, 'Sec']];
  return (
    <div className="pg-timer">
      {units.map(([n, l]) => (
        <div className="pg-t-unit" key={l}>
          <div className="pg-t-num">{String(n).padStart(2, '0')}</div>
          <div className="pg-t-lbl">{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function GiveawayPage() {
  const [stage, setStage] = useState('form');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [igNote, setIgNote] = useState(false);
  const [consent, setConsent] = useState(false);
  const [verifyIssue, setVerifyIssue] = useState(''); // 'retry' | 'fail' from the verify redirect
  const [verified, setVerified] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false); // have we resolved verified state yet?
  const stripRef = useRef(null);
  const [stripH, setStripH] = useState(76);

  const cd = useCountdown(ENTRIES_CLOSE);
  const closed = cd.closed;

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return undefined;
    const update = () => setStripH(el.offsetHeight);
    update();
    let ro;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(update); ro.observe(el); }
    window.addEventListener('resize', update);
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', update); };
  }, [closed]);

  useEffect(() => {
    setReferralCode(captureReferralCode());

    let params = null;
    try { params = new URLSearchParams(window.location.search); } catch { params = null; }
    const justVerified = !!(params && params.get('verified') === '1');
    const verifiedEmail = (params && params.get('e')) || '';
    const vq = (params && params.get('verify')) || '';
    if (vq === 'retry' || vq === 'fail') setVerifyIssue(vq);

    let storedEmail = '';
    try { storedEmail = localStorage.getItem(LS_EMAIL) || ''; } catch { /* ignore */ }
    const email = (justVerified && verifiedEmail) || storedEmail;
    const key = email.trim().toLowerCase();
    if (justVerified && verifiedEmail) {
      try { localStorage.setItem(LS_EMAIL, verifiedEmail); } catch { /* ignore */ }
    }

    // Did this device already confirm this email? Render confirmed immediately
    // (no "waiting" flash) — the live status fetch below still has final say.
    let cachedVerified = false;
    try { cachedVerified = !!key && localStorage.getItem(LS_VERIFIED) === key; } catch { /* ignore */ }

    const rememberVerified = (v) => {
      try {
        if (v && key) localStorage.setItem(LS_VERIFIED, key);
        else if (!v && key) localStorage.removeItem(LS_VERIFIED);
      } catch { /* ignore */ }
    };

    if (justVerified) {
      setStage('share'); setVerified(true); setStatusChecked(true); rememberVerified(true);
    }

    if (email) {
      setForm((f) => ({ ...f, email }));
      if (!justVerified) {
        setStage('share');
        if (cachedVerified) { setVerified(true); setStatusChecked(true); }
      }
      fetchStatus(email)
        .then((d) => {
          setReferralLink(d.referral_link || '');
          setTotalPoints(d.entries ?? 0);
          // Trust the server's verified state once the live read resolves — do
          // NOT keep forcing true from the URL, so a failed confirm surfaces
          // instead of showing a fake "confirmed" screen.
          const v = Boolean(d.verified);
          setVerified(v);
          setStatusChecked(true);
          rememberVerified(v);
        })
        .catch(() => { setStatusChecked(true); }); // stop "checking…"; keep any cached verified state
    }
  }, []);

  useEffect(() => {
    if (stage !== 'share') return undefined;
    const email = form.email;
    if (!email) return undefined;
    let alive = true;
    const refresh = () => {
      if (document.visibilityState !== 'visible') return; // don't poll a backgrounded tab
      fetchStatus(email)
        .then((d) => {
          if (!alive) return;
          setTotalPoints(d.entries ?? 0);
          if (d.referral_link) setReferralLink(d.referral_link);
          if (typeof d.verified === 'boolean') {
            setVerified(d.verified);
            try {
              const key = email.trim().toLowerCase();
              if (d.verified) localStorage.setItem(LS_VERIFIED, key);
            } catch { /* ignore */ }
          }
          setStatusChecked(true);
        })
        .catch(() => { /* ignore transient read errors */ });
    };
    const id = setInterval(refresh, 15000);   // live entries + auto-flip to confirmed
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      alive = false;
      clearInterval(id);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [stage, form.email]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!name || !email || !phone) {
      setError('Please add your name, email, and phone so we can reach the winner.');
      return;
    }
    if (!consent) {
      setError('Please check the consent box to enter.');
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch('/api/giveaway-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, referral_code: referralCode || '' }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      try { localStorage.setItem(LS_EMAIL, email); } catch { /* ignore */ }
      setReferralLink(data.referral_link || '');
      setTotalPoints(data.entries ?? 0);
      setVerified(Boolean(data.verified));
      setStatusChecked(true);
      setStage('share');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function copyLink() {
    if (!referralLink) return;
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(referralLink).then(done).catch(() => {});
    } else { done(); }
  }

  function shareInstagram() {
    if (!referralLink) return;
    // Instagram has no prefilled-link web share, so the reliable move is: copy
    // the link, tell them clearly, then open Instagram so they can paste it into
    // a story or their bio. Works the same on mobile and desktop.
    const openIg = () => { try { window.open(IG_URL, '_blank', 'noopener'); } catch { /* ignore */ } };
    const notify = () => { setIgNote(true); setTimeout(() => setIgNote(false), 4000); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(referralLink).then(() => { notify(); openIg(); }).catch(() => { notify(); openIg(); });
    } else {
      notify(); openIg();
    }
  }

  function scrollToForm() {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('pg-enter');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const shareMsg = `I just entered Peace's ${PRIZE_VALUE} holiday home transformation giveaway — a full custom light install, window cleaning, and solar panel cleaning. Enter free:`;
  const encMsg = encodeURIComponent(shareMsg);
  const encLink = encodeURIComponent(referralLink || '');

  return (
    <div className="pg-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* holiday-light border — top, left, right (no bottom) */}
      <div className="pg-lights" aria-hidden="true">
        <span className="edge left" />
        <span className="edge right" />
      </div>

      {/* big bold countdown strip */}
      <div className="pg-strip" ref={stripRef}>
        {closed ? (
          <>
            <span className="lbl">The giveaway</span>
            <span className="closed-txt">Winner announced soon</span>
          </>
        ) : (
          <>
            <span className="lbl">Entries close in · Oct 5, 11:59 PM PT</span>
            <CountdownTimer cd={cd} />
          </>
        )}
      </div>
      <div className="pg-strip-spacer" style={{ height: stripH }} aria-hidden="true" />

      {closed ? (
        <section className="pg-sec">
          <div className="pg-wrap pg-state">
            <div className="pg-badge">🎄</div>
            <h2>Winner announced soon</h2>
            <p>We&apos;re picking and verifying the winner now. If you entered, keep an eye on your inbox — that&apos;s how we&apos;ll reach the winner.</p>
          </div>
        </section>
      ) : (
        <>
          {/* HERO */}
          <section className="pg-hero">
            <div className="pg-wrap">
              <div className="pg-eyebrow">Free to enter · Coachella Valley</div>
              <h1 className="pg-h1">Win a done-for-you <em>Holiday Home Transformation</em></h1>
              <div className="pg-value-line"><b>$3,000</b> in value!</div>
              <p className="pg-hsub">Watch the quick video, then opt in below.</p>
              <div className="pg-vsl">
                {VSL_EMBED_URL ? (
                  <iframe
                    src={VSL_EMBED_URL}
                    title="Peace holiday giveaway video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="pg-vsl-ph">
                    <div className="pg-play">▶</div>
                    <div className="cap">Video goes here — set VSL_EMBED_URL in GiveawayPage.jsx</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* OPT-IN */}
          <section id="pg-enter" className="pg-sec pg-sec-off">
            <div className="pg-wrap pg-narrow">
              {verifyIssue && (
                <div className="pg-verify-issue">
                  {verifyIssue === 'retry'
                    ? <>⚠️ <b>We couldn&apos;t confirm your entry just now.</b> Please reopen the most recent email from Peace and tap &ldquo;Confirm my entry&rdquo; again.</>
                    : <>⚠️ <b>That confirmation link wasn&apos;t valid or has expired.</b> If you entered, reopen the most recent email from Peace and tap the confirm button there.</>}
                </div>
              )}
              {stage === 'form' && (
                <>
                  <div className="pg-optcue">
                    <div className="t">Opt in here</div>
                    <div className="pg-arrows"><Chevron size={40} /><Chevron size={40} /><Chevron size={40} /></div>
                  </div>
                  <div className="pg-card">
                    <div className="pg-card-head">
                      <div className="pg-eyebrow">Free · takes 20 seconds</div>
                      <h2 className="pg-sec-title" style={{ margin: '6px 0 0', fontSize: 'clamp(24px,4vw,34px)' }}>Enter to win</h2>
                    </div>
                    {error && <div className="pg-error">{error}</div>}
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="pg-field">
                        <label htmlFor="pg-name">Name</label>
                        <input id="pg-name" type="text" autoComplete="name" value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                      </div>
                      <div className="pg-field">
                        <label htmlFor="pg-email">Email</label>
                        <input id="pg-email" type="email" autoComplete="email" value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                      </div>
                      <div className="pg-field">
                        <label htmlFor="pg-phone">Phone</label>
                        <input id="pg-phone" type="tel" autoComplete="tel" value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(760) 555-1234" />
                      </div>
                      <div className="pg-refer">🎁 <b>Refer the winner and you win too.</b> After you enter, share your link — if someone you refer wins, you get the same prize.</div>
                      <label className="pg-consent">
                        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                        <span>I agree to the <a href={TERMS_URL} target="_blank" rel="noopener noreferrer">Official Rules &amp; Privacy Policy</a> and consent to receive marketing calls and texts from Peace Services at the number I provide. Message and data rates may apply; reply STOP to opt out. Consent is not required to make a purchase.</span>
                      </label>
                      <button className="pg-cta" type="submit" disabled={submitting}>
                        {submitting ? 'Entering…' : "Enter to Win — It's Free"}
                      </button>
                    </form>
                    <div className="pg-fine">No purchase necessary. See the <a href={TERMS_URL} target="_blank" rel="noopener noreferrer">Official Rules</a>.</div>
                  </div>
                </>
              )}

              {stage === 'share' && !statusChecked && !verified && (
                <div className="pg-card pg-state">
                  <div className="pg-badge">⏳</div>
                  <h2>Checking your entry…</h2>
                  <p>One moment while we pull up your entry.</p>
                </div>
              )}

              {stage === 'share' && (statusChecked || verified) && (
                <div className="pg-card pg-state">
                  <div className="pg-badge">{verified ? '🎉' : '📩'}</div>
                  <h2>{verified ? "You're confirmed and entered!" : "You're in — one quick step"}</h2>
                  {verified ? (
                    <p>Your entry is locked in. Refer friends for more chances — and if your friend wins, <strong>you win too.</strong></p>
                  ) : (
                    <div className="pg-verify-note">
                      📩 <b>Check your email and tap &ldquo;Confirm my entry.&rdquo;</b> That&apos;s what makes your entry count. It lands in a minute or two — check spam just in case. Grab your referral link below in the meantime.
                    </div>
                  )}
                  <div className="pg-entries">
                    <div className="pg-stat-num">{totalPoints}</div>
                    <div className="pg-stat-lbl">{totalPoints === 1 ? 'Entry' : 'Entries'}</div>
                  </div>
                  {referralLink && (
                    <>
                      <p style={{ margin: '0 auto 6px', fontWeight: 600 }}>Your link — if your friend wins, you win too:</p>
                      <div className="pg-linkrow">
                        <input type="text" readOnly value={referralLink} onFocus={(e) => e.target.select()} />
                        <button className="pg-cta pg-copy" type="button" onClick={copyLink}>{copied ? 'Copied!' : 'Copy link'}</button>
                      </div>
                      <div className="pg-shares">
                        <a className="pg-share" href={`sms:?&body=${encMsg}%20${encLink}`}>Text</a>
                        <a className="pg-share" target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encLink}`}>Facebook</a>
                        <button className="pg-share" type="button" onClick={shareInstagram}>Instagram</button>
                      </div>
                      {igNote && (
                        <div className="pg-ig-note">✓ Link copied — paste it into your Instagram story or bio to share.</div>
                      )}
                    </>
                  )}
                  <p className="pg-follow">We announce the winner on <a href={IG_URL} target="_blank" rel="noreferrer">Instagram</a> and <a href={FB_URL} target="_blank" rel="noreferrer">Facebook</a> — follow to see it.</p>
                </div>
              )}
              {stage === 'form' && (
                <div className="pg-optcue" style={{ marginTop: 34 }}>
                  <div className="t">Here&apos;s what you win</div>
                  <div className="pg-arrows"><Chevron size={40} /><Chevron size={40} /><Chevron size={40} /></div>
                </div>
              )}
            </div>
          </section>

          {/* WHAT YOU WIN — value stack */}
          <section className="pg-sec">
            <div className="pg-wrap">
              <Reveal>
                <h2 className="pg-sec-title">Here&apos;s what you <em>win</em></h2>
                <p className="pg-sec-lede">One home gets the whole thing done — start to finish, on us.</p>

                {/* MAIN PRIZE — framed in lights */}
                <div className="pg-prize">
                  <div className="pg-boxlights" aria-hidden="true">
                    <span className="edge top" /><span className="edge bottom" /><span className="edge left" /><span className="edge right" />
                  </div>
                  <div className="pg-prize-body">
                    <span className="pg-tag">✨ The Grand Prize</span>
                    <div className="pg-prize-name">Custom Holiday Lighting</div>
                    <ul className="pg-checks">
                      <li>Full custom design consult</li>
                      <li>All lights provided</li>
                      <li>Professional installation</li>
                      <li>Season-long maintenance</li>
                      <li>Taken down &amp; stored for you in January</li>
                    </ul>
                    <div className="pg-val">$2,200 value</div>
                  </div>
                </div>

                <div className="pg-plus">＋ &nbsp;And two free bonuses&nbsp; ＋</div>

                {/* BONUS 1 */}
                <div className="pg-bonus">
                  <div className="pg-btag">🎁 Bonus #1 · $500 value</div>
                  <div className="pg-bonus-name">Full Window Cleaning</div>
                  <p className="pg-bonus-desc">Interior <b>and</b> exterior — glass, frames, sills, screens, and slider tracks.</p>
                </div>

                {/* BONUS 2 */}
                <div className="pg-bonus">
                  <div className="pg-btag">🎁 Bonus #2 · $300 value</div>
                  <div className="pg-bonus-name">Solar Panel Cleaning <span className="note">(if applicable)</span></div>
                  <p className="pg-bonus-desc">Cleaned with deionized water and a soft nylon brush.</p>
                </div>

                <div className="pg-bigvalue"><span className="amt">$3,000</span> in value!</div>
              </Reveal>
            </div>
          </section>
        </>
      )}

      <footer className="pg-footer">
        <div className="pg-wrap">
          <div className="np">No purchase necessary</div>
          <p>No purchase necessary to enter or win. Open to California residents 18+ within Sponsor&apos;s service area. Void where prohibited. See the <a href={TERMS_URL} target="_blank" rel="noopener noreferrer">Official Rules</a> for full details, eligibility, and how the winner is selected. Peace Services.</p>
        </div>
      </footer>
    </div>
  );
}
