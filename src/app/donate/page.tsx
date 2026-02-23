import type { Metadata } from "next";
import DonateClient from "./DonateClient";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support the Our Daily Bread movement and help it spread to churches across America.",
};

export default function DonatePage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-foreground text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            Support the Movement
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-4">
            Help Us Grow
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Donations help us build tools, recruit churches, and spread the
            movement across America. Every dollar goes back into growing this
            community.
          </p>
        </div>
      </section>

      <section className="section-padding bg-wheat-texture">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Why donate */}
            <div className="space-y-5 lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-wheat/15 shadow-sm">
                <h3 className="font-serif text-lg font-semibold mb-3">
                  Where Your Gift Goes
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Website hosting and development",
                    "Movement marketing and outreach",
                    "Baker education resources",
                    "Church recruitment tools",
                    "Sourdough starter distribution",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-wheat mt-0.5">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <blockquote className="bg-wheat/5 border-l-4 border-wheat rounded-r-xl p-5">
                <p className="font-serif italic text-foreground text-sm leading-relaxed">
                  &ldquo;Give us this day our daily bread.&rdquo;
                </p>
                <cite className="text-xs text-wheat not-italic block mt-2">
                  Matthew 6:11
                </cite>
              </blockquote>
            </div>

            {/* Donation form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm p-8">
                <h2 className="font-serif text-2xl font-bold mb-6">
                  Make a Donation
                </h2>
                <DonateClient />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
