import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "./job-listing";
export function CareersPreview({ jobs }: { jobs: Job[] }) {
  const job = jobs[0];
  return (
    <section className="careers-preview">
      <div className="container careers-preview-inner">
        <div>
          <span className="eyebrow">GROW WITH TECHINDUS</span>
          <h2>{job ? job.title : "Your next chapter."}</h2>
          <p>
            {job
              ? `${job.work_location} · ${job.experience} · ${job.employment_type}`
              : "Explore current opportunities with our team."}
          </p>
          {job && (
            <p className="career-secondary">
              Shift: {job.shift} · {job.openings} openings
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="lg">
          <Link to="/careers">
            Explore Careers
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
