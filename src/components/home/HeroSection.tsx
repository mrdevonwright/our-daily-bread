import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-foreground">
      {/* Background image placeholder — replace with real photo in production */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero-bread.jpg')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <span className="inline-block mb-6 px-4 py-1.5 bg-wheat/20 border border-wheat/40 rounded-full text-wheat text-sm font-medium tracking-wide">
          A National Movement
        </span>

        {/* Headline */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Give Us This Day
          <br />
          <span className="text-wheat">Our Daily Bread</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-4 leading-relaxed">
          A movement of Christian bakers selling sourdough at church — redirecting
          America&rsquo;s bread dollars back to local congregations, one loaf at a time.
        </p>

        <p className="text-base text-white/60 max-w-xl mx-auto mb-10 italic font-serif">
          &ldquo;Man shall not live on bread alone — but why not bless your church
          with the bread you do buy?&rdquo;
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup/church">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-wheat hover:bg-wheat-dark text-white font-medium text-base px-8 py-6"
            >
              Register Your Church
            </Button>
          </Link>
          <Link href="/signup/baker">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white/60 text-white hover:bg-white/10 hover:border-white font-medium text-base px-8 py-6 bg-transparent"
            >
              Join as a Baker
            </Button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </div>
    </section>
  );
}
