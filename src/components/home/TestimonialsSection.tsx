import { TESTIMONIALS } from "@/lib/constants";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-3">
            Stories from the Movement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-colors"
            >
              <Quote className="w-8 h-8 text-wheat/40 mb-4" />
              <p className="text-white/85 leading-relaxed mb-6 font-serif italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-white text-sm">{t.author}</p>
                <p className="text-white/50 text-sm mt-0.5">{t.church}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
