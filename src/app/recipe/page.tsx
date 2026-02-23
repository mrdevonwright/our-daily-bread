import type { Metadata } from "next";
import {
  RECIPE_INGREDIENTS,
  RECIPE_EQUIPMENT,
  RECIPE_STEPS,
  SELLING_TIPS,
} from "@/lib/constants";
import { CheckCircle2, Clock, ChefHat, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Sourdough Recipe",
  description:
    "Our recommended sourdough bread recipe with day-by-day timing. Everything you need to start baking for your church.",
};

export default function RecipePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            The Foundation
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-6">
            Our Recommended
            <br />
            <span className="text-wheat">Sourdough Recipe</span>
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto leading-relaxed">
            This is the recipe that started it all. Simple enough for beginners,
            delicious enough that people come back every Sunday. Yields 2 loaves.
          </p>
        </div>
      </section>

      {/* Quick stats bar */}
      <section className="bg-white border-b border-wheat/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: Clock, label: "Total Time", value: "18–24 hours (mostly hands-off)" },
              { icon: ChefHat, label: "Active Work", value: "~45 minutes" },
              { icon: CheckCircle2, label: "Skill Level", value: "Beginner-friendly" },
              { icon: TrendingUp, label: "Yield", value: "2 loaves (~900g each)" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 py-2">
                <Icon className="w-5 h-5 text-wheat mb-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients + Equipment */}
      <section className="section-padding bg-wheat-texture">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div className="bg-white rounded-2xl p-8 border border-wheat/15 shadow-sm">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-wheat">🌾</span> Ingredients
              </h2>
              <ul className="space-y-3">
                {RECIPE_INGREDIENTS.map((ing) => (
                  <li
                    key={ing.item}
                    className="flex items-start justify-between gap-4 pb-3 border-b border-cream last:border-0 last:pb-0"
                  >
                    {ing.link ? (
                      <Link
                        href={ing.link}
                        className="font-medium text-wheat hover:underline text-sm"
                      >
                        {ing.item} →
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground text-sm">{ing.item}</span>
                    )}
                    <span className="text-muted-foreground text-sm text-right shrink-0">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-2xl p-8 border border-wheat/15 shadow-sm">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-wheat">🍳</span> Equipment
              </h2>
              <ul className="space-y-2">
                {RECIPE_EQUIPMENT.map((eq) => (
                  <li
                    key={eq.item}
                    className="flex items-start gap-3 pb-2 border-b border-cream last:border-0 last:pb-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-wheat mt-0.5 shrink-0" />
                    {eq.link ? (
                      <Link
                        href={eq.link}
                        className="text-sm text-wheat hover:underline"
                      >
                        {eq.item} →
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">{eq.item}</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-wheat/5 rounded-xl border border-wheat/20">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Don&rsquo;t have a starter?</strong> Just reach out to us or any one of your church bakers and ask them for some — sharing starter is half the joy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Instructions */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Day-by-Day Process
            </h2>
            <p className="text-muted-foreground">
              The bread is almost entirely hands-off. The active work is spread
              over 12 to 24 hours in short bursts. The longer you take, the
              more depth and complexity you&rsquo;ll get in the bread. But
              it&rsquo;s truly an art, so don&rsquo;t feel too much pressure to
              stick to the script! Feel free to experiment with the time you
              take at each step to see what you get. That&rsquo;s half the fun!
            </p>
          </div>

          <div className="space-y-6">
            {RECIPE_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative pl-8 border-l-2 border-wheat/20 pb-6 last:pb-0"
              >
                {/* Timeline dot */}
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-wheat flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>

                <div className="bg-white border border-wheat/15 rounded-xl p-6 shadow-sm hover:border-wheat/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="text-xs text-wheat font-medium uppercase tracking-wider">
                        {step.day}
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-foreground mt-1">
                        {step.title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-cream px-3 py-1.5 rounded-full whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {step.duration}
                    </span>
                  </div>
                  <ol className="space-y-2">
                    {step.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-5 h-5 rounded-full bg-wheat/10 text-wheat flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                  {step.tip && (
                    <div className="mt-4 p-3.5 bg-wheat/5 border border-wheat/20 rounded-lg">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-wheat">Tip: </span>
                        {step.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selling Tips */}
      <section id="selling-tips" className="section-padding bg-wheat-texture">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-wheat text-sm font-medium uppercase tracking-widest">
              For Church Bakers
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Selling Tips
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Making a great loaf is half the battle. Here&rsquo;s how to make Sunday
              sales effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SELLING_TIPS.map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-wheat/15 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-wheat text-white flex items-center justify-center text-sm font-bold font-serif mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment section anchor for footer link */}
      <div id="equipment" />
    </div>
  );
}
