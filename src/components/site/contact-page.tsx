import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  ChevronRight,
  Globe2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  UserRound,
  MessageSquare,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { publicContentOptions } from "@/lib/cms/queries";
import { submitEnquiry } from "@/lib/cms/functions";
import { contactSchema } from "@/lib/cms/schemas";
import { Route as ContactRoute } from "@/routes/contact";
import { contactFaqs } from "@/lib/contact-data";
import office from "@/assets/contact-office.webp.asset.json";
import meeting from "@/assets/contact-meeting.webp.asset.json";

function HyderabadMap() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const timer = window.setTimeout(() => setState((s) => (s === "loading" ? "error" : s)), 20000);
    return () => window.clearTimeout(timer);
  }, [attempt]);
  return (
    <div className="contact-map">
      <div className="contact-map-label">
        <MapPin size={19} />
        <div>
          <strong>Hyderabad, Telangana, India</strong>
          <span>Our city. Our base for global delivery.</span>
        </div>
      </div>
      <div className="contact-map-frame">
        {state !== "ready" && (
          <div className="contact-map-status" role="status">
            {state === "loading" ? (
              <>
                <LoaderCircle className="animate-spin" />
                Loading Hyderabad map…
              </>
            ) : (
              <>
                <MapPin />
                <p>The map couldn’t load.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setState("loading");
                    setAttempt((a) => a + 1);
                  }}
                >
                  Retry map
                </Button>
              </>
            )}
          </div>
        )}
        {mounted && (
          <iframe
            key={attempt}
            title="Interactive OpenStreetMap of Hyderabad, Telangana, India"
            src="https://www.openstreetmap.org/export/embed.html?bbox=78.30%2C17.25%2C78.65%2C17.55&layer=mapnik"
            onLoad={() => setState("ready")}
            onError={() => setState("error")}
            className={state === "ready" ? "is-ready" : ""}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      <a
        href="https://www.openstreetmap.org/#map=11/17.3850/78.4867"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-map-link"
      >
        View Hyderabad on OpenStreetMap <ArrowRight size={15} />
      </a>
    </div>
  );
}

