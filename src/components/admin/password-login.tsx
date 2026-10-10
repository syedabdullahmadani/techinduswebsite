import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/site/shared";
import { unlockAdmin } from "@/lib/cms/admin-gate.functions";

export function PasswordLogin() {
  const unlock = useServerFn(unlockAdmin),
    navigate = useNavigate(),
    query = useQueryClient();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    try {
      const result = await unlock({ data: { password } });
      if (!result.success) {
        setError("Incorrect password. Please try again.");
        return;
      }
      query.removeQueries({ queryKey: ["admin-content"] });
      await navigate({ to: "/admin", replace: true });
    } catch {
      setError("Sign in is unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="login-page">
      <Link to="/" className="login-back">
        Back to website
      </Link>
      <div className="login-panel">
        <Wordmark />
        <LockKeyhole className="login-icon" />
        <h1>Administrator sign in</h1>
        <form onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={200}
            />
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </section>
  );
}
