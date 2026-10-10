import { createFileRoute } from "@tanstack/react-router";
import { PasswordLogin } from "@/components/admin/password-login";
import { privateHead } from "@/lib/seo";
export const Route = createFileRoute("/admin_/login")({
  staticData: { sitemap: false },
  head: () => privateHead("Administrator Sign In", "/admin/login"),
  component: PasswordLogin,
});
