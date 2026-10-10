import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ApproachStory } from "@/components/site/approach-story";
import { pageHead } from "@/lib/seo";
import { publicContentOptions } from "@/lib/cms/queries";
import {
  ReferenceHero,
  CredibilityStrip,
  AboutPreview,
  ImageServiceCards,
  PhilosophyFeature,
  ReferenceCareers,
  ReferenceContactCTA,
} from "@/components/site/reference-sections";
export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentOptions),
  head: () =>
    pageHead(
      "Techindus | Global Business Advisory, Sales & Support",
      "Global ambitions, delivered from India. Techindus helps businesses solve problems, grow sales, and run leaner operations from Hyderabad.",
      "/",
    ),
  component: Home,
});
function Home() {
  const { data } = useSuspenseQuery(publicContentOptions);
  return (
    <>
      <ReferenceHero />
      <CredibilityStrip />
      <AboutPreview />
      <section className="section services-section reference-services">
        <div className="container">
          <div className="reference-section-heading">
            <div>
              <span className="eyebrow">OUR SERVICES</span>
              <h2>
                Three ways we help
                <br />
                <span>businesses move forward.</span>
              </h2>
            </div>
            <p>
              Different challenges. One trusted partner.
              <br />
              Our three service lines are designed to help you solve key business needs without
              building everything in-house.
            </p>
          </div>
          <ImageServiceCards />
        </div>
      </section>
      <PhilosophyFeature />
      <ApproachStory />
      <ReferenceCareers jobs={data.jobs} />
      <ReferenceContactCTA />
    </>
  );
}
