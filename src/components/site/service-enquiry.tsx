import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServiceEnquiry({ topic }: { topic: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <aside className="service-enquiry">
      <div>
        <h3>Exploring this service for your business?</h3>
        <Button asChild variant="link">
          <Link to="/contact" search={{ topic }}>
            Discuss Your Requirements
            <ArrowRight size={17} />
          </Link>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Dismiss enquiry invitation for ${topic}`}
        onClick={() => setDismissed(true)}
      >
        <X size={17} />
      </Button>
    </aside>
  );
}
