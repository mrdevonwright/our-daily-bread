"use client";

import { useState } from "react";
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

const schema = z
  .object({
    church_name: z.string().min(3, "Please enter the church name"),
    denomination: z.string().optional(),
    city: z.string().min(2, "Please enter the city"),
    state: z.string().length(2, "Please select a state"),
    zip: z.string().optional(),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    admin_full_name: z.string().min(2, "Please enter your name"),
    admin_email: z.string().email("Please enter a valid email"),
    admin_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.admin_password === d.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export function ChurchSignupForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedState, setSelectedState] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const supabase = createClient();

      // 1. Create auth user
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: data.admin_email,
          password: data.admin_password,
          options: {
            data: {
              full_name: data.admin_full_name,
              role: "church_admin",
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // 2. Create church record (pending approval)
      const { error: churchError } = await supabase
        .from("churches")
        .insert({
          name: data.church_name,
          denomination: data.denomination || null,
          city: data.city,
          state: data.state,
          zip: data.zip || null,
          website: data.website || null,
          admin_id: authData.user.id,
          approved: false,
        });

      if (churchError) throw churchError;

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
          Church Registered!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          We&rsquo;ve received your registration. Please check your email to
          verify your account. Your church will be listed on the site once
          approved (usually within 24 hours).
        </p>
        <p className="text-sm text-muted-foreground">
          Questions? Email us at{" "}
          <a href="mailto:hello@ourdailybread.club" className="text-wheat">
            hello@ourdailybread.club
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Church details */}
      <fieldset>
        <legend className="font-serif text-lg font-semibold mb-4 pb-2 border-b border-wheat/20 w-full">
          Church Details
        </legend>
        <div className="space-y-4">
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
              <Label htmlFor="church-city">City *</Label>
              <Input
                id="church-city"
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
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
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
        </div>
      </fieldset>

      {/* Admin account */}
      <fieldset>
        <legend className="font-serif text-lg font-semibold mb-4 pb-2 border-b border-wheat/20 w-full">
          Your Admin Account
        </legend>
        <div className="space-y-4">
          <div>
            <Label htmlFor="admin-name">Your Full Name *</Label>
            <Input
              id="admin-name"
              {...register("admin_full_name")}
              placeholder="Pastor John Smith"
              className="mt-1.5"
            />
            {errors.admin_full_name && (
              <p className="text-xs text-destructive mt-1">{errors.admin_full_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="admin-email">Email Address *</Label>
            <Input
              id="admin-email"
              type="email"
              {...register("admin_email")}
              placeholder="pastor@your-church.org"
              className="mt-1.5"
            />
            {errors.admin_email && (
              <p className="text-xs text-destructive mt-1">{errors.admin_email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admin-password">Password *</Label>
              <Input
                id="admin-password"
                type="password"
                {...register("admin_password")}
                placeholder="Min. 8 characters"
                className="mt-1.5"
              />
              {errors.admin_password && (
                <p className="text-xs text-destructive mt-1">{errors.admin_password.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password *</Label>
              <Input
                id="confirm-password"
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
        </div>
      </fieldset>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base"
      >
        {isSubmitting ? "Registering…" : "Register My Church"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        After registering, your church will be reviewed before appearing
        publicly on the site (usually within 24 hours).
      </p>
    </form>
  );
}
