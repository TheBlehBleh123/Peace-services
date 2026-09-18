// api/giveaway-verify.js
//
// The link in the verification email points here. It confirms the entry so it
// counts in the drawing (the VSL promises: "Click the link inside it. That's
// what makes your entry count.").
//
// The token is an HMAC of the email (see lib/giveaway.js) — unforgeable and
// stateless, so we don't store per-user tokens. On success we flip Verified=true
// in Airtable and redirect the entrant back to the page in its confirmed state.
//
// Request:  GET /api/giveaway-verify?e=<email>&t=<token>

import { verifyToken, safeEqual, findByEmail, updateEntry, SITE_ORIGIN, LANDING_PATH } from '../lib/giveaway.js';

export default async function handler(req, res) {
  const email = String((req.query && req.query.e) || '').trim();
  const token = String((req.query && req.query.t) || '').trim();
  const dest = (params) => `${SITE_ORIGIN}${LANDING_PATH}?${params}`;

  if (!email || !token || !safeEqual(token, verifyToken(email))) {
    return res.redirect(302, dest('verify=fail'));
  }

  try {
    const rec = await findByEmail(email);
    if (rec && !(rec.fields && rec.fields.Verified)) {
      await updateEntry(rec.id, { Verified: true });
    }
  } catch {
    // Token was valid; even if the Airtable write momentarily fails, send them
    // to the confirmed page. (Re-clicking the email link will retry the flip.)
  }
  return res.redirect(302, dest(`verified=1&e=${encodeURIComponent(email)}`));
}
