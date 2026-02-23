"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { US_STATES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wheat, Church, Users, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Church as ChurchType } from "@/lib/types";

type Path = "choose" | "create" | "join" | "done";

// ── Create church form ────────────────────────────────────────────────────────
const churchSchema = z.object({
  church_name: z.string().min(3, "Please enter the church name"),
  denomination: z.string().optional(),
  city: z.string().min(2, "Please enter the city"),
  state: z.string().length(2, "Please select a state"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});
type ChurchForm = z.infer<typeof churchSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("friend");
  const [path, setPath] = useState<Path>("choose");

  // Baker join state
  const [selectedState, setSelectedState] = useState("");
  const [churches, setChurches] = useState<ChurchType[]>([]);
  const [selectedChurch, setSelectedChurch] = useState("");
  const [joining, setJoining] = useState(false);

  // Church create state
  const [churchState, setChurchState] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChurchForm>({ resolver: zodResolver(churchSchema) });

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace("/login"); return; }
      setUserId(data.user.id);
      const name =
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name ||
        data.user.email?.split("@")[0] ||
        "friend";
      setUserName(name.split(" ")[0]);
    });
  }, [router]);

  // Load churches when state selected (join path)
  useEffect(() => {
    if (!selectedState) return;
    fetch(`/api/churches?state=${selectedState}`)
      .then((r) => r.json())
      .then(setChurches)
      .catch(() => setChurches([]));
  }, [selectedState]);

  // ── Join an existing church ─────────────────────────────────────────────────
  async function handleJoin() {
    if (!selectedChurch || !userId) return;
    setJoining(true);
    try {
      const { error } = await createClient()
        .from("profiles")
        .update({ role: "baker", church_id: selectedChurch })
        .eq("id", userId);
      if (error) throw error;
      setPath("done");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setJoining(false);
    }
  }

  // ── Create a church ─────────────────────────────────────────────────────────
  const onCreateChurch = async (data: ChurchForm) => {
    if (!userId) return;
    try {
      const supabase = createClient();
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "church_admin" })
        .eq("id", userId);
      if (profileError) throw profileError;

      const { error: churchError } = await supabase.from("churches").insert({
        name: data.church_name,
        denomination: data.denomination || null,
        city: data.city,
        state: data.state,
        website: data.website || null,
        admin_id: userId,
        approved: false,
      });
      if (churchError) throw churchError;
      setPath("done");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  // ── Done state ──────────────────────────────────────────────────────────────
  if (path === "done") {
    return (
      <div className="min-h-screen bg-wheat-texture flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-10 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-wheat mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-3">You&rsquo;re all set!</h1>
          <p className="text-muted-foreground mb-6">
            Your account is ready. Head to your dashboard to get started.
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
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-wheat flex items-center justify-center">
              <Wheat className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl">Our Daily Bread</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-8">
          {/* ── Step 1: Choose path ─────────────────────────────────────────── */}
          {path === "choose" && (
            <>
              <h1 className="font-serif text-2xl font-bold mb-1">
                Welcome, {userName}!
              </h1>
              <p className="text-muted-foreground mb-8">
                What would you like to do? You can always change this later.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPath("create")}
                  className="group text-left border-2 border-border hover:border-wheat rounded-2xl p-6 transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-wheat/10 flex items-center justify-center mb-4 group-hover:bg-wheat/20 transition-colors">
                    <Church className="w-6 h-6 text-wheat" />
                  </div>
                  <h2 className="font-serif text-lg font-bold mb-1">
                    Start a church ministry
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Register your church and become the admin for your bread program.
                  </p>
                  <span className="text-sm font-medium text-wheat flex items-center gap-1">
                    Register a church <ChevronRight className="w-4 h-4" />
                  </span>
                </button>

                <button
                  onClick={() => setPath("join")}
                  className="group text-left border-2 border-border hover:border-wheat rounded-2xl p-6 transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center mb-4 group-hover:bg-forest/20 transition-colors">
                    <Users className="w-6 h-6 text-forest" />
                  </div>
                  <h2 className="font-serif text-lg font-bold mb-1">
                    Join an existing church
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your church is already registered — find it and start logging sales.
                  </p>
                  <span className="text-sm font-medium text-forest flex items-center gap-1">
                    Find my church <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </>
          )}

          {/* ── Step 2a: Join a church ──────────────────────────────────────── */}
          {path === "join" && (
            <>
              <button
                onClick={() => { setPath("choose"); setSelectedState(""); setSelectedChurch(""); }}
                className="text-sm text-muted-foreground hover:text-wheat mb-4 flex items-center gap-1"
              >
                ← Back
              </button>
              <h1 className="font-serif text-2xl font-bold mb-1">Find your church</h1>
              <p className="text-muted-foreground mb-6">
                Select your state to see registered churches near you.
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Your state</Label>
                  <Select value={selectedState} onValueChange={(v) => { setSelectedState(v); setSelectedChurch(""); }}>
                    <SelectTrigger className="mt-1.5">
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
                    <Label>Select your church</Label>
                    {churches.length === 0 ? (
                      <div className="mt-1.5 p-4 bg-cream rounded-xl border border-wheat/20 text-sm text-muted-foreground">
                        No churches registered in {US_STATES.find((s) => s.value === selectedState)?.label} yet.{" "}
                        <button onClick={() => setPath("create")} className="text-wheat hover:underline">
                          Register yours
                        </button>{" "}
                        to be the first!
                      </div>
                    ) : (
                      <Select value={selectedChurch} onValueChange={setSelectedChurch}>
                        <SelectTrigger className="mt-1.5">
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
                  onClick={handleJoin}
                  disabled={!selectedChurch || joining}
                  className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base"
                >
                  {joining ? "Joining…" : "Join My Church"}
                </Button>
              </div>
            </>
          )}

          {/* ── Step 2b: Create a church ────────────────────────────────────── */}
          {path === "create" && (
            <>
              <button
                onClick={() => setPath("choose")}
                className="text-sm text-muted-foreground hover:text-wheat mb-4 flex items-center gap-1"
              >
                ← Back
              </button>
              <h1 className="font-serif text-2xl font-bold mb-1">Register your church</h1>
              <p className="text-muted-foreground mb-6">
                Your church will appear publicly once reviewed (usually within 24 hours).
              </p>

              <form onSubmit={handleSubmit(onCreateChurch)} className="space-y-4">
                <div>
                  <Label htmlFor="church-name">Church Name *</Label>
                  <Input
                    id="church-name"
                    {...register("church_name")}
                    placeholder="Grace Community Church"
                    className="mt-1.5"
                  />
                  {errors.church_name && (
                    <p className="text-xs text-destructive mt-1">{errors.church_name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="denomination">Denomination (optional)</Label>
                  <Input
                    id="denomination"
                    {...register("denomination")}
                    placeholder="Baptist, Non-denominational, Methodist..."
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Nashville"
                      className="mt-1.5"
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Select
                      value={churchState}
                      onValueChange={(v) => {
                        setChurchState(v);
                        setValue("state", v, { shouldValidate: true });
                      }}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-xs text-destructive mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Church Website (optional)</Label>
                  <Input
                    id="website"
                    {...register("website")}
                    placeholder="https://your-church.org"
                    className="mt-1.5"
                  />
                  {errors.website && (
                    <p className="text-xs text-destructive mt-1">{errors.website.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base"
                >
                  {isSubmitting ? "Registering…" : "Register My Church"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
