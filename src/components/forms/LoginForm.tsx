"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
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
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="login-email">Email Address</Label>
        <Input
          id="login-email"
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

      <div>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="mt-1.5"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-wheat hover:bg-wheat-dark text-white py-5 text-base"
      >
        {loading ? "Signing In…" : "Sign In"}
      </Button>

      <div className="text-center space-y-2 pt-2">
        <p className="text-sm text-muted-foreground">
          Not registered yet?{" "}
          <Link href="/signup/church" className="text-wheat hover:underline font-medium">
            Register your church
          </Link>{" "}
          or{" "}
          <Link href="/signup/baker" className="text-wheat hover:underline font-medium">
            join as a baker
          </Link>
        </p>
      </div>
    </form>
  );
}
