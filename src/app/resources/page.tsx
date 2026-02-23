import type { Metadata } from "next";
import { ResourcesClientSection } from "./ResourcesClientSection";
import { ExternalLink, ShoppingBag, Package, FlameKindling, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Getting Started Resources — Our Daily Bread",
  description:
    "Everything you need to launch your bread ministry: printable signs, payment QR codes, and recommended vendors.",
};

const VENDOR_CATEGORIES = [
  {
    id: "sourdough-essentials",
    title: "Sourdough Essentials",
    icon: FlameKindling,
    color: "text-wheat",
    bg: "bg-wheat/10",
    description: "Everything to bake your first loaf",
    vendors: [
      {
        name: "King Arthur Baking",
        tag: "Flour & salt",
        note: "The gold standard for bread flour and fine sea salt. Their organic all-purpose flour is exactly what this recipe calls for.",
        url: "https://www.kingarthurbaking.com/",
        cta: "Shop King Arthur →",
      },
      {
        name: "Cultures for Health",
        tag: "Sourdough starter",
        note: "Reliable, shelf-stable sourdough starter cultures. Perfect if you don't have a baker to share with you yet.",
        url: "https://www.culturesforhealth.com/",
        cta: "Get a Starter →",
      },
      {
        name: "Sourdough Proofing Set (Etsy)",
        tag: "Banneton, lame & tools",
        note: "This is the exact kit we use — a wicker banneton, lame, dough scraper, and more. Everything in one box.",
        url: "https://www.etsy.com/ca/listing/1761175253/sourdough-bread-proofing-set-wicker",
        cta: "Get the Kit →",
      },
      {
        name: "Lodge Cast Iron",
        tag: "Dutch ovens",
        note: "A 5-qt Dutch oven is the secret to a perfect crust. You'll need two — one per loaf. Lodge's are affordable and last forever.",
        url: "https://www.lodgecastiron.com/",
        cta: "Shop Lodge →",
      },
    ],
  },
  {
    id: "packaging",
    title: "Bread Bags & Packaging",
    icon: Package,
    color: "text-forest",
    bg: "bg-forest/10",
    description: "Keep loaves fresh and looking beautiful",
    vendors: [
      {
        name: "Paper Mart",
        tag: "Kraft paper bags",
        note: "Affordable kraft bags in bulk. The 5×3×11″ bread bags are perfect for a standard sourdough boule.",
        url: "https://www.papermart.com/",
        cta: "Shop Paper Mart →",
      },
      {
        name: "Uline",
        tag: "Bulk packaging",
        note: "Bakery tissue paper, cellophane bags, twist ties, and boxes. Best prices when buying in bulk.",
        url: "https://www.uline.com/",
        cta: "Shop Uline →",
      },
      {
        name: "Nashville Wraps",
        tag: "Bakery bags",
        note: "Beautiful printed bakery bags and bread packaging. Great for a polished, professional look.",
        url: "https://www.nashvillewraps.com/",
        cta: "Shop Nashville Wraps →",
      },
    ],
  },
  {
    id: "display",
    title: "Display & Setup",
    icon: ShoppingBag,
    color: "text-burgundy",
    bg: "bg-burgundy/10",
    description: "Make your table look inviting",
    vendors: [
      {
        name: "Amazon — Bread Baskets",
        tag: "Wicker baskets",
        note: "Search \"wicker bread basket\" on Amazon. A lined wicker basket makes your table look warm and welcoming.",
        url: "https://www.amazon.com/s?k=wicker+bread+basket+lined",
        cta: "Search Amazon →",
      },
      {
        name: "Amazon — Chalkboard Signs",
        tag: "Table signs",
        note: "Small chalkboard A-frame signs let you write prices or messages. Reusable and charming.",
        url: "https://www.amazon.com/s?k=small+chalkboard+a+frame+sign+table",
        cta: "Search Amazon →",
      },
      {
        name: "Vistaprint",
        tag: "Custom labels",
        note: "Design custom stickers or labels with your church name and the Our Daily Bread logo. MOQ of 10.",
        url: "https://www.vistaprint.com/labels-stickers",
        cta: "Design Labels →",
      },
    ],
  },
  {
    id: "nice-to-haves",
    title: "Nice-to-Haves",
    icon: Sparkles,
    color: "text-wheat-dark",
    bg: "bg-wheat/5",
    description: "Level up your bread ministry",
    vendors: [
      {
        name: "OXO Kitchen Scale",
        tag: "Baking scale",
        note: "Sourdough recipes are measured by weight. Any digital scale works, but OXO is reliable and readable.",
        url: "https://www.amazon.com/s?k=OXO+kitchen+scale",
        cta: "Search Amazon →",
      },
      {
        name: "Thermoworks Thermapen",
        tag: "Instant-read thermometer",
        note: "Know exactly when your bread is done. Internal temp of 205°F = perfect loaf.",
        url: "https://www.thermoworks.com/thermapen/",
        cta: "Shop Thermoworks →",
      },
      {
        name: "Printful",
        tag: "Church aprons & t-shirts",
        note: "Custom printed aprons or t-shirts with your church's baker program branding. Ordered on-demand, no inventory.",
        url: "https://www.printful.com/",
        cta: "Design Merch →",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-wheat-texture section-padding border-b border-wheat/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-wheat font-semibold text-sm tracking-widest uppercase mb-3">
            Plug-and-Play Resources
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Get Started
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Click any link and go. Print your sign, set up payments, and grab
            your supplies — you can be selling loaves this Sunday.
          </p>
        </div>
      </section>

      <ResourcesClientSection />

      {/* Vendors */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <span className="inline-block bg-wheat/10 text-wheat text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Step 3 · Stock Up
            </span>
            <h2 className="font-serif text-3xl font-bold mb-2">
              Recommended Vendors
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Curated picks that real bakers use. Just click and order — these
              are the essentials to get you baking and selling quickly.
            </p>
          </div>

          <div className="space-y-12">
            {VENDOR_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} id={cat.id}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.vendors.map((v) => (
                      <a
                        key={v.name}
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-white border border-wheat/20 rounded-xl p-5 hover:border-wheat/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-wheat transition-colors">
                              {v.name}
                            </p>
                            <span className="inline-block text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full mt-1">
                              {v.tag}
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-wheat shrink-0 mt-0.5 transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                          {v.note}
                        </p>
                        <p className="text-sm font-medium text-wheat mt-3">
                          {v.cta}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-wheat/10 border-t border-wheat/20 py-12 px-4 text-center">
        <p className="font-serif text-xl font-semibold mb-1">
          Have a vendor to recommend?
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          We&rsquo;re always updating this list based on what bakers across the country are actually using.
        </p>
        <a
          href="/contact"
          className="inline-block bg-wheat hover:bg-wheat-dark text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Send Us a Tip →
        </a>
      </section>
    </div>
  );
}
