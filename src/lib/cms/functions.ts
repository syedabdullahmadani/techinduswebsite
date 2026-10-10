import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireAdminSession } from "./admin-session.server";
import type { Database } from "@/integrations/supabase/types";
import {
  jobSchema,
  jobStatusSchema,
  contactSchema,
  settingsSchema,
  applicationSchema,
} from "./schemas";

const requireAdmin = createMiddleware({ type: "function" }).server(async ({ next }) => {
  await requireAdminSession();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return next({ context: { supabase: supabaseAdmin } });
});
export const getPublicContent = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Website content is temporarily unavailable.");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const [jobs, settings] = await Promise.all([
    client
      .from("jobs")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    client.from("site_settings").select("*").eq("id", "main").single(),
  ]);
  if (jobs.error || settings.error)
    throw new Error("Website content could not be loaded. Please try again.");
  return { jobs: jobs.data, settings: settings.data };
});
export const adminContent = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const [jobs, enquiries, settings, applicants] = await Promise.all([
      context.supabase.from("jobs").select("*").order("created_at", { ascending: false }),
      context.supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false }),
      context.supabase.from("site_settings").select("*").eq("id", "main").single(),
      context.supabase
        .from("career_applicants")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    if (jobs.error || enquiries.error || settings.error || applicants.error)
      throw new Error("Management content could not be loaded.");
    return {
      jobs: jobs.data,
      enquiries: enquiries.data,
      settings: settings.data,
      applicants: applicants.data,
      userEmail: "Administrator",
    };
  });
export const saveJob = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => jobSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { id, date_posted, eligibility_country, ...rest } = data;
    const values = {
      ...rest,
      date_posted: date_posted ?? null,
      eligibility_country: eligibility_country ?? null,
    };
    const result = id
      ? await context.supabase.from("jobs").update(values).eq("id", id).select().single()
      : await context.supabase.from("jobs").insert(values).select().single();
    if (result.error)
      throw new Error(
        result.error.code === "23505"
          ? "This job URL is already in use."
          : "The job could not be saved.",
      );
    return result.data;
  });
export const setJobStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => jobStatusSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: job, error } = await context.supabase
      .from("jobs")
      .update({ status: data.status })
      .eq("id", data.id)
      .select("id,status")
      .single();
    if (error || !job) throw new Error("The listing status could not be saved. Please try again.");
    return job;
  });
export const deleteJob = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("jobs").delete().eq("id", data.id);
    if (error) throw new Error("The job could not be deleted.");
    return { success: true };
  });
export const updateEnquiry = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["new", "reviewed", "archived"]) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("contact_submissions")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("The enquiry could not be updated.");
    return { success: true };
  });
export const saveSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => settingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("site_settings").update(data).eq("id", "main");
    if (error) throw new Error("Settings could not be saved.");
    return { success: true };
  });
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({ name: data.name, email: data.email, message: data.message });
    if (error)
      throw new Error("Your enquiry could not be saved. Please contact us by email or phone.");
    const { notifyAdmin } = await import("@/lib/notify.server");
    await notifyAdmin("New website enquiry", {
      Name: data.name,
      Email: data.email,
      Message: data.message,
    });
    return { success: true };
  });
export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const job = await supabaseAdmin
      .from("jobs")
      .select("id,title")
      .eq("id", data.job_id)
      .eq("status", "published")
      .single();
    if (job.error || !job.data)
      throw new Error("This opportunity is no longer accepting applications.");
    const { website, ...values } = data;
    const { data: application, error } = await supabaseAdmin
      .from("career_applicants")
      .insert({ ...values, job_title: job.data.title })
      .select("id")
      .single();
    if (error || !application)
      throw new Error("Your application could not be saved. Please try again.");
    const { notifyAdmin } = await import("@/lib/notify.server");
    await notifyAdmin(`New application: ${job.data.title}`, {
      Name: values.name,
      Email: values.email,
      Phone: values.phone,
      Experience: values.experience,
      Resume: values.resume_url,
      Message: values.message,
    });
    return { success: true, id: application.id };
  });
export const updateApplicant = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "reviewed", "shortlisted", "rejected", "archived"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("career_applicants")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("The application could not be updated.");
    return { success: true };
  });
export const deleteApplicant = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("career_applicants").delete().eq("id", data.id);
    if (error) throw new Error("The application could not be deleted.");
    return { success: true };
  });
