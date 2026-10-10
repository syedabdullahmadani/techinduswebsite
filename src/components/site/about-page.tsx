import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CredibilityStrip, serviceImages } from "./reference-sections";
import { services, philosophy } from "@/lib/site-data";
import { aboutOverview, aboutApproach, aboutServiceDescriptions } from "@/lib/about-data";
import meeting from "@/assets/about-meeting.webp.asset.json";
import building from "@/assets/about-building.webp.asset.json";
import summit from "@/assets/about-summit.webp.asset.json";

export function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <img
          src={meeting.url}
          width={1600}
          height={1067}
          fetchPriority="high"
          alt="Illustrative photograph of professionals collaborating during a business meeting"
        />
        <div className="container about-hero-inner">
          <div className="about-hero-copy">
            <span className="eyebrow">ABOUT TECHINDUS</span>
            <h1>
              Practical Expertise.
              <br />
              <span>Global Ambitions.</span>
            </h1>
            <p>
              We help businesses solve complex challenges, grow sales, and run leaner operations —
              with hands-on delivery from Hyderabad, India.
            </p>
          </div>
          <div
            className="about-hero-editorial"
            aria-label="Ideas, Partnership, Execution, Global Impact"
          >
            Ideas
            <br />
            Partnership
            <br />
            Execution
            <br />
            Global Impact
          </div>
        </div>
      </section>
      <section className="section about-company">
        <div className="container about-company-grid">
          <div>
            <span className="eyebrow">COMPANY OVERVIEW</span>
            <h2>
              A global service provider
              <br />
              from <span>Hyderabad, India.</span>
            </h2>
            {aboutOverview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="about-building">
            <img
              src={building.url}
              width={1400}
              height={933}
              loading="lazy"
              alt="Illustrative modern commercial office building; not a photograph of Techindus premises"
            />
            <div className="about-location-note">
              <MapPin aria-hidden="true" />
              <div>
                <strong>Hyderabad, India</strong>
                <p>Our home base for global delivery.</p>
              </div>
            </div>
          </div>
        </div>
        <CredibilityStrip />
      </section>
      <section className="about-philosophy">
        <img
          src={summit.url}
          width={1600}
          height={1067}
          loading="lazy"
          alt="A person looking across mountain peaks at sunrise"
        />
        <div className="container">
          <div className="about-philosophy-copy">
            <span className="eyebrow">OUR PHILOSOPHY</span>
            <span className="quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>{philosophy}</blockquote>
            <span className="quote-rule" />
          </div>
        </div>
      </section>
      <section className="section about-approach">
        <div className="container">
          <div className="reference-section-heading">
            <div>
              <span className="eyebrow">OUR APPROACH</span>
              <h2>
                A problem-first approach
                <br />
                to <span>real business outcomes.</span>
              </h2>
            </div>
            <p>
              Every business has unique challenges. We start by understanding what you need to
              achieve, then bring the right capabilities, people, and processes to make it work —
              without the need for you to build everything in-house.
            </p>
          </div>
          <div className="about-approach-grid">
            {aboutApproach.map((item) => (
              <article className="about-approach-block" key={item.title}>
                <span className="service-icon">
                  <item.icon aria-hidden="true" strokeWidth={1.5} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section about-services">
        <div className="container">
          <div className="reference-section-heading">
            <div>
              <span className="eyebrow">OUR SERVICES</span>
              <h2>
                Three integrated <span>service lines.</span>
              </h2>
            </div>
            <p>
              We work across three key areas to help businesses solve problems, grow, and operate
              more efficiently.
            </p>
          </div>
          <div className="reference-service-grid">
            {services.map((service, index) => (
              <article className="reference-service-card" key={service.id}>
                <div className="service-photo">
                  <img
                    src={serviceImages[index]?.url}
                    width={900}
                    height={600}
                    loading="lazy"
                    alt={
                      [
                        "Business analysis and strategic planning workspace",
                        "Professionals discussing sales and business delivery",
                        "Collaborative customer support and back-office workspace",
                      ][index]
                    }
                  />
                </div>
                <div className="service-card-copy">
                  <h3>{service.title}</h3>
                  <p>{aboutServiceDescriptions[index]}</p>
                  <Link
                    className="text-link"
                    to="/services"
                    hash={service.id === "offshore-support" ? "customer-support" : service.id}
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn More
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="reference-contact about-contact">
        <img
          src={building.url}
          width={1400}
          height={933}
          loading="lazy"
          alt="Modern glass architecture, illustrative of a business setting"
        />
        <div className="container">
          <div className="reference-contact-copy">
            <span className="eyebrow">HAVE A BUSINESS CHALLENGE TO SOLVE?</span>
            <h2>
              Let's talk about <span>your goals.</span>
            </h2>
            <p>
              Whether you're exploring advisory, outsourced sales, or offshore support, we'd love to
              hear from you and discuss how Techindus can help.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/contact">
                Get in Touch
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
