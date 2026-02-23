import Link from "next/link";
import { Wheat, Heart } from "lucide-react";

const FOOTER_LINKS = {
  Movement: [
    { href: "/about", label: "About" },
    { href: "/recipe", label: "The Recipe" },
    { href: "/blog", label: "Blog" },
    { href: "/social", label: "Stories" },
  ],
  "Get Involved": [
    { href: "/signup/church", label: "Register Your Church" },
    { href: "/signup/baker", label: "Join as a Baker" },
    { href: "/donate", label: "Donate" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  Resources: [
    { href: "/recipe#selling-tips", label: "Selling Tips" },
    { href: "/recipe#equipment", label: "Equipment Guide" },
    { href: "/contact", label: "Contact Us" },
    { href: "/blog", label: "Baker Stories" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-cream-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-wheat flex items-center justify-center">
                <Wheat className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-semibold text-lg text-white">
                Our Daily Bread
              </span>
            </Link>
            <p className="text-sm text-cream/70 leading-relaxed mb-4">
              A movement redirecting America&rsquo;s bread dollars back to local
              churches — one loaf at a time.
            </p>
            <p className="scripture text-sm border-l-2 border-wheat/50 pl-3">
              &ldquo;Give us this day our daily bread.&rdquo;
              <br />
              <span className="text-wheat/80 not-italic text-xs">Matthew 6:11</span>
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-serif font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 hover:text-wheat transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/50">
            © {currentYear} Our Daily Bread Movement. All rights reserved.
          </p>
          <p className="text-sm text-cream/50 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-wheat fill-wheat" /> and sourdough starter
          </p>
        </div>
      </div>
    </footer>
  );
}
