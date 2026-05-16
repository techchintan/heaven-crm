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
      {name: "Clients", href: "/clients", icon: Building2},
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
 *
 * Organized into sections:
 * - Overview: Quick access to main dashboard
 * - Management: CRUD operations for core entities
 * - Settings: Configuration and external links
 *
 * @example
 * ```tsx
 * <Sidebar />
 * ```
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-background flex h-screen w-60 flex-col border-r">
      {/* Logo Section */}
      <div className="border-border flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
            HP
          </div>
          <span className="text-foreground truncate font-semibold">HeavenPro ATS</span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((group, index) => (
          <div key={group.label} className={cn(index !== 0 && "mt-6")}>
            <h3 className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
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
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.external && <ExternalLink className="h-3 w-3 opacity-50" />}
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
      <div className="border-border border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>RC</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-medium">Recruitment Team</p>
            <p className="text-muted-foreground truncate text-xs">HeavenPro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
