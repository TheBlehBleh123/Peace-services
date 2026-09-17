// api/giveaway-signup.js
//
// Peace holiday giveaway — server-side UpViral proxy (lead creation).
// The UpViral API key lives ONLY on the server (process.env.UPVIRAL_API_KEY).
// It must never reach the browser, so all UpViral calls happen here.
//
// Request:  POST { name, email, phone, referral_code }
// Response: { ok:true, referral_link, total_points, pending_confirmation }
//           or { ok:false, error:"<clean message the page can show>" }

const UPVIRAL_API_URL = 'https://app.upviral.com/api/v1/';
const CAMPAIGN_ID = '169036';
const REQUEST_TIMEOUT_MS = 10000;

// Where entrants (and the friends they refer) land. The shareable referral link
// we return points HERE — our own custom landing page — NOT UpViral's hosted
// page. That way a referred visitor always sees the page we built, and the
// referral is tracked via the ?ref=<code> our page reads and passes back to
// UpViral on the friend's signup (which credits the original referrer).
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://www.peace-services.com';
const LANDING_PATH = '/holiday-giveaway';

// Extract the referral CODE from whatever referral URL UpViral returns, e.g.
// https://upvir.al/ref/ABC123 -> "ABC123"  or  ...?ref=ABC123 -> "ABC123".
function referralCodeFrom(link) {
  if (!link) return '';
  try {
    const u = new URL(String(link));
    const q = u.searchParams.get('ref') || u.searchParams.get('referral_code') || u.searchParams.get('r');
    if (q) return q;
    const segs = u.pathname.split('/').filter(Boolean);
    return segs.length ? segs[segs.length - 1] : '';
  } catch {
    const segs = String(link).split('/').filter(Boolean);
    return segs.length ? segs[segs.length - 1] : String(link).trim();
  }
}

// Build the shareable link that points at OUR landing page with the ref code.
function shareLinkFrom(upviralReferralLink) {
  const code = referralCodeFrom(upviralReferralLink);
  return code ? `${SITE_ORIGIN}${LANDING_PATH}?ref=${encodeURIComponent(code)}` : null;
}

// ---------------------------------------------------------------------------
// !!! OWNER MUST CONFIRM THIS KEY !!!
// UpViral has no native "phone" parameter, so phone is sent as a CUSTOM FIELD.
// The key below must match the phone custom field's key in THIS campaign
// (Campaign 169036 > Settings > Custom Fields). 'phone' is a placeholder guess.
// If it is wrong, the phone number is silently dropped by UpViral.
const PHONE_FIELD_KEY = 'phone';
// ---------------------------------------------------------------------------

// A UpViral status string counts as "confirmed" (double opt-in complete) if it
// clearly reads confirmed/subscribed/active. Exact strings are unconfirmed —
// see VERIFY checklist. Default is "not confirmed" so we never show a live
// entry count before the confirmation email is clicked.
function isConfirmed(status) {
  if (!status) return false;
  const s = String(status).toLowerCase();
  return (s.includes('confirm') && !s.includes('unconfirm')) || s === 'subscribed' || s === 'active';
}

// Low-level UpViral POST. Sends application/x-www-form-urlencoded (per UpViral
// docs). Custom fields are passed as pre-bracketed keys, e.g. "custom_fields[phone]".
async function upviralPost(params) {
  const apiKey = process.env.UPVIRAL_API_KEY;
  if (!apiKey) {
    const err = new Error('The giveaway is not fully set up yet. Please try again shortly.');
    err.code = 'NO_API_KEY';
    throw err;
  }

  const body = new URLSearchParams();
  body.set('uvapikey', apiKey);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') body.set(k, String(v));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(UPVIRAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: controller.signal,
    });
  } catch (err) {
    throw new Error(err.name === 'AbortError' ? 'UpViral timed out. Please try again.' : 'Could not reach UpViral.');
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`UpViral returned an unexpected response (HTTP ${res.status}).`);
  }
  return json;
}

// Optional: mirror the new lead into GoHighLevel. Only runs if GHL_WEBHOOK_URL
// is set. Exists because it is UNCONFIRMED whether an API-created UpViral lead
// fires the existing UpViral -> GHL "New Lead" callback (see VERIFY checklist
// item #2). If it does not, set GHL_WEBHOOK_URL in Vercel and leads flow anyway.
async function postToGhl(lead) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'holiday-giveaway', ...lead }),
      signal: controller.signal,
    });
  } catch {
    // Never let a GHL hiccup break the entrant's signup.
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  // Vercel parses JSON bodies automatically; fall back to a manual parse.
  let payload = req.body;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch { payload = {}; }
  }
  payload = payload || {};

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const phone = String(payload.phone || '').trim();
  const referralCode = String(payload.referral_code || '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }

  // Best-effort visitor IP (UpViral accepts ip_address; helps its fraud scoring).
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined;

  try {
    // 1) Create the lead in UpViral.
    const addParams = {
      uvmethod: 'add_contact',
      campaign_id: CAMPAIGN_ID,
      email,
      name: name || undefined,
      ip_address: ip,
    };
    if (referralCode) addParams.referral_code = referralCode;
    if (phone) addParams[`custom_fields[${PHONE_FIELD_KEY}]`] = phone;

    const addResult = await upviralPost(addParams);
    if (!addResult || addResult.result !== 'success') {
      const msg = (addResult && (addResult.message || addResult.error)) || 'We could not create your entry. Please try again.';
      return res.status(502).json({ ok: false, error: String(msg) });
    }

    // 2) Fetch the referral link + entry count (add_contact does not return them).
    let referralLink = null;
    let totalPoints = 0;
    let pendingConfirmation = true; // double opt-in is ON -> assume unconfirmed right after signup.

    try {
      const details = await upviralPost({
        uvmethod: 'get_lead_details_by_email',
        campaign_id: CAMPAIGN_ID,
        email,
      });
      if (details && details.result !== 'error') {
        referralLink = shareLinkFrom(details.referral_link) || details.referral_link || null;
        totalPoints = Number(details.total_points || 0) || 0;
        pendingConfirmation = !isConfirmed(details.status);
      }
    } catch {
      // Non-fatal: the lead exists. The page can poll /api/giveaway-status later.
    }

    // 3) Optional GHL mirror (see note on postToGhl). Awaited so it actually
    //    fires in the serverless lifecycle; it has its own short timeout.
    await postToGhl({ name, email, phone, referral_code: referralCode, referral_link: referralLink });

    return res.status(200).json({
      ok: true,
      referral_link: referralLink,
      total_points: totalPoints,
      pending_confirmation: pendingConfirmation,
    });
  } catch (err) {
    const status = err.code === 'NO_API_KEY' ? 500 : 502;
    return res.status(status).json({ ok: false, error: err.message || 'Signup failed. Please try again.' });
  }
}
