import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const sessionKey = "techindus-contact-invitation-seen";
export function ContactInvitation() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const automatic = useRef(false);
  useEffect(() => {
    setOpen(false);
    if (!["/", "/about", "/services"].includes(path)) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(sessionKey) === "yes";
    } catch {
      seen = true;
    }
    if (seen) return;
    const invite = () => {
      const distance = document.documentElement.scrollHeight - innerHeight;
      if (distance < 600 || scrollY / distance < 0.7) return;
      try {
        sessionStorage.setItem(sessionKey, "yes");
      } catch {
        return;
      }
      automatic.current = true;
      setOpen(true);
      window.removeEventListener("scroll", invite);
    };
    window.addEventListener("scroll", invite, { passive: true });
    return () => window.removeEventListener("scroll", invite);
  }, [path]);
  function change(next: boolean) {
    setOpen(next);
    if (!next)
      try {
        sessionStorage.setItem(sessionKey, "yes");
      } catch {
        /* Session storage may be unavailable. */
      }
  }
  return (
    <Dialog.Root open={open} onOpenChange={change} modal={false}>
      <Dialog.Trigger asChild>
        <Button
          variant="link"
          className="conversation-trigger"
          onClick={() => {
            automatic.current = false;
          }}
        >
          <MessageSquare size={16} />
          Start a conversation
          <ArrowRight size={16} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          className="contact-invitation"
          onOpenAutoFocus={(event) => {
            if (automatic.current) event.preventDefault();
          }}
          onInteractOutside={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => {
            if (automatic.current) event.preventDefault();
          }}
        >
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="invitation-close"
              aria-label="Dismiss contact invitation"
            >
              <X size={18} />
            </Button>
          </Dialog.Close>
          <MessageSquare className="invitation-icon" aria-hidden="true" />
          <Dialog.Title>Have a business challenge in mind?</Dialog.Title>
          <Dialog.Description>
            Tell us what you're trying to achieve, and let's explore how Techindus can help.
          </Dialog.Description>
          <div className="invitation-actions">
            <Button asChild onClick={() => change(false)}>
              <Link to="/contact">
                Start a Conversation
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Dialog.Close asChild>
              <Button variant="ghost">Not Now</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
