import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsTicker } from "@/components/home/StatsTicker";
import { MissionSection } from "@/components/home/MissionSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import type { GlobalStats } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Daily Bread — A Movement to Fund Churches Through Sourdough",
};

// Fallback stats shown before real data loads
const FALLBACK_STATS: GlobalStats = {
  id: 1,
  total_churches: 0,
  total_bakers: 0,
  total_loaves: 0,
  total_raised: 0,
  updated_at: new Date().toISOString(),
};

async function getStats(): Promise<GlobalStats> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return FALLBACK_STATS;
    return res.json();
  } catch {
    return FALLBACK_STATS;
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <>
      <HeroSection />
      <StatsTicker initialStats={stats} />
      <MissionSection />
      <TestimonialsSection />

      {/* Final CTA Banner */}
      <section className="bg-wheat py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Church&rsquo;s Bread Ministry?
          </h2>
          <p className="text-white/85 text-lg mb-8 leading-relaxed">
            It starts with one baker, one loaf, and one Sunday. We give you
            everything you need — the recipe, the framework, and a community
            of fellow bakers across the nation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup/church">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-wheat hover:bg-cream font-semibold px-8 py-5 text-base"
              >
                Register Your Church
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white/60 text-white hover:bg-white/10 bg-transparent font-medium px-8 py-5 text-base"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
