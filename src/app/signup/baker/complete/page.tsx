"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { US_STATES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wheat, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Church } from "@/lib/types";

export default function BakerCompletePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState("");
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurch, setSelectedChurch] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Verify user is logged in
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUserId(data.user.id);
      }
    });
  }, [router]);

  // Load churches when state selected
  useEffect(() => {
    if (!selectedState) return;
    fetch(`/api/churches?state=${selectedState}`)
      .then((r) => r.json())
      .then(setChurches)
      .catch(() => setChurches([]));
  }, [selectedState]);

  async function handleSave() {
    if (!selectedChurch || !userId) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ role: "baker", church_id: selectedChurch })
        .eq("id", userId);
      if (error) throw error;
      setDone(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-wheat-texture flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-10 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-wheat mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-3">
            Welcome to the Movement!
          </h1>
          <p className="text-muted-foreground mb-6">
            You&rsquo;re all set. Head to your dashboard to start logging bread sales.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wheat-texture py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-wheat flex items-center justify-center">
              <Wheat className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl">Our Daily Bread</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-8">
          <h1 className="font-serif text-2xl font-bold mb-1">One last step</h1>
          <p className="text-muted-foreground mb-6">
            Find and join your church to complete your baker registration.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Select your state
              </label>
              <Select value={selectedState} onValueChange={(v) => { setSelectedState(v); setSelectedChurch(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your state..." />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedState && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Select your church
                </label>
                {churches.length === 0 ? (
                  <div className="p-4 bg-cream rounded-xl border border-wheat/20 text-sm text-muted-foreground">
                    No churches in {US_STATES.find((s) => s.value === selectedState)?.label} yet.{" "}
                    <Link href="/signup/church" className="text-wheat hover:underline">
                      Register your church
                    </Link>{" "}
                    to be the first!
                  </div>
                ) : (
                  <Select value={selectedChurch} onValueChange={setSelectedChurch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your church..." />
                    </SelectTrigger>
                    <SelectContent>
                      {churches.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} — {c.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={!selectedChurch || saving}
              className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base mt-2"
            >
              {saving ? "Saving…" : "Join My Church"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
