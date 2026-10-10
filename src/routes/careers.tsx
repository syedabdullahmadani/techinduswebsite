import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site/shared";
import { JobListing } from "@/components/site/job-listing";
import { pageHead } from "@/lib/seo";
import { publicContentOptions } from "@/lib/cms/queries";
import { Link } from "@tanstack/react-router";
import { ArrowRight, House, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import meeting from "@/assets/contact-meeting.webp.asset.json";
export const Route = createFileRoute("/careers")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentOptions),
  head: () =>
    pageHead(
      "Careers at Techindus | Sales Executive Opportunities",
      "Explore career opportunities at Techindus, including our current Sales Executive — Outbound Sales opening.",
      "/careers",
      "Careers",
    ),
  errorComponent: () => (
    <div className="container section" role="alert">
      Career opportunities could not be loaded. Please refresh or contact our team.
    </div>
  ),
  notFoundComponent: () => <div>Careers not found.</div>,
  component: Careers,
});
function Careers() {
  const { data } = useSuspenseQuery(publicContentOptions);
  const salesOpen = data.jobs.some((job) => job.title === "Sales Executive — Outbound Sales");
  return (
    <div className="careers-page">
      <section className="experience-hero">
        <img
          src={meeting.url}
          width={1600}
          height={1067}
          fetchPriority="high"
          alt="Illustrative collaborative work environment; not Techindus employees or premises"
        />
        <div className="container">
          <span className="eyebrow">Careers at Techindus</span>
          <h1>
            Your next chapter
            <br />
            <span>starts here.</span>
          </h1>
          <p>
            Explore opportunities across our service lines and bring your skills to work delivered
            from India.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/careers" hash="opportunities">
              View open roles
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
      {salesOpen && (
        <section className="career-context">
          <div className="container">
            <p>Our current outbound sales opportunity</p>
            <div>
              {[
                {
                  icon: House,
                  title: "Work from home",
                  text: "Remote work for the current sales role.",
                },
                {
                  icon: MessageSquare,
                  title: "International conversations",
                  text: "A voice-based role supporting international customers.",
                },
                {
                  icon: Users,
                  title: "Freshers welcome",
                  text: "The current opening welcomes 0–2 years of experience.",
                },
              ].map((item) => (
                <article key={item.title} data-reveal="text">
                  <item.icon aria-hidden="true" />
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section" id="opportunities">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Current opportunities</span>
              <h2>
                Great work starts
                <br />
                with the right people.
              </h2>
            </div>
            <p>
              {data.jobs.length} {data.jobs.length === 1 ? "opportunity" : "opportunities"}
            </p>
          </div>
          {data.jobs.length ? (
            data.jobs.map((job) => <JobListing key={job.id} job={job} />)
          ) : (
            <p>
              There are no open positions at the moment. Please check back for future opportunities.
            </p>
          )}
        </div>
      </section>
      <section className="career-closing">
        <div className="container">
          <h2>See a role that fits?</h2>
          <p>Apply online above, or email your resume using the application link for the role.</p>
          <Button asChild variant="outline">
            <Link to="/careers" hash="opportunities">
              Explore current opportunities
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
