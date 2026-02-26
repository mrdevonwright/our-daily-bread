"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Profile, Church } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface SettingsFormProps {
  profile: Profile;
  church: Church | null;
}

export function SettingsForm({ profile, church }: SettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [clearingManna, setClearingManna] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [values, setValues] = useState({
    full_name: profile.full_name ?? "",
    bio: profile.bio ?? "",
    phone: profile.phone ?? "",
    address: profile.address ?? "",
  });

  function set(field: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      toast.success("Settings saved!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleClearManna() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setClearingManna(true);
    try {
      const res = await fetch("/api/chat/clear", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear history");
      toast.success("Manna history cleared.");
      setConfirmClear(false);
    } catch {
      toast.error("Something went wrong clearing history.");
    } finally {
      setClearingManna(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-xl">

      {/* Personal info */}
      <section className="bg-white rounded-2xl border border-wheat/15 shadow-sm p-6 space-y-5">
        <h2 className="font-serif text-lg font-semibold">Personal Info</h2>

        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={values.full_name}
            onChange={set("full_name")}
            placeholder="Your name"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile.email}
            disabled
            className="bg-muted/40 text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            Email is managed through your login. Contact us to change it.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={values.address}
            onChange={set("address")}
            placeholder="123 Main St, Austin, TX 78701"
          />
        </div>
      </section>

      {/* Bio */}
      <section className="bg-white rounded-2xl border border-wheat/15 shadow-sm p-6 space-y-5">
        <h2 className="font-serif text-lg font-semibold">About You</h2>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={values.bio}
            onChange={set("bio")}
            rows={3}
            maxLength={500}
            placeholder="Tell other bakers a little about yourself…"
            className="w-full text-sm border border-input rounded-xl px-3.5 py-2.5 resize-none outline-none focus:border-wheat focus:ring-1 focus:ring-wheat/30 placeholder:text-muted-foreground/50 transition-colors"
          />
          <p className="text-xs text-muted-foreground text-right">
            {values.bio.length}/500
          </p>
        </div>
      </section>

      {/* Church (read-only) */}
      <section className="bg-white rounded-2xl border border-wheat/15 shadow-sm p-6 space-y-5">
        <h2 className="font-serif text-lg font-semibold">Church</h2>

        <div className="space-y-1.5">
          <Label>Your Church</Label>
          {church ? (
            <div className="text-sm bg-muted/40 border border-input rounded-xl px-3.5 py-2.5 text-foreground">
              {church.name} · {church.city}, {church.state}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/40 border border-input rounded-xl px-3.5 py-2.5">
              Not connected to a church yet.{" "}
              <a href="/onboarding" className="text-wheat hover:underline">
                Set up your ministry →
              </a>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Church affiliation is managed through the onboarding flow.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Role</Label>
          <div className="text-sm bg-muted/40 border border-input rounded-xl px-3.5 py-2.5 text-muted-foreground capitalize">
            {profile.role.replace("_", " ")}
          </div>
        </div>
      </section>

      {/* Manna AI */}
      <section className="bg-white rounded-2xl border border-wheat/15 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-serif text-lg font-semibold">Manna AI</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manna remembers your conversations so she can pick up where you left off.
            Clear your history to start fresh.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={clearingManna}
            onClick={handleClearManna}
            onBlur={() => setConfirmClear(false)}
            className={
              confirmClear
                ? "border-red-400 text-red-600 hover:bg-red-50"
                : "border-wheat/30 text-muted-foreground hover:border-wheat/60"
            }
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {clearingManna
              ? "Clearing…"
              : confirmClear
                ? "Tap again to confirm"
                : "Clear Manna History"}
          </Button>
        </div>
      </section>

      <Button
        type="submit"
        disabled={saving}
        className="bg-wheat hover:bg-wheat-dark text-white px-8"
      >
        {saving ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
