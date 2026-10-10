import { describe, it, expect } from "vitest";
import { contact, jobs, services } from "@/lib/site-data";
import { pageHead, siteOrigin } from "@/lib/seo";
describe("Techindus content and SEO", () => {
  it("preserves the three service lines and provided opening", () => {
    expect(services).toHaveLength(3);
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.shift).toBe("6:00 AM–3:00 PM IST");
    expect(contact.whatsapp).toBe("https://wa.me/917013703786");
  });
  it.each(["/", "/about", "/services", "/careers", "/contact"])(
    "uses self-referencing canonical and valid JSON-LD for %s",
    (path) => {
      const head = pageHead(`Techindus ${path}`, `Business services ${path}`, path, path.slice(1));
      expect(head.links[0]?.href).toBe(new URL(path, siteOrigin).href);
      for (const script of head.scripts)
        expect(JSON.parse(script.children)["@context"]).toBe("https://schema.org");
    },
  );
});
