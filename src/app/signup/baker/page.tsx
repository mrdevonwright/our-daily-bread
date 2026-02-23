import type { Metadata } from "next";
import { BakerJoinForm } from "@/components/forms/BakerJoinForm";
import { Wheat } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Join as a Baker",
  description:
    "Join the Our Daily Bread movement as a baker at your local church.",
};

export default function BakerSignupPage() {
  return (
    <div className="min-h-screen bg-wheat-texture py-12 px-4">
      <div className="max-w-2xl mx-auto">
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

        <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-8">
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold mb-2">
              Join as a Baker
            </h1>
            <p className="text-muted-foreground">
              Find your church and sign up to start logging your bread sales.
              Every loaf counts.
            </p>
          </div>
          <BakerJoinForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already registered?{" "}
          <Link href="/login" className="text-wheat hover:underline">
            Sign In
          </Link>{" "}
          ·{" "}
          <Link href="/signup/church" className="text-wheat hover:underline">
            Register a Church Instead
          </Link>
        </p>
      </div>
    </div>
  );
}
