import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { aboutApproach } from "@/lib/about-data";
import { Button } from "@/components/ui/button";

export function ApproachStory() {
  return (
    <section className="section approach-story">
      <div className="container approach-story-grid">
        <div className="approach-story-heading" data-reveal="text">
          <span className="eyebrow">Our approach</span>
          <h2>
            Start with the problem.
            <br />
            <span>Build the right response.</span>
          </h2>
          <p>
            Different businesses need different answers. We bring advisory, sales, and operational
            capabilities together around what you need to achieve.
          </p>
          <Button asChild variant="link">
            <Link to="/contact">
              Talk through your requirements
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
        <div className="approach-story-steps">
          {aboutApproach.map((item) => (
            <article key={item.title} data-reveal="text">
              <item.icon aria-hidden="true" strokeWidth={1.5} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
