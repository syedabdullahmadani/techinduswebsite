import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/site/about-page";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "About Techindus | Global Business Support from India",
      "Learn about Techindus, our six years of delivery experience, client-first philosophy, and business advisory, outsourced sales, and offshore support capabilities.",
      "/about",
      "About",
    ),
  component: AboutPage,
});
