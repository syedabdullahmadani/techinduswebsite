import { Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export function AdminError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <div className="access-error">
      <h1>Administrator access required</h1>
      <p>{error instanceof Error ? error.message : "You do not have access to this workspace."}</p>
      <Button asChild>
        <Link to="/admin/login">Administrator sign in</Link>
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Try again
      </Button>
      <Link to="/">Back to website</Link>
    </div>
  );
}
