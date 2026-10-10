import { useSession, setResponseHeader } from "@tanstack/react-start/server";

export async function adminSession() {
  const secret = process.env["SESSION_SECRET"];
  if (!secret) throw new Error("Administrator access is not configured.");
  setResponseHeader("Cache-Control", "no-store");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<{ unlocked?: boolean }>({
    password: secret,
    name: "techindus-admin",
    maxAge: 60 * 60 * 4,
    cookie: { httpOnly: true, secure: true, sameSite: "none", path: "/" },
  });
}
export async function requireAdminSession() {
  const session = await adminSession();
  if (!session.data.unlocked) throw new Error("Administrator sign in is required.");
}
