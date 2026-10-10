import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin/panel";
import { AdminError } from "@/components/admin/error";
import { adminContentOptions } from "@/lib/cms/queries";
import { privateHead } from "@/lib/seo";
import { adminAccess } from "@/lib/cms/admin-gate.functions";
export const Route = createFileRoute("/admin_/careers")({
  staticData: { sitemap: false },
  beforeLoad: async () => {
    if (!(await adminAccess()).unlocked) throw redirect({ to: "/admin/login" });
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(adminContentOptions),
  head: () => privateHead("Career Management", "/admin/careers"),
  errorComponent: AdminError,
  notFoundComponent: () => <div>Management page not found.</div>,
  pendingComponent: () => <div className="access-error">Loading management…</div>,
  component: () => <AdminPanel view="careers" />,
});
