const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
export async function notifyAdmin(
  subject: string,
  fields: Record<string, string | null | undefined>,
) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) {
    console.error("RESEND_API_KEY is not configured");
    return;
  }
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) => `<p><strong>${esc(k)}:</strong><br>${esc(String(v)).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Techindus Website <onboarding@resend.dev>",
        to: ["syedabdullahmadani0408@gmail.com"],
        subject,
        html: `<h2>${esc(subject)}</h2>${rows}`,
      }),
    });
    if (!res.ok) console.error(`Resend failed [${res.status}]: ${await res.text()}`);
  } catch (e) {
    console.error("Resend error", e);
  }
}
