"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wheat,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const SIDEBAR_LINKS: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["baker", "church_admin", "super_admin"],
  },
  {
    href: "/dashboard/sales",
    label: "Log Sales",
    icon: ShoppingBag,
    roles: ["baker", "church_admin", "super_admin"],
  },
  {
    href: "/dashboard/members",
    label: "Members",
    icon: Users,
    roles: ["church_admin", "super_admin"],
  },
];

interface DashboardSidebarProps {
  role: UserRole;
  fullName: string;
}

export function DashboardSidebar({ role, fullName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const visibleLinks = SIDEBAR_LINKS.filter((link) =>
    link.roles.includes(role)
  );

  return (
    <aside className="w-64 bg-white border-r border-wheat/20 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-wheat/20">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-wheat flex items-center justify-center">
            <Wheat className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-serif font-semibold text-sm text-foreground">
            Our Daily Bread
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-wheat/20">
        <div className="bg-cream rounded-lg px-3 py-2">
          <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {role.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-wheat/10 text-wheat"
                  : "text-muted-foreground hover:bg-cream hover:text-wheat"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {link.label}
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto text-wheat/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-wheat/20">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-burgundy hover:bg-burgundy/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
