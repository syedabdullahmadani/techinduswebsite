import { useState } from "react";
import { ApplicationForm } from "./application-form";
import { Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export function JobListing({ job, preview = false }: { job: Job; preview?: boolean }) {
  const [applying, setApplying] = useState(false);
  return (
    <article className="job-card">
      <div className="job-card-header">
        <div>
          <span className="eyebrow">{job.department || "CAREER OPPORTUNITY"}</span>
          <h2>{job.title}</h2>
          <span className="job-badge">{job.work_location}</span>
        </div>
        {!preview && (
          <div className="admin-actions">
            <Button
              size="lg"
              aria-expanded={applying}
              aria-controls={`application-${job.id}`}
              onClick={() => setApplying(!applying)}
            >
              {applying ? "Close application" : "Apply online"}
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href={`mailto:${job.application_email}?subject=${encodeURIComponent(`Application – ${job.title.split(" — ")[0]}`)}&body=${encodeURIComponent(`Hello Techindus,\n\nI would like to apply for the ${job.title} role.\n\nName:\nPhone:\nExperience:\n\nPlease find my resume attached.\n\nThank you,`)}`}
              >
                <Mail />
                Apply via Email
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        )}
      </div>
      <dl className="job-facts">
        {[
          ["Workplace", job.work_location],
          ["Shift (IST)", job.shift],
          ["Experience", job.experience],
          ["Employment", job.employment_type],
          ["Openings", job.openings],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <h3>About the role</h3>
      <p className="preserve-lines">{job.description}</p>
      {!preview && (
        <p className="job-note">
          Apply online to send your details to our team, or attach your resume when applying by
          email.
        </p>
      )}
      {!preview && applying && (
        <div id={`application-${job.id}`}>
          <ApplicationForm jobId={job.id} />
        </div>
      )}
    </article>
  );
}
