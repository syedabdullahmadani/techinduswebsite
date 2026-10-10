import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
type Applicant = Database["public"]["Tables"]["career_applicants"]["Row"];
export function Applicants({
  items,
  busy,
  onStatus,
  onDelete,
}: {
  items: Applicant[];
  busy: boolean;
  onStatus: (id: string, status: Applicant["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const applicant = items.find((item) => item.id === selected);
  return (
    <div className="enquiries-layout">
      <div className="admin-list">
        {items.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="enquiry-row"
            onClick={() => setSelected(item.id)}
          >
            <span>
              <strong>{item.name}</strong>
              <span>{item.job_title}</span>
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </span>
            <span className={`status status-${item.status}`}>{item.status}</span>
          </Button>
        ))}
        {!items.length && <p>No applications received yet.</p>}
      </div>
      {applicant && (
        <article className="enquiry-message">
          <span className="eyebrow">{applicant.job_title}</span>
          <h2>{applicant.name}</h2>
          <a href={`mailto:${applicant.email}`}>{applicant.email}</a>
          <p>
            <a href={`tel:${applicant.phone.replace(/[^+\d]/g, "")}`}>{applicant.phone}</a>
            <br />
            Experience: {applicant.experience}
          </p>
          <p>{applicant.message}</p>
          {applicant.resume_url && (
            <a href={applicant.resume_url} target="_blank" rel="noopener noreferrer">
              Open resume
            </a>
          )}
          <div className="form-field">
            <label htmlFor="applicant-status">Application status</label>
            <select
              id="applicant-status"
              value={applicant.status}
              disabled={busy}
              onChange={(e) => onStatus(applicant.id, e.target.value)}
            >
              {["new", "reviewed", "shortlisted", "rejected", "archived"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => {
              if (window.confirm("Permanently delete this application? This cannot be undone."))
                onDelete(applicant.id);
            }}
          >
            <Trash2 />
            Delete application
          </Button>
        </article>
      )}
    </div>
  );
}
