"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  UserCog,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

const navItems: {
  label: string;
  items: {name: string; href: string; icon: LucideIcon; external?: boolean}[];
}[] = [
  {
    label: "Overview",
    items: [{name: "Dashboard", href: "/", icon: LayoutDashboard}],
  },
  {
    label: "Management",
    items: [
      {name: "Placements", href: "/placements", icon: FileText},
      {name: "Candidates", href: "/candidates", icon: Users},
      {name: "Vendors", href: "/vendors", icon: Building2},
      {name: "Team", href: "/team", icon: UserCog},
    ],
  },
  {
    label: "Settings",
    items: [{name: "Sanity Studio", href: "/studio", icon: ExternalLink, external: true}],
  },
];

/**
 * Sidebar Component
 *
 * Main navigation sidebar with grouped navigation items, logo, and user profile section.
 * Uses shadcn Avatar and Separator for consistent component usage.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            HP
          </div>
          <span className="truncate text-base font-semibold tracking-tight text-foreground">
            HeavenPro ATS
          </span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navItems.map((group, index) => (
          <div key={group.label} className={cn(index !== 0 && "mt-7")}>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start h-9 px-3",
                          isActive && "bg-muted font-medium shadow-sm"
                        )}
                      >
                        <Icon className="mr-2.5 h-4 w-4" />
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.external && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <Avatar className="h-9 w-9 shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              RC
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">Recruitment Team</p>
            <p className="truncate text-xs text-muted-foreground">HeavenPro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
