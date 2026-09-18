// lib/giveaway.js
//
// Shared server-side helpers for the Peace holiday-giveaway backend.
// The Airtable base is the entry ledger + referral engine. All three API
// functions (signup / status / verify) import from here.
//
// Referral codes are derived deterministically from the email (same email ->
// same code), so we never need a read-before-write to know someone's code, and
// re-entries can't create duplicates. The verify token is an HMAC of the email
// so the verification link can't be forged and nothing needs to be stored.
//
// Env vars (set in Vercel):
//   AIRTABLE_TOKEN   - personal access token, scoped to the giveaway base (read+write)
//   AIRTABLE_BASE_ID - the giveaway base id (app...)
//   AIRTABLE_TABLE   - table name (defaults to "Entries")
//   VERIFY_SECRET    - random string used to sign verification links
//   SITE_ORIGIN      - public origin (defaults to https://www.peace-services.com)

import crypto from 'node:crypto';

export const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://www.peace-services.com').replace(/\/$/, '');
export const LANDING_PATH = '/holiday-giveaway';

const BASE_ID = () => process.env.AIRTABLE_BASE_ID;
const TABLE = () => process.env.AIRTABLE_TABLE || 'Entries';
const TOKEN = () => (process.env.AIRTABLE_TOKEN || '').trim();
const VERIFY_SECRET = () => process.env.VERIFY_SECRET || '';

// email -> short stable alphanumeric code, e.g. "3F9QP2A"
export function referralCode(email) {
  const h = crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex');
  return parseInt(h.slice(0, 10), 16).toString(36).toUpperCase();
}

// email -> unforgeable verification token (HMAC, first 32 hex chars)
export function verifyToken(email) {
  return crypto.createHmac('sha256', VERIFY_SECRET())
    .update(String(email).trim().toLowerCase())
    .digest('hex')
    .slice(0, 32);
}

export function shareLink(code) {
  return `${SITE_ORIGIN}${LANDING_PATH}?ref=${encodeURIComponent(code)}`;
}

export function verifyLink(email) {
  return `${SITE_ORIGIN}/api/giveaway-verify?e=${encodeURIComponent(email)}&t=${verifyToken(email)}`;
}

// timing-safe compare of two hex strings of equal length
export function safeEqual(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

// ── Airtable REST (with 429 retry/backoff) ──────────────────────────────────
async function airtable(method, path, body) {
  const token = TOKEN();
  const base = BASE_ID();
  if (!token) { const e = new Error('AIRTABLE_TOKEN missing'); e.code = 'NOT_SETUP'; throw e; }
  if (!base) { const e = new Error('AIRTABLE_BASE_ID missing'); e.code = 'NOT_SETUP'; throw e; }

  const url = `https://api.airtable.com/v0/${base}/${encodeURIComponent(TABLE())}${path}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 10000);
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        signal: ctl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (res.status === 429) { await new Promise((r) => setTimeout(r, 300 * (attempt + 1))); continue; }
    const text = await res.text();
    let json = {};
    try { json = text ? JSON.parse(text) : {}; } catch { json = {}; }
    if (!res.ok) {
      const e = new Error((json && json.error && (json.error.message || json.error)) || `Airtable ${res.status}`);
      e.status = res.status;
      throw e;
    }
    return json;
  }
  throw new Error('Airtable is busy right now. Please try again.');
}

// escape a value for a single-quoted filterByFormula string
const esc = (s) => String(s).replace(/'/g, "\\'");

export async function findByEmail(email) {
  const formula = `LOWER({Email})='${esc(String(email).trim().toLowerCase())}'`;
  const data = await airtable('GET', `?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`);
  return (data.records && data.records[0]) || null;
}

export async function countReferrals(code) {
  const formula = `{Referred By}='${esc(code)}'`;
  let count = 0;
  let offset;
  do {
    const q = `?filterByFormula=${encodeURIComponent(formula)}&fields%5B%5D=${encodeURIComponent('Referral Code')}&pageSize=100${offset ? `&offset=${offset}` : ''}`;
    const data = await airtable('GET', q);
    count += (data.records || []).length;
    offset = data.offset;
  } while (offset);
  return count;
}

export async function createEntry(fields) {
  const data = await airtable('POST', '', { records: [{ fields }], typecast: true });
  return data.records && data.records[0];
}

export async function updateEntry(id, fields) {
  const data = await airtable('PATCH', '', { records: [{ id, fields }], typecast: true });
  return data.records && data.records[0];
}
