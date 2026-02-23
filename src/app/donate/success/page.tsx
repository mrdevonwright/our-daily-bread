import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You!",
};

export default function DonateSuccessPage() {
  return (
    <div className="min-h-screen bg-wheat-texture flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center bg-white rounded-2xl border border-wheat/20 shadow-sm p-12">
        <div className="w-16 h-16 rounded-full bg-wheat/10 flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8 text-wheat fill-wheat/30" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
          Thank You!
        </h1>

        <p className="text-muted-foreground mb-4 leading-relaxed">
          Your donation helps the Our Daily Bread movement grow and reach more
          churches across America. Every dollar goes back into building this
          community.
        </p>

        <blockquote className="scripture my-6 text-base">
          &ldquo;Give us this day our daily bread.&rdquo;
          <cite className="block not-italic text-xs text-wheat/70 mt-1">
            Matthew 6:11
          </cite>
        </blockquote>

        <p className="text-sm text-muted-foreground mb-8">
          You&rsquo;ll receive a receipt from Stripe by email. If you have any
          questions, email us at{" "}
          <a href="mailto:hello@ourdailybread.club" className="text-wheat hover:underline">
            hello@ourdailybread.club
          </a>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-wheat hover:bg-wheat-dark text-white">
              Back to Home
            </Button>
          </Link>
          <Link href="/signup/church">
            <Button variant="outline" className="w-full sm:w-auto border-wheat text-wheat hover:bg-wheat/10">
              Register Your Church
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
