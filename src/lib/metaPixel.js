// Shared Meta Pixel helpers.
//
// Loads Meta's fbevents library once (idempotent), then each caller inits its
// own pixel and fires events scoped to THAT pixel via trackSingle — so, e.g.,
// the bird-proofing pixel never picks up solar/window traffic.

export const BIRD_PIXEL_ID = '2307187473388123';

function loadFbevents() {
  if (typeof window === 'undefined' || window.fbq) return;
  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
}

// Init a pixel and fire a PageView scoped to that pixel only.
export function initPixel(id) {
  try {
    loadFbevents();
    if (window.fbq) { window.fbq('init', id); window.fbq('trackSingle', id, 'PageView'); }
  } catch { /* ignore */ }
}

// Fire a Lead on a specific pixel only (no cross-firing to other loaded pixels).
export function trackSingleLead(id) {
  try { if (typeof window !== 'undefined' && window.fbq) window.fbq('trackSingle', id, 'Lead'); } catch { /* ignore */ }
}
