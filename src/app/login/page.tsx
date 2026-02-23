import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/LoginForm";
import Link from "next/link";
import { Wheat } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-wheat-texture flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-wheat flex items-center justify-center">
              <Wheat className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl text-foreground">
              Our Daily Bread
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-8">
          <h1 className="font-serif text-2xl font-bold text-foreground mb-1">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to your baker or church admin account.
          </p>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in you agree to our{" "}
          <Link href="/contact" className="text-wheat hover:underline">
            terms of service
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
