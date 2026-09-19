// api/giveaway-signup.js
//
// Records a giveaway entry. Writes to the Airtable "Entries" base (the entry
// ledger + referral engine) and mirrors the lead into GHL for follow-up.
// The entry is created UNVERIFIED — it only becomes eligible once the entrant
// clicks the verification link emailed by GHL (see api/giveaway-verify.js).
//
// Request:  POST { name, email, phone, referral_code }   (referral_code = ?ref of who referred them)
// Response: { ok:true, referral_link, entries, verified }  or  { ok:false, error }

import {
  referralCode, shareLink, verifyLink,
  findByEmail, createEntry, updateEntry, countReferrals,
} from '../lib/giveaway.js';

async function postToGhl(lead) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { configured: false };
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 5000);
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: ctl.signal,
    });
    return { configured: true, ok: r.ok, status: r.status };
  } catch (e) {
    // Never let a GHL hiccup break the entry — Airtable already has it.
    return { configured: true, ok: false, error: String((e && e.message) || e) };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  let p = req.body;
  if (typeof p === 'string') { try { p = JSON.parse(p); } catch { p = {}; } }
  p = p || {};

  const name = String(p.name || '').trim();
  const email = String(p.email || '').trim();
  const phone = String(p.phone || '').trim();
  const ref = String(p.referral_code || '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }

  try {
    const code = referralCode(email);
    const existing = await findByEmail(email);

    if (!existing) {
      await createEntry({
        Email: email,
        Name: name || undefined,
        Phone: phone || undefined,
        'Referral Code': code,
        'Referred By': ref || undefined,
        Source: ref ? 'Referral' : 'Direct',
      });
    } else {
      // Returning entrant: refresh name/phone if given, but NEVER touch
      // Verified or Referred By (don't reset their confirmation or attribution).
      const upd = {};
      if (name) upd.Name = name;
      if (phone) upd.Phone = phone;
      if (Object.keys(upd).length) { try { await updateEntry(existing.id, upd); } catch { /* non-fatal */ } }
    }

    // Mirror into GHL for the sales follow-up (referral link + verify link ride
    // along so the GHL email template can drop both in). Non-fatal.
    const ghl = await postToGhl({
      source: 'holiday-giveaway',
      name, email, phone,
      referral_code: code,
      referred_by: ref,
      referral_link: shareLink(code),
      verify_link: verifyLink(email),
    });

    const verified = existing ? !!(existing.fields && existing.fields.Verified) : false;
    const base = verified ? 1 : 0; // your own entry counts only once confirmed
    let entries = base;
    try { entries = base + (await countReferrals(code)); } catch { /* keep base if the count read hiccups */ }

    return res.status(200).json({ ok: true, referral_link: shareLink(code), entries, verified, ghl });
  } catch (err) {
    const notSetup = err.code === 'NOT_SETUP';
    return res.status(notSetup ? 500 : 502).json({
      ok: false,
      error: notSetup ? 'The giveaway is not fully set up yet. Please try again shortly.' : (err.message || 'Signup failed. Please try again.'),
    });
  }
}
