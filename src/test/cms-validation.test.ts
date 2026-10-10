import { describe, it, expect } from "vitest";
import {
  contactSchema,
  jobSchema,
  jobStatusSchema,
  settingsSchema,
  applicationSchema,
} from "@/lib/cms/schemas";
import { privateHead } from "@/lib/seo";
describe("CMS safety", () => {
  it("validates status-only career updates without allowing content overwrite", () => {
    const id = "11111111-1111-4111-8111-111111111111";
    for (const status of ["draft", "published", "archived"])
      expect(jobStatusSchema.parse({ id, status, title: "Unintended overwrite" })).toEqual({
        id,
        status,
      });
    expect(jobStatusSchema.safeParse({ id, status: "closed" }).success).toBe(false);
    expect(jobStatusSchema.safeParse({ id: "invalid", status: "published" }).success).toBe(false);
  });
  it("validates applications and rejects unsafe resume links", () => {
    const input = {
      job_id: "11111111-1111-4111-8111-111111111111",
      name: "Applicant",
      email: "applicant@example.com",
      phone: "+917013703786",
      experience: "Fresher",
      message: "",
      resume_url: "",
      website: "",
    };
    expect(applicationSchema.safeParse(input).success).toBe(true);
    expect(
      applicationSchema.safeParse({ ...input, resume_url: "javascript:alert(1)" }).success,
    ).toBe(false);
    expect(applicationSchema.safeParse({ ...input, website: "spam" }).success).toBe(false);
  });
  it("validates contact fields and rejects honeypot submissions", () => {
    const valid = {
      name: "Test",
      email: "test@example.com",
      message: "A business enquiry",
      website: "",
    };
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, email: "bad" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });
  it("rejects malformed jobs and unrecognized publication statuses", () => {
    expect(jobSchema.safeParse({ title: "", status: "public" }).success).toBe(false);
  });
  it("validates public contact destinations", () => {
    expect(
      settingsSchema.safeParse({
        contact_email: "test@example.com",
        contact_phone: "+91 70137 03786",
        whatsapp_number: "917013703786",
        footer_description: "Business services.",
      }).success,
    ).toBe(true);
    expect(settingsSchema.safeParse({ whatsapp_number: "javascript:alert(1)" }).success).toBe(
      false,
    );
  });
  it("excludes private administration from indexing", () => {
    expect(privateHead("Admin", "/admin").meta).toContainEqual({
      name: "robots",
      content: "noindex, nofollow",
    });
  });
});
