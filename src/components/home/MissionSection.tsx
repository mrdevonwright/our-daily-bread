import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NATIONAL_BREAD_STATS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, Heart, Globe } from "lucide-react";

export function MissionSection() {
  return (
    <section className="section-padding bg-wheat-texture">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            The Vision
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            What If Every Christian Bought
            <br />
            <span className="text-wheat">Their Bread from Their Church?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Americans spend over{" "}
            <strong className="text-foreground">
              ${NATIONAL_BREAD_STATS.annual_us_bread_market_billions} billion
            </strong>{" "}
            on bread every year. Nearly all of it goes to corporations and
            commercial bakeries. What if even a fraction of that went back to
            the local church instead?
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-wheat/15 text-center group hover:border-wheat/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-wheat/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-wheat/20 transition-colors">
              <Heart className="w-6 h-6 text-wheat" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-3">
              Baked with Purpose
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every loaf is a spiritual act. Home bakers in our movement bake
              not just with flour and water, but with prayer and intention,
              offering their time and skill as an act of worship.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-wheat/15 text-center group hover:border-wheat/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-wheat/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-wheat/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-wheat" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-3">
              Sold at Church
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every Sunday, bakers bring their fresh loaves to sell after
              service. Congregation members buy the bread they would have
              purchased elsewhere — and the money stays in the community.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-wheat/15 text-center group hover:border-wheat/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-wheat/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-wheat/20 transition-colors">
              <Globe className="w-6 h-6 text-wheat" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-3">
              A National Movement
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Imagine{" "}
              {formatNumber(NATIONAL_BREAD_STATS.us_churches_total)}{" "}
              churches across America each with their own bakers. Hundreds of
              millions of dollars redirected from corporations to communities
              of faith.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/about">
            <Button
              className="bg-wheat hover:bg-wheat-dark text-white font-medium px-8 py-5 text-base mr-4"
            >
              See the Full Impact
            </Button>
          </Link>
          <Link href="/recipe">
            <Button
              variant="outline"
              className="border-wheat text-wheat hover:bg-wheat/10 font-medium px-8 py-5 text-base"
            >
              Get the Recipe
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
