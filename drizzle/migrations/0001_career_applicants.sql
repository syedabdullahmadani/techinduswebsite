CREATE TABLE public.career_applicants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
 job_title text NOT NULL,
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (char_length(email) <= 254),
 phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
 experience text NOT NULL CHECK (char_length(experience) <= 200),
 message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 3000),
 resume_url text NOT NULL DEFAULT '' CHECK (char_length(resume_url) <= 1000),
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','shortlisted','rejected','archived')),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.career_applicants TO authenticated;
GRANT ALL ON public.career_applicants TO service_role;
ALTER TABLE public.career_applicants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Administrators manage applicants" ON public.career_applicants FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX career_applicants_created_at_idx ON public.career_applicants(created_at DESC);