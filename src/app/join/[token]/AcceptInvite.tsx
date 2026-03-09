"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AcceptInviteProps {
  token: string;
  churchName: string;
  isLoggedIn: boolean;
}

export function AcceptInvite({ token, churchName, isLoggedIn }: AcceptInviteProps) {
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          You need an account to join <strong>{churchName}</strong>.
        </p>
        <div className="flex gap-3">
          <Button
            asChild
            className="bg-wheat hover:bg-wheat-dark text-white"
          >
            <a href={`/login?redirectTo=/join/${token}`}>Log in & Accept</a>
          </Button>
          <Button asChild variant="outline">
            <a href={`/signup`}>Create account</a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          After signing up, visit this link again to accept the invitation.
        </p>
      </div>
    );
  }

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await fetch(`/api/invitations/${token}`, { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Failed to accept invite");
        return;
      }

      toast.success(`Welcome to ${churchName}! 🍞`);
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <Button
      onClick={handleAccept}
      disabled={accepting}
      className="bg-wheat hover:bg-wheat-dark text-white"
    >
      {accepting ? "Joining…" : `Accept & Join ${churchName}`}
    </Button>
  );
}
