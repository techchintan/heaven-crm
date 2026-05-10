"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  UserCog,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Placements", href: "/placements", icon: FileText },
      { name: "Candidates", href: "/candidates", icon: Users },
      { name: "Clients", href: "/clients", icon: Building2 },
      { name: "Team", href: "/team", icon: UserCog },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "Sanity Studio", href: "/studio", icon: ExternalLink, external: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            HP
          </div>
          <span className="font-semibold text-foreground">HeavenPro CRM</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((group) => (
          <div key={group.label} className="mb-6">
            <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-muted text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                      {item.external && (
                        <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            RC
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-foreground">Recruitment Team</p>
            <p className="truncate text-xs">HeavenPro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
