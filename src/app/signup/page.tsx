import type { Metadata } from "next";
import { SignupForm } from "@/components/forms/SignupForm";
import { Wheat } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account — Our Daily Bread",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-wheat-texture flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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

        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-8">
          <h1 className="font-serif text-2xl font-bold mb-1">Join the Movement</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Create your account — we&rsquo;ll help you set up your church or find one to join.
          </p>
          <SignupForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up you agree to our{" "}
          <Link href="/contact" className="text-wheat hover:underline">
            terms of service
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
