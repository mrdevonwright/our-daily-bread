"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Wheat, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/recipe", label: "Recipe" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/social", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

function getInitials(user: User): string {
  const name = user.user_metadata?.full_name || user.user_metadata?.name || "";
  if (name) {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (user.email?.[0] ?? "?").toUpperCase();
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowUserMenu(false);
    window.location.href = "/";
  }

  const initials = user ? getInitials(user) : "";

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
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-wheat gap-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                {/* Avatar + dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="w-9 h-9 rounded-full bg-wheat hover:bg-wheat-dark text-white text-sm font-bold flex items-center justify-center transition-colors"
                    aria-label="User menu"
                  >
                    {initials}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-border rounded-xl shadow-lg py-1.5 z-50">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-wheat">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup/church">
                  <Button size="sm" className="bg-wheat hover:bg-wheat-dark text-white">
                    Join the Movement
                  </Button>
                </Link>
              </>
            )}
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
          isOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
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
            {user ? (
              <>
                <p className="text-xs text-muted-foreground px-1 truncate">{user.email}</p>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full bg-wheat hover:bg-wheat-dark text-white gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-wheat/40 text-wheat hover:bg-wheat/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup/church" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full bg-wheat hover:bg-wheat-dark text-white">
                    Join the Movement
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
