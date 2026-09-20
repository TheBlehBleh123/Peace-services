// api/giveaway-verify.js
//
// Confirms a giveaway entry — the click that makes it count.
//
// Email security scanners (Gmail, Outlook, corporate filters) automatically
// FETCH every link in an email to check for malware. If the flip to Verified
// happened on that GET, those bots would confirm entries before the human ever
// clicked — corrupting the drawing pool. So we split it:
//
//   GET  /api/giveaway-verify?e=<email>&t=<token>
//        -> renders a confirmation page with a "Confirm my entry" button.
//           NO state change. Scanners see this and stop here.
//   POST /api/giveaway-verify   (e, t in the form body)
//        -> the human pressed the button: flip Verified=true, then redirect to
//           the thank-you page in its confirmed state.
//
// The token is an HMAC of the email (see lib/giveaway.js) — unforgeable and
// stateless, so nothing per-user is stored.

import { verifyToken, safeEqual, referralCode, findByCode, updateEntry, SITE_ORIGIN, LANDING_PATH } from '../lib/giveaway.js';

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

function confirmPage({ email, token, valid }) {
  const home = `${SITE_ORIGIN}${LANDING_PATH}`;
  const shell = (inner) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Confirm your entry — Peace Holiday Giveaway</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  :root{--navy:#3d4b65;--sage:#8a9d89;--sage-ink:#59705b;--cream:#f4f1ea;}
  *{box-sizing:border-box;}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--cream);font-family:"Inter",system-ui,-apple-system,sans-serif;color:var(--navy);padding:24px;}
  .card{background:#fff;max-width:440px;width:100%;border:1px solid rgba(61,75,101,.1);border-radius:24px;box-shadow:0 24px 58px rgba(61,75,101,.14);padding:38px 30px;text-align:center;}
  .badge{font-size:42px;line-height:1;}
  h1{font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:28px;margin:12px 0 8px;color:var(--navy);}
  p{font-size:16px;color:rgba(61,75,101,.78);line-height:1.55;margin:0 auto 22px;max-width:34ch;}
  button{width:100%;background:var(--sage);color:var(--navy);border:none;cursor:pointer;padding:18px 24px;border-radius:999px;font-family:"Inter",sans-serif;font-weight:700;font-size:16px;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 16px 36px rgba(138,157,137,.5);transition:all .25s ease;}
  button:hover{background:var(--navy);color:var(--cream);transform:translateY(-1px);}
  a.home{display:inline-block;margin-top:6px;color:var(--sage-ink);font-weight:700;text-decoration:none;font-size:15px;}
  .fine{font-size:12.5px;color:rgba(61,75,101,.6);margin-top:16px;font-weight:600;letter-spacing:.02em;}
</style></head>
<body><div class="card">${inner}</div></body></html>`;

  if (!valid) {
    return shell(`
    <div class="badge">⚠️</div>
    <h1>This link isn't valid</h1>
    <p>This confirmation link is invalid or has expired. If you entered, re-open the most recent email from Peace and tap the confirm button there.</p>
    <a class="home" href="${home}">Back to the giveaway</a>`);
  }

  return shell(`
    <form method="POST" action="/api/giveaway-verify">
      <div class="badge">🎄</div>
      <h1>Confirm your entry</h1>
      <p>You're one tap from locking in your entry to win the $3,000 holiday home transformation.</p>
      <input type="hidden" name="e" value="${escapeHtml(email)}">
      <input type="hidden" name="t" value="${escapeHtml(token)}">
      <button type="submit">Confirm my entry</button>
      <div class="fine">Peace Services · Coachella Valley</div>
    </form>`);
}

export default async function handler(req, res) {
  const dest = (params) => `${SITE_ORIGIN}${LANDING_PATH}?${params}`;

  // GET: show the confirm page. No state change — this is what scanners hit.
  if (req.method === 'GET') {
    const email = String((req.query && req.query.e) || '').trim();
    const token = String((req.query && req.query.t) || '').trim();
    let valid = false;
    try { valid = !!(email && token && safeEqual(token, verifyToken(email))); } catch { valid = false; }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).send(confirmPage({ email, token, valid }));
  }

  // POST: a human pressed the button — do the actual confirmation.
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};
    const email = String(body.e || '').trim();
    const token = String(body.t || '').trim();

    let valid = false;
    try { valid = !!(email && token && safeEqual(token, verifyToken(email))); } catch { valid = false; }
    if (!valid) {
      return res.redirect(302, dest('verify=fail'));
    }

    // Flip Verified, retrying transient failures. Never report success unless the
    // write actually landed — otherwise we'd show "confirmed" while the entry
    // stays out of the drawing. On persistent failure send them to a retry state.
    const code = referralCode(email);
    let done = false;
    for (let attempt = 0; attempt < 3 && !done; attempt++) {
      try {
        const rec = await findByCode(code);
        if (!rec || (rec.fields && rec.fields.Verified)) { done = true; break; }
        await updateEntry(rec.id, { Verified: true });
        done = true;
      } catch {
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
    }
    if (!done) {
      return res.redirect(302, dest(`verify=retry&e=${encodeURIComponent(email)}`));
    }
    return res.redirect(302, dest(`verified=1&e=${encodeURIComponent(email)}`));
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'Method not allowed.' });
}
