import type { Metadata } from "next";
import { BibleVerseAccordion } from "@/components/about/BibleVerseAccordion";
import { ImpactCalculator } from "@/components/about/ImpactCalculator";
import { NATIONAL_BREAD_STATS } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About the Movement",
  description:
    "Learn how Our Daily Bread redirects America's $30 billion bread spend back to local churches through community baking.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            The Mission
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
            Redirecting America&rsquo;s Bread Spend
            <br />
            <span className="text-wheat">Back to the Church</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-2xl mx-auto">
            What started with one man baking sourdough for his congregation
            has become a vision to transform how Christians spend one of
            life&rsquo;s most basic necessities — and fund the local church in the
            process.
          </p>
        </div>
      </section>

      {/* The Story */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
            How It Started
          </h2>
          <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p className="text-lg">
              Three months ago, something unexpected happened. I started baking
              sourdough bread. Every day. And something about the rhythm of it —
              the patience, the waiting, the transformation of simple ingredients
              into something nourishing — felt deeply spiritual.
            </p>
            <p>
              I felt compelled by God to share it. So I started giving loaves to
              people at church. They loved it. Then a thought struck me: what if
              I sold it? What if the entire congregation redirected their weekly
              bread purchase — money they were already going to spend — to buy
              from their own church family instead?
            </p>
            <p>
              I ran a pilot. Five loaves. Sold out immediately. I made $56, donated
              it to the church. The demand could have supported ten or twenty
              loaves. Then the bigger thought hit:
            </p>
            <blockquote className="scripture text-lg">
              What if every Christian in America did this?
            </blockquote>
            <p>
              Americans spend over{" "}
              <strong>${NATIONAL_BREAD_STATS.annual_us_bread_market_billions} billion</strong>{" "}
              on bread every year. The average household spends{" "}
              <strong>${NATIONAL_BREAD_STATS.avg_household_annual_spend}/year</strong>. Nearly all of it
              flows to corporations and commercial bakeries. What if even a small
              fraction flowed back to local churches instead?
            </p>
            <p>
              With {NATIONAL_BREAD_STATS.us_christians_millions} million Christians
              and {NATIONAL_BREAD_STATS.us_churches_total.toLocaleString()} churches in America,
              the potential is staggering. This is Our Daily Bread.
            </p>
          </div>
        </div>
      </section>

      {/* National Stats */}
      <section className="section-padding bg-wheat-texture">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            The National Opportunity
          </h2>
          <p className="text-muted-foreground text-lg">
            The numbers behind the vision.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              value: `$${NATIONAL_BREAD_STATS.annual_us_bread_market_billions}B`,
              label: "Annual US bread market",
            },
            {
              value: `$${NATIONAL_BREAD_STATS.avg_household_annual_spend}`,
              label: "Avg. household bread spend per year",
            },
            {
              value: `${NATIONAL_BREAD_STATS.us_christians_millions}M`,
              label: "Christians in America",
            },
            {
              value: NATIONAL_BREAD_STATS.us_churches_total.toLocaleString(),
              label: "Churches across the US",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 text-center border border-wheat/15 shadow-sm"
            >
              <div className="font-serif text-4xl font-bold text-wheat mb-2">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Calculator */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            Your Church
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            What Could Your Church Raise?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter your congregation size to see the potential annual impact if your
            members bought their bread from church bakers instead.
          </p>
        </div>
        <ImpactCalculator />
      </section>

      {/* Bible Verses */}
      <section className="section-padding bg-cream border-t border-wheat/20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            Scripture
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            What the Bible Says About Bread
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From manna in the desert to the Lord&rsquo;s Prayer to the Last Supper,
            bread is woven throughout Scripture as a sign of God&rsquo;s provision,
            community, and the body of Christ. Click each verse to read and reflect.
          </p>
        </div>
        <BibleVerseAccordion />
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Be Part of the Movement
          </h2>
          <p className="text-white/75 mb-8">
            Register your church or join as a baker. It begins with one loaf.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-wheat hover:bg-wheat-dark text-white font-medium px-8 py-5"
              >
                Register Your Church
              </Button>
            </Link>
            <Link href="/recipe">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white/60 text-white hover:bg-white/10 bg-transparent font-medium px-8 py-5"
              >
                Get the Recipe
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
