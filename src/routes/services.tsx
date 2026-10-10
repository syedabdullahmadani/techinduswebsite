import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, ContactCTA } from "@/components/site/shared";
import { services } from "@/lib/site-data";
import { serviceImages } from "@/components/site/reference-sections";
import { pageHead } from "@/lib/seo";
import { ServiceEnquiry } from "@/components/site/service-enquiry";
import meeting from "@/assets/contact-meeting.webp.asset.json";
export const Route = createFileRoute("/services")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Our Services | Techindus Business Solutions",
      "Explore Techindus business advisory, DPR consulting, outsourced sales, offshore customer support, and back-office setup services.",
      "/services",
      "Services",
    ),
  component: Services,
});
function Services() {
  return (
    <div className="services-page">
      <section className="experience-hero">
        <img
          src={meeting.url}
          width={1600}
          height={1067}
          fetchPriority="high"
          alt="Illustrative professionals discussing business plans in a meeting room"
        />
        <div className="container">
          <span className="eyebrow">Our services</span>
          <h1>
            The capabilities
            <br />
            <span>your business needs.</span>
          </h1>
          <p>
            Business advisory, outsourced sales, and offshore support — delivered from India, shaped
            around your requirements.
          </p>
          <nav className="service-jump-links" aria-label="Explore services">
            {services.map((service) => (
              <Link
                key={service.id}
                to="/services"
                hash={service.id === "offshore-support" ? "customer-support" : service.id}
              >
                {service.title}
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <div className="container">
        {services.map((service, index) => (
          <section
            className="service-detail"
            key={service.id}
            id={service.id === "offshore-support" ? "customer-support" : service.id}
          >
            <div className="service-story-heading">
              <span className="eyebrow">Our capabilities</span>
              <span className="service-icon">
                <service.icon strokeWidth={1.5} />
              </span>
              <h2>{service.title}</h2>
              <p>
                {
                  [
                    "Clarify the challenge. Find a practical way forward.",
                    "Bring outreach, pipeline management, and daily sales operations together.",
                    "Build the operational support your business needs from Hyderabad.",
                  ][index]
                }
              </p>
            </div>
            <div>
              <img
                className="detail-service-photo"
                src={serviceImages[index]?.url}
                width={900}
                height={600}
                loading="lazy"
                alt={`Illustrative ${service.title.toLowerCase()} photograph`}
              />
              <p>{service.description}</p>
              <ul className="service-list">
                {service.items.map((item) => (
                  <li key={item}>
                    <Check size={17} />
                    {item}
                  </li>
                ))}
              </ul>
              <ServiceEnquiry topic={service.title} />
            </div>
          </section>
        ))}
      </div>
      <ContactCTA title="The right support starts with a conversation." />
    </div>
  );
}
