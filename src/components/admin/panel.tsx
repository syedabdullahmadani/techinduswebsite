import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Inbox,
  Users,
  Settings,
  LogOut,
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Save,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { lockAdmin } from "@/lib/cms/admin-gate.functions";
import { Applicants } from "./applicants";
import { adminContentOptions } from "@/lib/cms/queries";
import {
  saveJob,
  setJobStatus,
  deleteJob,
  updateEnquiry,
  saveSettings,
  updateApplicant,
  deleteApplicant,
} from "@/lib/cms/functions";
import { jobSchema, settingsSchema } from "@/lib/cms/schemas";
import { JobListing, type Job } from "@/components/site/job-listing";
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Wordmark } from "@/components/site/shared";
const tabs = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/careers", label: "Careers Management", icon: BriefcaseBusiness },
  { to: "/admin/applicants", label: "Applicants Management", icon: Users },
  { to: "/admin/enquiries", label: "Enquiries Submitted", icon: Inbox },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;
export function AdminPanel({
  view,
}: {
  view: "overview" | "careers" | "applicants" | "enquiries" | "settings";
}) {
  const { data } = useSuspenseQuery(adminContentOptions);
  const query = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Partial<Job> | null>(null);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const logoutFn = useServerFn(lockAdmin),
    applicantUpdate = useServerFn(updateApplicant),
    applicantDelete = useServerFn(deleteApplicant);
  const statusSave = useServerFn(setJobStatus);
  const jobSave = useServerFn(saveJob),
    jobDelete = useServerFn(deleteJob),
    enquiryUpdate = useServerFn(updateEnquiry),
    settingsSave = useServerFn(saveSettings);
  async function refresh() {
    await query.invalidateQueries({ queryKey: ["admin-content"] });
    await query.invalidateQueries({ queryKey: ["public-content"] });
  }
  async function action(fn: () => Promise<unknown>, message: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      await refresh();
      setNotice(message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The change could not be saved.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    await query.cancelQueries();
    query.clear();
    await logoutFn();
    await navigate({ to: "/admin/login", replace: true });
  }
  function newJob() {
    setEditing({
      title: "",
      slug: "",
      department: "",
      employment_type: "Full-Time, Permanent",
      work_location: "",
      shift: "",
      experience: "",
      openings: "",
      description: "",
      application_email: data.settings.contact_email,
      status: "draft",
      date_posted: null,
      eligibility_country: null,
    });
    setPreview(false);
    setError("");
  }
  async function submitJob(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const parsed = jobSchema.safeParse(editing);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => `${i.path.join(" ")}: ${i.message}`).join(" · "));
      return;
    }
    await action(
      async () => {
        await jobSave({ data: parsed.data });
        setEditing(null);
      },
      parsed.data.status === "published"
        ? "Job published. It is now available on Careers."
        : parsed.data.status === "archived"
          ? "Listing closed. Existing applications are retained."
          : "Draft saved.",
    );
  }
  async function submitSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = settingsSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => `${i.path.join(" ")}: ${i.message}`).join(" · "));
      return;
    }
    await action(() => settingsSave({ data: parsed.data }), "Website settings updated.");
  }
  const enquiry = data.enquiries.find((e) => e.id === selected);
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" aria-label="Techindus home">
          <Wordmark />
        </Link>
        <span className="admin-label">WEBSITE MANAGEMENT</span>
        <nav aria-label="Administration">
          {tabs.map((t) => (
            <Link
              to={t.to}
              key={t.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "admin-active" }}
            >
              <t.icon size={18} />
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/">
            View website
            <ArrowUpRight size={16} />
          </Link>
          <Button variant="ghost" onClick={logout}>
            <LogOut />
            Sign out
          </Button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>Techindus / {view}</span>
          <span>{data.userEmail}</span>
        </header>
        <section className="admin-workspace">
          <div className="admin-heading">
            <div>
              <span className="eyebrow">CONTROL CENTRE</span>
              <h1>
                {view === "overview"
                  ? "Website overview"
                  : view === "careers"
                    ? "Career listings"
                    : view === "enquiries"
                      ? "Contact enquiries"
                      : view === "applicants"
                        ? "Applicants Management"
                        : "Website settings"}
              </h1>
              <p>
                {view === "overview"
                  ? "Your content and conversations, in one place."
                  : view === "careers"
                    ? "Create opportunities and manage what appears on the website."
                    : view === "enquiries"
                      ? "Private messages received through your contact form."
                      : view === "applicants"
                        ? "Review applications submitted through the Careers form."
                        : "Update the public contact information and footer."}
              </p>
            </div>
            {view === "careers" && (
              <Button onClick={newJob}>
                <Plus />
                New job
              </Button>
            )}
          </div>
          {notice && (
            <div className="admin-notice" role="status">
              {notice}
            </div>
          )}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          {view === "overview" && (
            <>
              <div className="admin-stats">
                {[
                  ["Published jobs", data.jobs.filter((j) => j.status === "published").length],
                  ["Applications", data.applicants.length],
                  ["New enquiries", data.enquiries.filter((e) => e.status === "new").length],
                ].map(([label, value]) => (
                  <article key={String(label)}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </article>
                ))}
              </div>
              <div className="admin-overview">
                <h2>Ready for your next update?</h2>
                <div>
                  <Link to="/admin/careers">
                    Manage career listings
                    <ArrowUpRight />
                  </Link>
                  <Link to="/admin/enquiries">
                    Review business enquiries
                    <ArrowUpRight />
                  </Link>
                  <Link to="/admin/applicants">
                    Review applicants
                    <ArrowUpRight />
                  </Link>
                  <Link to="/admin/settings">
                    Update website details
                    <ArrowUpRight />
                  </Link>
                </div>
                <p>Enquiries are saved here. Owner email notifications are not enabled.</p>
              </div>
            </>
          )}
          {view === "careers" && (
            <div className="admin-list">
              {data.jobs.map((job) => (
                <article className="admin-job" key={job.id}>
                  <div>
                    <span className={`status status-${job.status}`}>
                      {job.status === "archived"
                        ? "Closed"
                        : job.status === "published"
                          ? "Published"
                          : "Draft"}
                    </span>
                    <h2>{job.title}</h2>
                    <p>
                      {job.department} · {job.work_location} · {job.openings} openings
                    </p>
                  </div>
                  <div className="admin-actions">
                    <Button
                      variant="outline"
                      aria-label={`Edit ${job.title}`}
                      disabled={busy}
                      onClick={() => {
                        setEditing({ ...job });
                        setPreview(false);
                        setError("");
                      }}
                    >
                      <Pencil />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busy}
                      aria-label={`${job.status === "published" ? "Unpublish" : job.status === "archived" ? "Reopen" : "Publish"} ${job.title}`}
                      onClick={() => {
                        if (
                          job.status === "archived" &&
                          !window.confirm(
                            "Reopen this listing? It will appear on Careers and accept applications again.",
                          )
                        )
                          return;
                        action(
                          () =>
                            statusSave({
                              data: {
                                id: job.id,
                                status: job.status === "published" ? "draft" : "published",
                              },
                            }),
                          job.status === "published"
                            ? "Listing unpublished and saved as a draft."
                            : job.status === "archived"
                              ? "Listing reopened. Applications are now accepted."
                              : "Listing published on Careers.",
                        );
                      }}
                    >
                      {job.status === "published"
                        ? "Unpublish"
                        : job.status === "archived"
                          ? "Reopen"
                          : "Publish"}
                    </Button>
                    {job.status !== "archived" && (
                      <Button
                        variant="outline"
                        aria-label={`Close listing ${job.title}`}
                        disabled={busy}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Close this listing? It will disappear from Careers and stop accepting applications. Existing applications will be retained.",
                            )
                          )
                            action(
                              () => statusSave({ data: { id: job.id, status: "archived" } }),
                              "Listing closed. Existing applications are retained.",
                            );
                        }}
                      >
                        <Archive />
                        Close listing
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${job.title}`}
                      title="Delete job"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm("Permanently delete this job? This cannot be undone."))
                          action(() => jobDelete({ data: { id: job.id } }), "Job deleted.");
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </article>
              ))}
              {!data.jobs.length && <p>No job listings yet. Create your first opportunity.</p>}
            </div>
          )}
          {view === "applicants" && (
            <Applicants
              items={data.applicants}
              busy={busy}
              onStatus={(id, status) =>
                action(
                  () =>
                    applicantUpdate({
                      data: {
                        id,
                        status: status as
                          "new" | "reviewed" | "shortlisted" | "rejected" | "archived",
                      },
                    }),
                  "Application updated.",
                )
              }
              onDelete={(id) =>
                action(() => applicantDelete({ data: { id } }), "Application deleted.")
              }
            />
          )}
          {view === "enquiries" && (
            <div className="enquiries-layout">
              <div className="admin-list">
                {data.enquiries.map((item) => (
                  <Button
                    variant="ghost"
                    className="enquiry-row"
                    key={item.id}
                    onClick={() => setSelected(item.id)}
                  >
                    <span>
                      <strong>{item.name}</strong>
                      <span>{item.email}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </span>
                    <span className={`status status-${item.status}`}>{item.status}</span>
                  </Button>
                ))}
                {!data.enquiries.length && <p>No enquiries received yet.</p>}
              </div>
              {enquiry && (
                <article className="enquiry-message">
                  <span className="eyebrow">BUSINESS ENQUIRY</span>
                  <h2>{enquiry.name}</h2>
                  <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                  <p className="preserve-lines">{enquiry.message}</p>
                  <div className="admin-actions">
                    <Button
                      disabled={busy}
                      onClick={() =>
                        action(
                          () => enquiryUpdate({ data: { id: enquiry.id, status: "reviewed" } }),
                          "Enquiry marked reviewed.",
                        )
                      }
                    >
                      Mark reviewed
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm("Archive this enquiry?"))
                          action(
                            () => enquiryUpdate({ data: { id: enquiry.id, status: "archived" } }),
                            "Enquiry archived.",
                          );
                      }}
                    >
                      Archive
                    </Button>
                  </div>
                </article>
              )}
            </div>
          )}
          {view === "settings" && (
            <form
              className="admin-settings"
              onSubmit={submitSettings}
              key={data.settings.updated_at}
            >
              {[
                { name: "contact_email", label: "Contact email", type: "email" },
                { name: "contact_phone", label: "Contact phone", type: "text" },
                {
                  name: "whatsapp_number",
                  label: "WhatsApp number (country code, digits only)",
                  type: "text",
                },
                { name: "footer_description", label: "Footer description", type: "textarea" },
              ].map((field) => (
                <div className="form-field" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      defaultValue={data.settings.footer_description}
                      required
                      maxLength={500}
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      defaultValue={
                        field.name === "contact_email"
                          ? data.settings.contact_email
                          : field.name === "contact_phone"
                            ? data.settings.contact_phone
                            : data.settings.whatsapp_number
                      }
                      required
                    />
                  )}
                </div>
              ))}
              <Button type="submit" disabled={busy}>
                <Save />
                {busy ? "Saving…" : "Save settings"}
              </Button>
              <p>Changing the contact email does not enable automatic email notifications.</p>
              <div className="account-details">
                <h2>Administrator account</h2>
                <p>{data.userEmail}</p>
                <Button type="button" variant="outline" onClick={logout}>
                  <LogOut />
                  Sign out securely
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
      {editing && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditing(null);
              setError("");
            }
          }}
        >
          <DialogPortal>
            <DialogOverlay className="editor-overlay" />
            <DialogPrimitive.Content
              className="job-editor editor-dialog"
              aria-describedby={undefined}
            >
              <div className="editor-heading">
                <DialogTitle>{editing.id ? "Edit job" : "New job"}</DialogTitle>
                <div className="admin-actions">
                  <Button variant="outline" onClick={() => setPreview(!preview)}>
                    <Eye />
                    {preview ? "Edit" : "Preview"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close editor"
                    onClick={() => {
                      setEditing(null);
                      setError("");
                    }}
                  >
                    <X />
                  </Button>
                </div>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              {preview ? (
                <JobListing job={editing as Job} preview />
              ) : (
                <form onSubmit={submitJob}>
                  <div className="editor-fields">
                    {[
                      { key: "title", label: "Job title" },
                      { key: "slug", label: "Job URL name" },
                      { key: "department", label: "Department" },
                      { key: "employment_type", label: "Employment type" },
                      { key: "work_location", label: "Work location" },
                      { key: "shift", label: "Shift" },
                      { key: "experience", label: "Experience range" },
                      { key: "openings", label: "Number of openings" },
                      { key: "application_email", label: "Application email" },
                      { key: "date_posted", label: "Actual posting date (optional)" },
                      {
                        key: "eligibility_country",
                        label: "Remote-work country eligibility (optional)",
                      },
                    ].map((field) => (
                      <div className="form-field" key={field.key}>
                        <label htmlFor={`job-${field.key}`}>{field.label}</label>
                        <input
                          id={`job-${field.key}`}
                          type={
                            field.key === "application_email"
                              ? "email"
                              : field.key === "date_posted"
                                ? "date"
                                : "text"
                          }
                          value={String(editing[field.key as keyof Job] ?? "")}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEditing({
                              ...editing,
                              [field.key]: value || (field.key === "date_posted" ? null : ""),
                              ...(field.key === "title" &&
                              !editing.id &&
                              (!editing.slug ||
                                editing.slug ===
                                  (editing.title ?? "")
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/^-|-$/g, ""))
                                ? {
                                    slug: value
                                      .toLowerCase()
                                      .replace(/[^a-z0-9]+/g, "-")
                                      .replace(/^-|-$/g, ""),
                                  }
                                : {}),
                            });
                          }}
                          disabled={busy}
                          required={!["date_posted", "eligibility_country"].includes(field.key)}
                          maxLength={field.key === "application_email" ? 254 : 160}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="form-field">
                    <label htmlFor="job-description">Job description</label>
                    <textarea
                      disabled={busy}
                      id="job-description"
                      value={editing.description ?? ""}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      required
                      minLength={10}
                      maxLength={8000}
                    />
                  </div>
                  <div className="editor-bottom">
                    <label htmlFor="job-status">
                      Publication status
                      <select
                        id="job-status"
                        disabled={busy}
                        value={editing.status ?? "draft"}
                        onChange={(e) =>
                          setEditing({ ...editing, status: e.target.value as Job["status"] })
                        }
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Closed</option>
                      </select>
                    </label>
                    <Button type="submit" disabled={busy}>
                      <Save />
                      {busy
                        ? "Saving…"
                        : editing.status === "published"
                          ? editing.id
                            ? "Save & publish changes"
                            : "Publish listing"
                          : editing.status === "archived"
                            ? "Save closed listing"
                            : "Save draft"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
}
