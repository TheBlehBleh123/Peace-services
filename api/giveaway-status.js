// api/giveaway-status.js
//
// Live entry-count read for the giveaway page.
//
// WHY THIS EXISTS: UpViral does NOT fire a callback/webhook when a referrer's
// points increment (only on the initial lead). So the page cannot rely on a
// pushed update — it must READ the current count live from UpViral. The page
// polls this endpoint when it regains focus (entrant shares, then comes back).
//
// Request:  GET /api/giveaway-status?email=someone@example.com
// Response: { ok:true, total_points, referral_link, pending_confirmation }
//           or { ok:false, error:"..." }

const UPVIRAL_API_URL = 'https://app.upviral.com/api/v1/';
const CAMPAIGN_ID = '169036';
const REQUEST_TIMEOUT_MS = 10000;

// The shareable referral link points at OUR landing page (with the ?ref=<code>),
// not UpViral's hosted page — same as api/giveaway-signup.js. Keep these in sync.
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://www.peace-services.com';
const LANDING_PATH = '/holiday-giveaway';

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

function shareLinkFrom(upviralReferralLink) {
  const code = referralCodeFrom(upviralReferralLink);
  return code ? `${SITE_ORIGIN}${LANDING_PATH}?ref=${encodeURIComponent(code)}` : null;
}

function isConfirmed(status) {
  if (!status) return false;
  const s = String(status).toLowerCase();
  return (s.includes('confirm') && !s.includes('unconfirm')) || s === 'subscribed' || s === 'active';
}

export default async function handler(req, res) {
  // This is a live count — never cache it.
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const email = String((req.query && req.query.email) || '').trim();
  if (!email) {
    return res.status(400).json({ ok: false, error: 'An email query parameter is required.' });
  }

  const apiKey = process.env.UPVIRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'The giveaway is not fully set up yet.' });
  }

  const body = new URLSearchParams();
  body.set('uvapikey', apiKey);
  body.set('uvmethod', 'get_lead_details_by_email');
  body.set('campaign_id', CAMPAIGN_ID);
  body.set('email', email);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const r = await fetch(UPVIRAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: controller.signal,
    });

    const text = await r.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return res.status(502).json({ ok: false, error: `UpViral returned an unexpected response (HTTP ${r.status}).` });
    }

    if (!json || json.result === 'error') {
      const msg = (json && (json.message || json.error)) || 'We could not find that entry yet.';
      return res.status(404).json({ ok: false, error: String(msg) });
    }

    return res.status(200).json({
      ok: true,
      total_points: Number(json.total_points || 0) || 0,
      referral_link: shareLinkFrom(json.referral_link) || json.referral_link || null,
      pending_confirmation: !isConfirmed(json.status),
    });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: err.name === 'AbortError' ? 'UpViral timed out. Please try again.' : 'Could not load your entries.',
    });
  } finally {
    clearTimeout(timer);
  }
}