export function ContactPage() {
  const { topic } = ContactRoute.useSearch();
  const { data } = useSuspenseQuery(publicContentOptions);
  const settings = data.settings;
  const email = settings.contact_email;
  const phone = settings.contact_phone;
  const tel = phone.replace(/[^+\d]/g, "");
  const whatsapp = `https://wa.me/${settings.whatsapp_number}`;
  const send = useServerFn(submitEnquiry);
  const [values, setValues] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [draft, setDraft] = useState("");
  const busy = useRef(false);
  const firstField = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (topic)
      setValues((v) => ({ ...v, message: `I'd like to discuss ${topic}.\n\nMy requirement: ` }));
  }, [topic]);
  function focusForm() {
    if (sent) {
      setSent(false);
      setValues({ name: "", email: "", message: "", website: "" });
    }
    formRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    requestAnimationFrame(() => firstField.current?.focus({ preventScroll: true }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || sent) return;
    const parsed = contactSchema.safeParse(values);
    setDraft("");
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      const key = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
      return;
    }
    busy.current = true;
    setLoading(true);
    setErrors({});
    try {
      await send({ data: parsed.data });
      setSent(true);
    } catch {
      setErrors({
        form: "Your enquiry could not be saved. Please try again or contact us directly.",
      });
      setDraft(
        `mailto:${email}?subject=${encodeURIComponent("Business enquiry — Techindus")}&body=${encodeURIComponent(`Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`)}`,
      );
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }
  const methods = [
    { label: "Email", title: "Email Us", text: email, href: `mailto:${email}`, icon: Mail },
    { label: "Call Us", title: "Call Us", text: phone, href: `tel:${tel}`, icon: Phone },
    { label: "WhatsApp", title: "Chat on WhatsApp", text: phone, href: whatsapp, icon: FaWhatsapp },
  ];
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <img
          src={office.url}
          alt="Illustrative modern corporate atrium with expansive windows and shared meeting spaces"
          width="1600"
          height="1180"
          fetchPriority="high"
        />
        <div className="container contact-hero-inner">
          <div className="contact-hero-copy">
            <span className="eyebrow">CONTACT TECHINDUS</span>
            <h1>
              Let’s build
              <br />
              something impactful
              <br />
              <span>together.</span>
            </h1>
            <p>
              Whether you're exploring advisory, outsourced sales, or offshore support, we'd love to
              hear from you and discuss how Techindus can help your business.
            </p>
          </div>
          <div className="contact-hero-aside">
            <div className="contact-editorial">
              Discuss
              <br />
              Plan
              <br />
              Execute
              <br />
              Grow
            </div>
            <div className="contact-global-note">
              <Globe2 aria-hidden="true" />
              <p>
                Global businesses.
                <br />
                Real conversations.
                <br />
                Practical solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="container contact-quick-strip" data-contact-reveal>
        {methods.map((method) => (
          <a
            key={method.label}
            href={method.href}
            target={method.label === "WhatsApp" ? "_blank" : undefined}
            rel={method.label === "WhatsApp" ? "noopener noreferrer" : undefined}
          >
            <span className="contact-icon">
              <method.icon aria-hidden="true" />
            </span>
            <div>
              <strong>{method.label}</strong>
              <span>{method.label === "WhatsApp" ? "Chat on WhatsApp" : method.text}</span>
            </div>
          </a>
        ))}
        <div>
          <span className="contact-icon">
            <MapPin aria-hidden="true" />
          </span>
          <div>
            <strong>Our Location</strong>
            <span>Hyderabad, India</span>
          </div>
        </div>
      </div>
      <section className="contact-main section">
        <div className="container contact-main-grid">
          <div data-contact-reveal>
            <span className="eyebrow">SEND US A MESSAGE</span>
            <h2>
              We’d love to
              <br />
              <span>hear from you.</span>
            </h2>
            <p className="contact-intro">
              Have a question, a project idea, or want to explore how Techindus can support your
              business? Fill out the form and we'll get back to you soon.
            </p>
            {topic && (
              <p className="contact-topic">
                Enquiry topic: <strong>{topic}</strong>
              </p>
            )}
            <form
              ref={formRef}
              id="contact-form"
              className="contact-message-form"
              onSubmit={submit}
              noValidate
              aria-busy={loading}
            >
              <div className="contact-form-fields">
                {(
                  [
                    {
                      key: "name",
                      label: "Full Name",
                      placeholder: "Enter your name",
                      Icon: UserRound,
                    },
                    {
                      key: "email",
                      label: "Email Address",
                      placeholder: "Enter your email",
                      Icon: Mail,
                    },
                    {
                      key: "message",
                      label: "Message",
                      placeholder: "Tell us about your requirement…",
                      Icon: MessageSquare,
                    },
                  ] as const
                ).map((field) => (
                  <div className={`form-field contact-field-${field.key}`} key={field.key}>
                    <label htmlFor={`contact-${field.key}`}>
                      {field.label} <span aria-hidden="true">*</span>
                    </label>
                    <div className="contact-input-wrap">
                      <field.Icon aria-hidden="true" size={18} />
                      {field.key === "message" ? (
                        <textarea
                          id={`contact-${field.key}`}
                          name={field.key}
                          required
                          maxLength={3000}
                          value={values.message}
                          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                          placeholder={field.placeholder}
                          aria-invalid={Boolean(errors[field.key])}
                          aria-describedby={
                            errors[field.key] ? `contact-${field.key}-error` : undefined
                          }
                          disabled={loading || sent}
                        />
                      ) : (
                        <input
                          ref={field.key === "name" ? firstField : undefined}
                          id={`contact-${field.key}`}
                          name={field.key}
                          type={field.key === "email" ? "email" : "text"}
                          autoComplete={field.key}
                          required
                          maxLength={field.key === "name" ? 100 : 254}
                          value={values[field.key]}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [field.key]: e.target.value }))
                          }
                          placeholder={field.placeholder}
                          aria-invalid={Boolean(errors[field.key])}
                          aria-describedby={
                            errors[field.key] ? `contact-${field.key}-error` : undefined
                          }
                          disabled={loading || sent}
                        />
                      )}
                    </div>
                    {errors[field.key] && (
                      <p id={`contact-${field.key}-error`} className="form-error">
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
                />
              </div>
              <Button type="submit" size="lg" disabled={loading || sent}>
                {loading ? <LoaderCircle className="animate-spin" /> : null}
                {loading ? "Sending…" : sent ? "Message received" : "Send Message"}
                {!loading && <ArrowRight size={17} />}
              </Button>
              <p className="contact-privacy">
                <LockKeyhole size={13} />
                Your enquiry is stored privately for the Techindus team to review and respond.
              </p>
              {errors["form"] && (
                <p className="form-error" role="alert">
                  {errors["form"]}
                </p>
              )}
              {sent && (
                <div className="form-feedback" role="status">
                  Your enquiry has been received and saved for our team to review.
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setSent(false);
                      setValues({ name: "", email: "", message: "", website: "" });
                      firstField.current?.focus();
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              )}
              {draft && (
                <div className="form-feedback">
                  Your enquiry was not saved. You can{" "}
                  <a href={draft}>review and send an email draft</a> instead.
                </div>
              )}
            </form>
          </div>
          <aside className="contact-direct" aria-label="Direct contact options" data-contact-reveal>
            <div className="contact-direct-heading">
              <h2>Get in Touch Directly</h2>
              <p>Prefer to reach out directly? Use the details below.</p>
            </div>
            <div className="contact-direct-rows">
              {methods.map((method) => (
                <a
                  key={method.title}
                  href={method.href}
                  target={method.label === "WhatsApp" ? "_blank" : undefined}
                  rel={method.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                  className={method.label === "WhatsApp" ? "contact-whatsapp-row" : undefined}
                >
                  <span className="contact-icon">
                    <method.icon aria-hidden="true" />
                  </span>
                  <div>
                    <strong>{method.title}</strong>
                    <span>{method.text}</span>
                    {method.label === "WhatsApp" && (
                      <small>Get in touch with us on WhatsApp.</small>
                    )}
                  </div>
                  <ChevronRight aria-hidden="true" size={17} />
                </a>
              ))}
            </div>
            <div className="contact-location">
              <MapPin aria-hidden="true" />
              <div>
                <h3>Our Location</h3>
                <p>Hyderabad, India.</p>
                <p>
                  Delivering global business support through advisory, sales, and operational
                  capabilities.
                </p>
              </div>
              <img
                src={office.url}
                alt="Illustrative contemporary architecture"
                width="1600"
                height="1180"
                loading="lazy"
              />
            </div>
          </aside>
        </div>
      </section>
      <section className="contact-questions section">
        <div className="container contact-questions-grid">
          <div data-contact-reveal>
            <HyderabadMap />
          </div>
          <div className="contact-faq" data-contact-reveal>
            <span className="eyebrow">COMMON QUESTIONS</span>
            <h2>
              Frequently asked
              <br />
              <span>questions</span>
            </h2>
            <Accordion type="single" collapsible>
              {contactFaqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      <section className="reference-contact contact-closing">
        <img
          src={meeting.url}
          alt="Illustrative business professionals discussing plans in a bright meeting room"
          width="1600"
          height="1067"
          loading="lazy"
        />
        <div className="container">
          <div className="reference-contact-copy" data-contact-reveal>
            <span className="eyebrow">READY TO GET STARTED?</span>
            <h2>
              Let’s discuss your goals
              <br />
              <span>and possibilities.</span>
            </h2>
            <p>
              We're here to understand your needs and explore how Techindus can support your next
              step.
            </p>
            <Button variant="secondary" size="lg" onClick={focusForm}>
              Get in Touch <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
