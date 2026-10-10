import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  beforeLoad: () => {
    throw redirect({ to: "/admin/login", replace: true });
  },
});
