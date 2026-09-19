// api/giveaway-status.js
//
// Live read for the thank-you screen: how many entries someone has (1 + the
// number of people they've referred) and whether they've verified yet.
// Reads Airtable directly. Fires only when someone is on the share screen.
//
// Request:  GET /api/giveaway-status?email=someone@example.com
// Response: { ok:true, entries, referral_link, verified }  or  { ok:false, error }

import { referralCode, shareLink, findByEmail, countReferrals } from '../lib/giveaway.js';

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
    const rec = await findByEmail(email);
    if (!rec) {
      return res.status(404).json({ ok: false, error: 'No entry found for that email yet.' });
    }
    // Your own entry counts only once you've confirmed; referrals only count verified.
    const verified = !!(rec.fields && rec.fields.Verified);
    const entries = (verified ? 1 : 0) + (await countReferrals(code));
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
