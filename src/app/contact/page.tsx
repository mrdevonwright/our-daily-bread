import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, MessageSquare, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Our Daily Bread movement team.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-foreground text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-wheat text-sm font-medium uppercase tracking-widest">
            Get in Touch
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-4">
            Contact Us
          </h1>
          <p className="text-white/70">
            Questions about starting at your church? Want to partner with us?
            We&rsquo;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-padding bg-wheat-texture">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-wheat/15 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-wheat/10 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-wheat" />
                </div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground">
                  hello@ourdailybread.club
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-wheat/15 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-wheat/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-wheat" />
                </div>
                <h3 className="font-semibold mb-1">Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  We respond to all messages within 2 business days.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-wheat/15 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-wheat/10 flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-wheat" />
                </div>
                <h3 className="font-semibold mb-1">Social</h3>
                <p className="text-sm text-muted-foreground">
                  Tag us{" "}
                  <span className="text-wheat">#OurDailyBreadMovement</span> on
                  X and Instagram.
                </p>
              </div>

              <div className="bg-wheat/5 rounded-2xl p-6 border border-wheat/20">
                <blockquote className="scripture text-sm">
                  &ldquo;Give us this day our daily bread.&rdquo;
                  <cite className="block not-italic text-xs text-wheat/70 mt-1">
                    Matthew 6:11
                  </cite>
                </blockquote>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-wheat/15 shadow-sm">
              <h2 className="font-serif text-2xl font-bold mb-2">
                Send a Message
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Whether you&rsquo;re a pastor curious about starting a bread ministry
                or a baker wanting to connect — we want to hear from you.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
