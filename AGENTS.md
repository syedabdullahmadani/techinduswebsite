<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Website architecture

- Scope About-specific presentation under its page class and reuse shared site chrome, service definitions, buttons and motion; this preserves the homepage and management flows.
- Scope Contact presentation under its page class and reuse the existing enquiry server function, settings and shared motion; this preserves other pages and private management flows.
- Render the contact map as a keyless OpenStreetMap city-level embed without an office marker; the exact office address is unverified.
- Use five complete public pages with shared page-based navigation; homepage previews link to detail pages, preserving TanStack Start SSR and private management routes.
- Keep shared site chrome and presentation in site components, content in centralized data, and per-page metadata in the SEO helper to avoid duplicated business facts.
- Persist contact enquiries privately via validated server functions and display them in administration; a mailto draft is an error fallback, never proof of delivery.
- Add an absolute production sitemap and Organization URL/logo only once the official public domain and supplied logo are available, avoiding invented assets or URLs.
- Omit JobPosting until its publication date and full remote-work eligibility are verified; the visible vacancy remains based solely on supplied facts.

## Content management

- Change career publication state through a status-only administrator function; closing maps to archival so content and existing applications remain intact without changing public presentation.
- Keep jobs and public contact settings in Lovable Cloud with published-only public job reads; changes must not require source edits.
- Protect every management server function with the server-verified encrypted administrator session; the shared password is server-only and browser state never authorizes writes. Retain role-based RLS for account access.
- Use one shared CSS/IntersectionObserver motion system with requestAnimationFrame scroll updates; honor reduced motion and disable parallax on small screens to avoid competing observers and expensive mobile motion.
- Limit the optional contact invitation to one substantial-scroll trigger per browsing session, without an overlay or focus stealing; service enquiry links pass only recognized service titles to the existing Contact form.
- Derive sitemap URLs from explicit route decisions and the configurable site origin, excluding the private management subtree.

- Store online career applications privately with a snapshot of the role title so deleting a job does not erase applicant records.
