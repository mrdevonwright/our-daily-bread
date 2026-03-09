import { createAdminClient, createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AcceptInvite } from "./AcceptInvite";
import type { Church } from "@/lib/types";

interface PageProps {
  params: { token: string };
}

export default async function JoinPage({ params }: PageProps) {
  const { token } = params;
  const adminClient = createAdminClient();

  // Look up invite with church name
  const { data: invite } = await adminClient
    .from("invitations")
    .select("id, church_id, email, expires_at, accepted_at, churches(name)")
    .eq("token", token)
    .single();

  // Check if user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  // Not found
  if (!invite) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-10 max-w-md w-full text-center space-y-3">
          <span className="text-4xl block">🍞</span>
          <h1 className="font-serif text-2xl font-bold">Invite not found</h1>
          <p className="text-muted-foreground text-sm">
            This invite link is invalid or has been removed.
          </p>
          <Link href="/" className="text-wheat hover:underline text-sm">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = new Date(invite.expires_at) < new Date();
  const isAccepted = !!invite.accepted_at;
  const churchName =
    (invite.churches as unknown as Pick<Church, "name"> | null)?.name ?? "your church";

  // Already used or expired
  if (isExpired || isAccepted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-10 max-w-md w-full text-center space-y-3">
          <span className="text-4xl block">⏳</span>
          <h1 className="font-serif text-2xl font-bold">
            {isAccepted ? "Invite already used" : "Invite expired"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isAccepted
              ? "This invitation has already been accepted."
              : "This invitation expired. Ask your church admin to send a new one."}
          </p>
          <Link href="/" className="text-wheat hover:underline text-sm">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl block">🍞</span>
          <h1 className="font-serif text-2xl font-bold">You&rsquo;re invited!</h1>
          <p className="text-muted-foreground text-sm">
            Join <strong className="text-foreground">{churchName}</strong> on Our Daily Bread
            and start tracking your bread sales for the Lord.
          </p>
        </div>

        <AcceptInvite token={token} churchName={churchName} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
