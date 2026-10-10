import { createServerFn } from "@tanstack/react-start";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { adminSession } from "./admin-session.server";

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ password: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const expected = process.env["SITE_PASSWORD"];
    if (!expected) throw new Error("Administrator sign in is not configured.");
    const a = createHash("sha256").update(data.password).digest();
    const b = createHash("sha256").update(expected).digest();
    if (!timingSafeEqual(a, b)) return { success: false };
    const session = await adminSession();
    await session.update({ unlocked: true });
    return { success: true };
  });
export const adminAccess = createServerFn({ method: "GET" }).handler(async () => {
  const session = await adminSession();
  return { unlocked: session.data.unlocked === true };
});
export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await adminSession();
  await session.clear();
  return { success: true };
});
