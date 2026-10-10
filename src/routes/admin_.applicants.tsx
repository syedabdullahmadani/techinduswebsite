import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin/panel";
import { AdminError } from "@/components/admin/error";
import { adminContentOptions } from "@/lib/cms/queries";
import { adminAccess } from "@/lib/cms/admin-gate.functions";
import { privateHead } from "@/lib/seo";
export const Route = createFileRoute("/admin_/applicants")({
  staticData: { sitemap: false },
  beforeLoad: async () => {
    if (!(await adminAccess()).unlocked) throw redirect({ to: "/admin/login" });
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(adminContentOptions),
  head: () => privateHead("Applicants Management", "/admin/applicants"),
  errorComponent: AdminError,
  component: () => <AdminPanel view="applicants" />,
});
