import type { Metadata } from "next";
import { ChurchSignupForm } from "@/components/forms/ChurchSignupForm";
import { Wheat } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register Your Church",
  description:
    "Sign up to bring the Our Daily Bread movement to your congregation.",
};

export default function ChurchSignupPage() {
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
              Register Your Church
            </h1>
            <p className="text-muted-foreground">
              Join the movement. Start selling fresh sourdough at your church
              and redirect your congregation&rsquo;s bread spend back to the church.
            </p>
          </div>

          <ChurchSignupForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already registered?{" "}
          <Link href="/login" className="text-wheat hover:underline">
            Sign In
          </Link>{" "}
          ·{" "}
          <Link href="/signup/baker" className="text-wheat hover:underline">
            Join as a Baker Instead
          </Link>
        </p>
      </div>
    </div>
  );
}
