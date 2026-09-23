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

// Init a pixel and fire its PageView. Uses the standard track() call (the same
// one the giveaway pixel uses and which we've confirmed fires). Only the bird
// pixel is init'd on the bird page, so this stays scoped to it in practice.
export function initPixel(id) {
  try {
    loadFbevents();
    if (window.fbq) { window.fbq('init', id); window.fbq('track', 'PageView'); }
  } catch { /* ignore */ }
}

// Fire a Lead. Ensures the pixel is loaded + registered first, so it fires even
// if the quote form was opened from a page that didn't already init this pixel.
export function trackLead(id) {
  try {
    loadFbevents();
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', id);
      window.fbq('track', 'Lead');
    }
  } catch { /* ignore */ }
}
