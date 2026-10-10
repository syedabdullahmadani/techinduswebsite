import { contact } from "./site-data";
export const siteOrigin = import.meta.env["VITE_SITE_URL"] || "https://techindus.co.in";

export function privateHead(label: string, path: string) {
  const head = pageHead(
    `${label} | Techindus`,
    "Private Techindus website management.",
    path,
    label,
  );
  return {
    ...head,
    meta: [...head.meta, { name: "robots", content: "noindex, nofollow" }],
    scripts: [],
  };
}

export function pageHead(title: string, description: string, path: string, label?: string) {
  const url = new URL(path, siteOrigin).href;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts:
      path === "/"
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    name: "Techindus",
                    url: siteOrigin,
                    description:
                      "Global business advisory, outsourced sales, and offshore support from Hyderabad, India.",
                    email: contact.email,
                    telephone: contact.tel,
                    location: { "@type": "Place", name: "Hyderabad, India" },
                  },
                  { "@type": "WebSite", name: "Techindus", url: siteOrigin },
                ],
              }),
            },
          ]
        : [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: new URL("/", siteOrigin).href,
                  },
                  { "@type": "ListItem", position: 2, name: label, item: url },
                ],
              }),
            },
          ],
  };
}
