import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/contact-page";
import { pageHead } from "@/lib/seo";
import { publicContentOptions } from "@/lib/cms/queries";
import { services } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): { topic?: string } =>
    typeof search["topic"] === "string" &&
    services.some((service) => service.title === search["topic"])
      ? { topic: search["topic"] }
      : {},
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentOptions),
  head: () =>
    pageHead(
      "Contact Techindus | Discuss Your Business Requirements",
      "Contact Techindus to discuss business advisory, outsourced sales, offshore customer support, and back-office requirements.",
      "/contact",
      "Contact",
    ),
  component: ContactPage,
});
