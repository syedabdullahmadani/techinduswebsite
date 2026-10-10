# Experience upgrade report

## Delivered

- Shared navigation: stable sticky header, centered desktop links, active-page indicators, responsive animated menu, Escape dismissal, keyboard focus and accessible current-page labels.
- Home: expanded editorial approach story while retaining the supplied hero, philosophy, equal service cards, CMS careers preview and contact CTA.
- About: refined typography and approach sections with the shared motion system.
- Services: dedicated detailed sections, service anchors, sticky desktop headings and dismissible contextual enquiry panels.
- Careers: verified CMS-derived role context, recruitment CTA and accessible application panel; existing publishing and applications preserved.
- Contact: recognized service-topic prefill, clearer form presentation and lazy-loaded city map; real backend submission unchanged.
- Motion: one CSS/Intersection Observer system, varied image/quote reveals, requestAnimationFrame scroll progress and restrained desktop parallax; mobile/reduced-motion safeguards.
- Lead generation: nonblocking contact invitation after 70% engagement on Home/About/Services, dismissible once per session, manually reopenable from the footer; no extra personal-data collection.

## Verification

- All five public pages at 320, 375, 768, 1024 and 1440px: no horizontal overflow.
- Mobile menu, active indicators, FAQ, contact-topic navigation, genuine enquiry acceptance, invitation dismissal/reopening, back-to-top and reduced motion passed without runtime errors.
- Protected administration: login, enquiry details, reviewed/archive statuses and signed-out protection verified.
- Careers CMS: draft, publish, public visibility, edit, close, persisted closed state and reopen verified; temporary listing removed.
- Temporary enquiries removed after verification.
- 18 regression tests passed; automated build reported OK.
- Local unthrottled Vite desktop measurement: LCP 1.40s, CLS 0.00193, DOM ready 1.26s, 163 resource requests. These are development observations, not production Lighthouse scores; production/mobile performance must be measured after publishing.

## Remaining requirements

- Publish and verify the production domain and its canonical URLs.
- Owner email alerts require the paid email capability, verified sending domain and activation; enquiries already reach protected administration.
- JobPosting rich results still need verified posting dates and remote-work country eligibility.
- No new backend credentials are required for the delivered contact or CMS features.
