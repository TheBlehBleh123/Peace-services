// api/giveaway-status.js
//
// Live read for the thank-you screen: how many ELIGIBLE entries someone has —
// which is 0 until they confirm, then (1 + their number of VERIFIED referrals) —
// and whether they've verified yet. Fires only when someone is on the share screen.
//
// Request:  GET /api/giveaway-status?email=someone@example.com
// Response: { ok:true, entries, referral_link, verified }  or  { ok:false, error }

import { referralCode, shareLink, findByCode, countReferrals } from '../lib/giveaway.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const email = String((req.query && req.query.email) || '').trim();
  if (!email) {
    return res.status(400).json({ ok: false, error: 'An email query parameter is required.' });
  }

  try {
    const code = referralCode(email);
    const rec = await findByCode(code);
    if (!rec) {
      return res.status(404).json({ ok: false, error: 'No entry found for that email yet.' });
    }
    // Not eligible until you confirm: an unverified entrant has 0 (their own
    // entry and any referrals only count once THEY are verified). This also
    // matches their true drawing odds and skips the referral scan when unverified.
    const verified = !!(rec.fields && rec.fields.Verified);
    const entries = verified ? (1 + (await countReferrals(code))) : 0;
    return res.status(200).json({
      ok: true,
      entries,
      referral_link: shareLink(code),
      verified,
    });
  } catch (err) {
    const notSetup = err.code === 'NOT_SETUP';
    return res.status(notSetup ? 500 : 502).json({
      ok: false,
      error: notSetup ? 'The giveaway is not fully set up yet.' : 'Could not load your entries.',
    });
  }
}
