import { createServerFn } from "@tanstack/react-start";
export const getAnalyticsId = createServerFn({ method: "GET" }).handler(async () => {
  const id = (process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"] ?? "").trim();
  return { id: /^G-[A-Z0-9]+$/i.test(id) ? id : null };
});
