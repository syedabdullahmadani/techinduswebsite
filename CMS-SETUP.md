# Techindus launch configuration

## Administrator password access

Visit `/admin` or `/admin/login` and enter the configured password. Password verification happens only on the server, with an encrypted HTTP-only secure cookie expiring after four hours. `SITE_PASSWORD` and `SESSION_SECRET` are stored in Project Settings → Secrets, never in browser code. Sign out clears the session. This is shared access, not individual accounts; changing the password does not revoke existing cookies until they expire.

Careers Management supports create/edit/publish/unpublish/archive/delete. Applicants Management shows online applications, contact details, optional resume links and review statuses. Email-only applications sent before this form was added cannot be recovered automatically. Applications are stored privately in `career_applicants`, with a role-title snapshot retained if a job is deleted. Anonymous visitors cannot read applications or enquiries.

## Enquiries and notifications

Contact submissions are stored privately in `contact_submissions` and available in `/admin/enquiries` and Cloud → Database → contact_submissions. An email notification is not currently sent. Email sending requires a paid plan and verified sending domain. The domain alone does not enable notifications; connect and verify the domain, then request notification setup.

## Domain and assets

The user supplied `https://techindus.co.in` as the production origin. `VITE_SITE_URL` can override that origin per deployment (absolute HTTPS origin, without a path). Connect the domain to the published website separately. Preview validation does not mean the custom domain is live. The supplied official logo is installed in the shared header, footer and management sign-in.

## Environment

Lovable Cloud supplies these existing variables; do not replace or expose private values:

- Browser: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Server: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Optional deployment setting: `VITE_SITE_URL`.

There are no additional required database keys. Email notifications are not configured and no email provider is simulated.

## Job search markup

The supplied vacancy is published in Cloud. JobPosting search markup is deliberately omitted until the actual posting date and full remote-work country eligibility are confirmed. Editing a date or eligibility field should reflect a verified fact, not a deployment date or guessed country.

## Verification

Public routes, no-account administrator redirects, sitemap exclusions, mobile navigation, contact validation and persisted contact submissions have been checked. Password login, job publishing, public online applications, applicant read-back/status/deletion and session persistence have been verified through the website.
