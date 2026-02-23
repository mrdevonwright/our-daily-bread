"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/recipe", label: "Recipe" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/social", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-wheat/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-wheat flex items-center justify-center group-hover:bg-wheat-dark transition-colors">
              <Wheat className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-semibold text-lg text-foreground leading-tight">
              Our Daily Bread
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-wheat transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-wheat">
                Sign In
              </Button>
            </Link>
            <Link href="/signup/church">
              <Button
                size="sm"
                className="bg-wheat hover:bg-wheat-dark text-white"
              >
                Join the Movement
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-wheat"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t border-wheat/20 bg-white overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-wheat transition-colors py-1"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-wheat/20 space-y-2">
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full border-wheat/40 text-wheat hover:bg-wheat/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup/church" onClick={() => setIsOpen(false)}>
              <Button
                size="sm"
                className="w-full bg-wheat hover:bg-wheat-dark text-white"
              >
                Join the Movement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
