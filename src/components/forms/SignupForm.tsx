"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { GoogleAuthButton, OrDivider } from "./GoogleAuthButton";

const schema = z
  .object({
    full_name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (error) throw error;
      router.push("/onboarding");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <GoogleAuthButton next="/onboarding" label="Sign up with Google" />
      <OrDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full-name">Your Name</Label>
          <Input
            id="full-name"
            {...register("full_name")}
            placeholder="Jane Smith"
            className="mt-1.5"
            autoComplete="name"
          />
          {errors.full_name && (
            <p className="text-xs text-destructive mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="signup-email">Email Address</Label>
          <Input
            id="signup-email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="mt-1.5"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
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
            <Label htmlFor="signup-confirm">Confirm</Label>
            <Input
              id="signup-confirm"
              type="password"
              {...register("confirm_password")}
              placeholder="Repeat"
              className="mt-1.5"
            />
            {errors.confirm_password && (
              <p className="text-xs text-destructive mt-1">{errors.confirm_password.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base"
        >
          {loading ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-wheat hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
