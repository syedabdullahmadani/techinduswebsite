import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
export function PublicMotion({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const progress = document.getElementById("reading-progress");
    const header = document.querySelector(".site-header");
    let frame = 0;
    const images = document.querySelectorAll<HTMLElement>(
      ".reference-globe,.about-hero>img,.about-philosophy>img,.contact-hero>img,.reference-contact>img,.experience-hero>img",
    );
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      header?.classList.toggle("is-scrolled", y > 20);
      images.forEach((image) => {
        const parent = image.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        image.style.transform =
          !media.matches && innerWidth > 960 && rect.bottom > 0 && rect.top < innerHeight
            ? `translate3d(0,${Math.max(-24, Math.min(24, -rect.top * 0.045))}px,0) scale(1.08)`
            : "";
      });
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll, { passive: true });
    update();
    const nodes = document.querySelectorAll<HTMLElement>(
      "main [data-reveal],main [data-contact-reveal],main .reference-section-heading,main .reference-about-grid,main .reference-service-card,main .reference-quote,main .reference-job,main .section-heading,main .highlights > div,main .service-detail,main .job-card,main .cta-inner,main .about-company-grid,main .credibility-strip,main .about-philosophy-copy,main .about-approach-block,main .about-contact .reference-contact-copy,main .about-building,main .about-photo",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    if (!media.matches)
      nodes.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top > window.innerHeight) {
          n.classList.add("reveal-ready");
          if (n.matches(".about-building,.about-photo,.reference-service-card"))
            n.dataset["reveal"] = "image";
          else if (n.matches(".reference-quote,.about-philosophy-copy"))
            n.dataset["reveal"] = "quote";
          observer.observe(n);
        }
      });
    const revealFocused = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement)
        event.target.closest(".reveal-ready")?.classList.add("revealed");
    };
    const motionChange = () => {
      if (media.matches) nodes.forEach((n) => n.classList.add("revealed"));
      update();
    };
    document.addEventListener("focusin", revealFocused);
    media.addEventListener("change", motionChange);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      document.removeEventListener("focusin", revealFocused);
      media.removeEventListener("change", motionChange);
      cancelAnimationFrame(frame);
      observer.disconnect();
      nodes.forEach((n) => n.classList.remove("reveal-ready"));
      images.forEach((image) => (image.style.transform = ""));
    };
  }, [path]);
  return (
    <div className="public-site">
      <div id="reading-progress" className="reading-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
