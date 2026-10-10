import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Layers3,
  Globe2,
  MapPin,
  Lightbulb,
  Clock3,
  BriefcaseBusiness,
  Users,
  House,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, philosophy } from "@/lib/site-data";
import type { Job } from "./job-listing";
import globe from "@/assets/global-network.jpg";
import meeting from "@/assets/meeting.webp.asset.json";
import advisory from "@/assets/advisory.webp.asset.json";
import sales from "@/assets/sales.webp.asset.json";
import support from "@/assets/support.webp.asset.json";
import mountain from "@/assets/mountain.webp.asset.json";
export const serviceImages = [advisory, sales, support];
export function ReferenceHero() {
  return (
    <section className="reference-hero">
      <img
        className="reference-globe"
        src={globe}
        alt="Decorative connected globe with India illuminated in blue"
        width={1536}
        height={1024}
        fetchPriority="high"
      />
      <div className="container reference-hero-inner">
        <div className="reference-hero-copy">
          <span className="hero-eyebrow">BUSINESS SUPPORT FROM INDIA. FOR A GLOBAL TOMORROW.</span>
          <h1>
            <span className="hero-line">Global ambitions,</span>
            <span className="hero-line reference-accent">delivered from India.</span>
          </h1>
          <p>
            We help businesses around the world solve problems, grow sales, and run leaner
            operations — backed by six years of hands-on delivery from Hyderabad, India.
          </p>
          <div className="hero-buttons">
            <Button asChild variant="hero" size="lg">
              <Link to="/contact">
                Get in Touch
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="lg">
              <Link to="/services">View Services</Link>
            </Button>
          </div>
        </div>
        <div className="globe-annotations">
          <div>
            <MapPin />
            <span>
              <strong>Hyderabad, India</strong>
              <small>Delivering global business support</small>
            </span>
          </div>
          <div>
            <CalendarDays />
            <span>
              <strong>6+ years</strong>
              <small>of hands-on delivery</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
export function CredibilityStrip() {
  return (
    <div className="container credibility-strip">
      {[
        { icon: CalendarDays, title: "6+ Years", detail: "In Business" },
        { icon: Layers3, title: "3 Service Lines", detail: "Integrated Business Support" },
        { icon: Globe2, title: "Global Delivery", detail: "Capabilities Delivered from India" },
      ].map((item) => (
        <div key={item.title}>
          <item.icon aria-hidden="true" strokeWidth={1.5} />
          <span>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
export function AboutPreview() {
  return (
    <section className="section reference-about">
      <div className="container reference-about-grid">
        <div>
          <span className="eyebrow">WHO WE ARE</span>
          <h2>
            Practical solutions
            <br />
            for <span>real business needs.</span>
          </h2>
          <p>
            Techindus is a global service provider headquartered in Hyderabad, India. We work with
            companies that need something done and don't want the overhead of building that
            capability in-house — whether that means strategic advisory, outsourced sales, or
            customer support and back-office operations.
          </p>
          <Button asChild size="lg">
            <Link to="/about">
              Learn More About Us
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="about-photo">
          <img
            src={meeting.url}
            width={1200}
            height={800}
            loading="lazy"
            alt="Illustrative modern business meeting space with city views"
          />
          <div className="about-photo-note">
            <Lightbulb strokeWidth={1.5} />
            <strong>Turning business challenges into practical solutions.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
export function ImageServiceCards() {
  return (
    <div className="reference-service-grid">
      {services.map((service, i) => {
        const image = serviceImages[i];
        return (
          <article className="reference-service-card" key={service.id}>
            <div className="service-photo">
              <img
                src={image?.url}
                alt={
                  i === 0
                    ? "Illustrative business analytics and planning workspace"
                    : i === 1
                      ? "Illustrative professionals discussing business together"
                      : "Illustrative collaborative customer operations team"
                }
                width={900}
                height={600}
                loading="lazy"
              />
              <span className="service-photo-icon">
                <service.icon strokeWidth={1.5} />
              </span>
            </div>
            <div className="service-card-copy">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link
                className="text-link"
                to="/services"
                hash={service.id === "offshore-support" ? "customer-support" : service.id}
                aria-label={`Learn more about ${service.title}`}
              >
                Learn More
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
export function PhilosophyFeature() {
  return (
    <section className="reference-philosophy">
      <div className="philosophy-photo">
        <img
          src={mountain.url}
          alt="Mountain peaks reaching into a thoughtful sunrise landscape"
          loading="lazy"
          width={1200}
          height={800}
        />
      </div>
      <div className="reference-quote">
        <span className="eyebrow">OUR PHILOSOPHY</span>
        <span className="quote-mark" aria-hidden="true">
          “
        </span>
        <blockquote>{philosophy}</blockquote>
        <span className="quote-rule" />
      </div>
    </section>
  );
}
export function ReferenceCareers({ jobs }: { jobs: Job[] }) {
  return (
    <section className="section reference-careers">
      <div className="container">
        <div className="reference-section-heading">
          <div>
            <span className="eyebrow">CAREERS</span>
            <h2>
              We're growing.
              <br />
              <span>Be part of what's next.</span>
            </h2>
          </div>
          <p>
            We're growing across multiple service lines. Here's what we're currently hiring for.
          </p>
        </div>
        {jobs.length ? (
          jobs.map((job) => (
            <article key={job.id} className="reference-job">
              <h3>{job.title}</h3>
              <div className="reference-job-facts">
                {[
                  { icon: House, text: job.work_location },
                  { icon: Clock3, text: job.shift },
                  { icon: CalendarDays, text: job.experience },
                  { icon: BriefcaseBusiness, text: job.employment_type },
                  { icon: Users, text: `${job.openings} Openings` },
                ].map((fact) => (
                  <span key={fact.text}>
                    <fact.icon size={16} />
                    {fact.text}
                  </span>
                ))}
              </div>
              <div className="reference-job-bottom">
                <p>{job.description}</p>
                <Button asChild size="lg">
                  <Link to="/careers">
                    Explore Careers
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </article>
          ))
        ) : (
          <p>
            There are no open positions at the moment. Please check back for future opportunities.
          </p>
        )}
      </div>
    </section>
  );
}
export function ReferenceContactCTA() {
  return (
    <section className="reference-contact">
      <img
        src={sales.url}
        alt="Illustrative business professionals in conversation"
        width={900}
        height={600}
        loading="lazy"
      />
      <div className="container">
        <div className="reference-contact-copy">
          <span className="eyebrow">LET'S CONNECT</span>
          <h2>
            Let's discuss how Techindus
            <br />
            <span>can help your business.</span>
          </h2>
          <p>
            Whether you're exploring advisory, outsourced sales, or offshore support, we'd love to
            hear from you.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">
              Get in Touch
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
