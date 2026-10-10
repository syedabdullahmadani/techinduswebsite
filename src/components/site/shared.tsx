import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { philosophy, services } from "@/lib/site-data";
import { PhilosophyFeature, ImageServiceCards } from "./reference-sections";
import logo from "@/assets/techindus-logo.png.asset.json";

export function Wordmark() {
  return <img className="brand-logo" src={logo.url} width={678} height={307} alt="Techindus" />;
}
export function ContactCTA({
  title = "Let's discuss how Techindus can help your business.",
  text = "Tell us what you need. Together, we can explore the right approach to advisory, outsourced sales, or offshore support.",
  button = "Get in Touch",
}: {
  title?: string;
  text?: string;
  button?: string;
}) {
  return (
    <section className="contact-band">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">LET’S WORK TOGETHER</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Button asChild variant="hero" size="lg">
          <Link to="/contact">
            {button}
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
export function Highlights() {
  return (
    <div className="highlights container">
      <div>
        <strong>
          6<span>+</span> Years
        </strong>
        <span>In Business</span>
      </div>
      <div>
        <strong>3 Service Lines</strong>
        <span>Integrated Business Support</span>
      </div>
      <div>
        <strong className="global-stat">
          <Globe2 />
          Global Delivery
        </strong>
        <span>Capabilities Delivered from India</span>
      </div>
    </div>
  );
}
export function ServiceCards() {
  return <ImageServiceCards />;
}
export function Philosophy({ full = false }: { full?: boolean }) {
  return <PhilosophyFeature />;
}
export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <span className="eyebrow">{eyebrow.toUpperCase()}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
