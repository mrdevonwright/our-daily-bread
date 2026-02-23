"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { createClient } from "@/lib/supabase/client";
import { US_STATES } from "@/lib/constants";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import type { Church } from "@/lib/types";
import { GoogleAuthButton, OrDivider } from "./GoogleAuthButton";

const schema = z
  .object({
    full_name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
    church_id: z.string().min(1, "Please select your church"),
  })
  .refine((d) => d.password === d.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export function BakerJoinForm() {
  const [submitted, setSubmitted] = useState(false);
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedChurch, setSelectedChurch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Fetch churches when state is selected
  useEffect(() => {
    if (!selectedState) return;
    const fetchChurches = async () => {
      try {
        const res = await fetch(`/api/churches?state=${selectedState}`);
        const data = await res.json();
        setChurches(data);
      } catch {
        setChurches([]);
      }
    };
    fetchChurches();
  }, [selectedState]);

  const onSubmit = async (data: FormData) => {
    try {
      const supabase = createClient();

      // 1. Sign up
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
              role: "baker",
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Registration failed");

      // 2. Update profile with church_id
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ church_id: data.church_id })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-wheat mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold mb-3">
          Welcome to the Movement!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          Please check your email to verify your account. Once confirmed, you
          can sign in and start logging your bread sales.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleAuthButton
        next="/signup/baker/complete"
        label="Sign up with Google"
      />
      <OrDivider />

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="baker-name">Your Full Name *</Label>
          <Input
            id="baker-name"
            {...register("full_name")}
            placeholder="Jane Smith"
            className="mt-1.5"
          />
          {errors.full_name && (
            <p className="text-xs text-destructive mt-1">{errors.full_name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="baker-email">Email Address *</Label>
          <Input
            id="baker-email"
            type="email"
            {...register("email")}
            placeholder="jane@example.com"
            className="mt-1.5"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="baker-password">Password *</Label>
          <Input
            id="baker-password"
            type="password"
            {...register("password")}
            placeholder="Min. 8 characters"
            className="mt-1.5"
          />
          {errors.password && (
            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="baker-confirm">Confirm Password *</Label>
          <Input
            id="baker-confirm"
            type="password"
            {...register("confirm_password")}
            placeholder="Repeat password"
            className="mt-1.5"
          />
          {errors.confirm_password && (
            <p className="text-xs text-destructive mt-1">{errors.confirm_password.message}</p>
          )}
        </div>
      </div>

      {/* Find church by state */}
      <div>
        <Label>Find Your Church — Select State First</Label>
        <Select
          value={selectedState}
          onValueChange={(v) => {
            setSelectedState(v);
            setSelectedChurch("");
            setValue("church_id", "", { shouldValidate: false });
          }}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select your state..." />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedState && (
        <div>
          <Label>Select Your Church *</Label>
          {churches.length === 0 ? (
            <div className="mt-1.5 p-4 bg-cream rounded-xl border border-wheat/20 text-sm text-muted-foreground">
              No churches found in {US_STATES.find((s) => s.value === selectedState)?.label} yet.{" "}
              <a href="/signup/church" className="text-wheat hover:underline">
                Register your church
              </a>{" "}
              to be the first!
            </div>
          ) : (
            <Select
              value={selectedChurch}
              onValueChange={(v) => {
                setSelectedChurch(v);
                setValue("church_id", v, { shouldValidate: true });
              }}
            >
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
          {errors.church_id && (
            <p className="text-xs text-destructive mt-1">{errors.church_id.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base"
      >
        {isSubmitting ? "Joining…" : "Join as a Baker"}
      </Button>
    </form>
    </div>
  );
}
