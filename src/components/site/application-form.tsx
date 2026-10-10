import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applicationSchema } from "@/lib/cms/schemas";
import { submitApplication } from "@/lib/cms/functions";
export function ApplicationForm({ jobId }: { jobId: string }) {
  const send = useServerFn(submitApplication);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = applicationSchema.safeParse({
      ...Object.fromEntries(new FormData(form)),
      job_id: jobId,
    });
    if (!result.success) {
      setError(result.error.issues.map((i) => `${i.path.join(" ")}: ${i.message}`).join(" · "));
      return;
    }
    setBusy(true);
    setError("");
    try {
      await send({ data: result.data });
      setSent(true);
      form.reset();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Your application could not be saved. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (sent)
    return (
      <div className="form-feedback" role="status">
        Your application has been received and saved for Techindus to review.
      </div>
    );
  return (
    <form className="application-form" onSubmit={submit}>
      <h3>Apply for this role</h3>
      <div className="editor-fields">
        {[
          { name: "name", label: "Full name", type: "text", max: 100 },
          { name: "email", label: "Email", type: "email", max: 254 },
          { name: "phone", label: "Phone", type: "tel", max: 30 },
          { name: "experience", label: "Experience", type: "text", max: 200 },
        ].map((field) => (
          <div className="form-field" key={field.name}>
            <label htmlFor={`${jobId}-${field.name}`}>{field.label}</label>
            <input
              id={`${jobId}-${field.name}`}
              name={field.name}
              type={field.type}
              required
              maxLength={field.max}
            />
          </div>
        ))}
      </div>
      <div className="form-field">
        <label htmlFor={`${jobId}-resume`}>Resume link (optional)</label>
        <input
          id={`${jobId}-resume`}
          name="resume_url"
          type="url"
          placeholder="https://"
          maxLength={1000}
        />
      </div>
      <div className="form-field">
        <label htmlFor={`${jobId}-message`}>Message (optional)</label>
        <textarea id={`${jobId}-message`} name="message" maxLength={3000} />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${jobId}-website`}>Website</label>
        <input id={`${jobId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        <Send />
        {busy ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
