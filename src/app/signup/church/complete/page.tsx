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
import { Wheat, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  church_name: z.string().min(3, "Please enter the church name"),
  denomination: z.string().optional(),
  city: z.string().min(2, "Please enter the city"),
  state: z.string().length(2, "Please select a state"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function ChurchCompletePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Verify user is logged in, grab their name from Google
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUserId(data.user.id);
        setUserName(data.user.user_metadata?.full_name || data.user.email || "");
      }
    });
  }, [router]);

  const onSubmit = async (data: FormData) => {
    if (!userId) return;
    try {
      const supabase = createClient();

      // Update profile role
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "church_admin", full_name: userName })
        .eq("id", userId);
      if (profileError) throw profileError;

      // Create church (pending approval)
      const { error: churchError } = await supabase
        .from("churches")
        .insert({
          name: data.church_name,
          denomination: data.denomination || null,
          city: data.city,
          state: data.state,
          website: data.website || null,
          admin_id: userId,
          approved: false,
        });
      if (churchError) throw churchError;

      setSubmitted(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-wheat-texture flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-10 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-wheat mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-3">Church Registered!</h1>
          <p className="text-muted-foreground mb-2">
            Your church is pending review and will appear publicly within 24 hours.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Questions?{" "}
            <a href="mailto:hello@ourdailybread.club" className="text-wheat hover:underline">
              hello@ourdailybread.club
            </a>
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
      <div className="max-w-lg mx-auto">
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
            Tell us about your church to complete your registration.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  value={selectedState}
                  onValueChange={(v) => {
                    setSelectedState(v);
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
              className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base mt-2"
            >
              {isSubmitting ? "Registering…" : "Register My Church"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your church will be reviewed before appearing publicly (usually within 24 hours).
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
