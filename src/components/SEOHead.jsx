import { useEffect } from "react";
import { DOMAIN, BUSINESS_NAME } from "../data/siteData";

/**
 * SEOHead — updates document <head> for each route.
 * Since this is a client-side React app (not SSR), this sets meta tags
 * dynamically for social sharing and search engine crawlers that execute JS.
 *
 * For full SSR SEO, migrate to Next.js or Astro in the future.
 */
export default function SEOHead({ title, description, path = "/", schema }) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    setMeta("description", description);

    // Canonical
    setLink("canonical", `${DOMAIN}${path}`);

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", `${DOMAIN}${path}`, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", BUSINESS_NAME, "property");

    // Twitter
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");

    // Schema.org structured data
    if (schema) {
      let scriptEl = document.getElementById("page-schema");
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "page-schema";
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    }

    return () => {
      const scriptEl = document.getElementById("page-schema");
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, path, schema]);

  return null;
}

function setMeta(name, content, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
