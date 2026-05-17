"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  UserCog,
  ExternalLink,
  ChevronLeft,
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
 * Collapsible navigation sidebar with grouped navigation items, logo, and user profile section.
 * State persists to localStorage for user preference.
 */
export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  if (!isMounted) return null;

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              HP
            </div>
            <span className="truncate text-base font-semibold tracking-tight text-foreground">
              HeavenPro ATS
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="flex items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              HP
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleToggle}
          className="ml-auto"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navItems.map((group, index) => (
          <div key={group.label} className={cn(index !== 0 && "mt-7")}>
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h3>
            )}
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
                          "h-9 px-3",
                          isCollapsed ? "w-9 justify-center p-0" : "w-full justify-start",
                          isActive && "bg-muted font-medium shadow-sm"
                        )}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2.5")} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">{item.name}</span>
                            {item.external && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            )}
                          </>
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
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5",
            isCollapsed && "justify-center p-2"
          )}
          title={isCollapsed ? "Recruitment Team" : undefined}
        >
          <Avatar className="h-9 w-9 shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              RC
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">Recruitment Team</p>
              <p className="truncate text-xs text-muted-foreground">HeavenPro</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
