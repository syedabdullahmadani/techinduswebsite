import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, ArrowUp, Menu, X, Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation, contact as officialContact } from "@/lib/site-data";
import { Wordmark } from "./shared";
import { useQuery } from "@tanstack/react-query";
import { publicContentOptions } from "@/lib/cms/queries";
import { FaWhatsapp } from "react-icons/fa";
import { ContactInvitation } from "./contact-invitation";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 961px)");
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className={`site-header${open ? " menu-open" : ""}`}>
        <div className="container header-inner">
          <Link to="/" className="header-brand" aria-label="Techindus home">
            <Wordmark />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={pathname === item.to ? "page" : undefined}
                className={pathname === item.to ? "nav-active" : undefined}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <Button asChild className="header-cta" size="lg">
            <Link to="/contact">
              Get in Touch
              <ArrowUpRight />
            </Link>
          </Button>
          <Button
            id="menu-toggle"
            className="mobile-toggle"
            variant="ghost"
            size="icon"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        <div className={`mobile-menu-panel${open ? " is-open" : ""}`} inert={!open}>
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={pathname === item.to ? "page" : undefined}
                className={pathname === item.to ? "nav-active" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.title}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <Button asChild className="mobile-contact">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Get in Touch
                <ArrowUpRight size={16} />
              </Link>
            </Button>
          </nav>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  const { data } = useQuery(publicContentOptions);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const settings = mounted ? data?.settings : undefined;
  const email = settings?.contact_email ?? officialContact.email;
  const phone = settings?.contact_phone ?? officialContact.phone;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label="Techindus home" className="footer-logo">
            <Wordmark />
          </Link>
          <p className="footer-tagline">Global ambitions, delivered from India.</p>
          <ContactInvitation />
        </div>
        <div>
          <h2>Quick Links</h2>
          <nav aria-label="Footer navigation">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-contact">
          <h2>Get in Touch</h2>
          <a href={`mailto:${email}`}>
            <Mail size={16} />
            <span>{email}</span>
          </a>
          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
            <Phone size={16} />
            {phone}
          </a>
          <a
            href={settings ? `https://wa.me/${settings.whatsapp_number}` : officialContact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </div>
        <div className="footer-location-column">
          <h2>Our Location</h2>
          <p>Hyderabad, India.</p>
          <p>
            {settings?.footer_description ??
              "Delivering global business support through advisory, sales, and operational capabilities."}
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Techindus. All rights reserved.</span>
      </div>
    </footer>
  );
}
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return visible ? (
    <Button
      className="back-to-top"
      size="icon"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        })
      }
    >
      <ArrowUp />
    </Button>
  ) : null;
}
export function FloatingWhatsApp() {
  const { data } = useQuery(publicContentOptions);
  return (
    <a
      className="whatsapp-float"
      href={data ? `https://wa.me/${data.settings.whatsapp_number}` : officialContact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Techindus on WhatsApp"
    >
      <FaWhatsapp aria-hidden="true" />
      <span className="whatsapp-tooltip" aria-hidden="true">
        Chat with us
      </span>
    </a>
  );
}
