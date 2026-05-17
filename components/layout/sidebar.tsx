"use client";

import {useState, useSyncExternalStore} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  UserCog,
  ExternalLink,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

const navGroups: {
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

const COLLAPSED_STORAGE_KEY = "sidebar-collapsed";

function getCollapsedSnapshot(): boolean {
  try {
    const saved = localStorage.getItem(COLLAPSED_STORAGE_KEY);
    if (saved !== null) return JSON.parse(saved) as boolean;
  } catch {}
  return false;
}

function subscribeCollapsed(onStoreChange: () => void) {
  const onChange = () => onStoreChange();
  window.addEventListener("storage", onChange);
  window.addEventListener(COLLAPSED_STORAGE_KEY, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(COLLAPSED_STORAGE_KEY, onChange);
  };
}

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const mounted = useHydrated();
  const collapsed = useSyncExternalStore(subscribeCollapsed, getCollapsedSnapshot, () => false);
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const mobileOpen = mobileOpenPath === pathname;

  const toggle = () => {
    const next = !collapsed;
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(COLLAPSED_STORAGE_KEY));
    } catch {}
  };

  // Prevent layout shift on mount
  if (!mounted) {
    return <div className="border-border bg-card hidden w-60 shrink-0 border-r md:block" />;
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpenPath(pathname)}
        className={cn(
          "bg-card border-border fixed top-3 left-3 z-40 flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm md:hidden",
          "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
        )}
        title="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="bg-foreground/20 fixed inset-0 z-40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpenPath(null)}
        />
      )}

      <aside
        className={cn(
          "border-border bg-card flex h-screen shrink-0 flex-col border-r",
          "transition-all duration-200 ease-out",
          // Desktop: fixed sidebar
          "hidden md:relative md:flex",
          collapsed ? "md:w-16" : "md:w-60",
          // Mobile: overlay sidebar
          mobileOpen && "fixed inset-y-0 left-0 z-50 flex w-60",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "border-border flex h-14 items-center border-b",
            collapsed ? "justify-center px-2" : "justify-between px-3",
          )}
        >
          {!collapsed && (
            <Link
              href="/"
              onClick={() => setMobileOpenPath(null)}
              className="flex items-center gap-2.5"
            >
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                HP
              </div>
              <span className="text-foreground text-sm font-semibold">HeavenPro ATS</span>
            </Link>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpenPath(null)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors md:hidden"
            title="Close menu"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden h-8 w-8 items-center justify-center rounded-md md:flex",
              "text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
            )}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 overflow-y-auto py-3", collapsed ? "px-2" : "px-3")}>
          {navGroups.map((group, groupIndex) => (
            <div key={group.label} className={cn(groupIndex > 0 && "mt-6")}>
              {/* Group label */}
              {!collapsed && (
                <div className="mb-2 px-2">
                  <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                    {group.label}
                  </span>
                </div>
              )}

              {/* Collapsed separator */}
              {collapsed && groupIndex > 0 && <div className="bg-border mx-auto mb-3 h-px w-6" />}

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
                        onClick={() => setMobileOpenPath(null)}
                        title={collapsed ? item.name : undefined}
                        className={cn(
                          "group flex items-center rounded-md text-sm font-medium transition-colors",
                          collapsed ? "h-10 w-10 justify-center" : "h-9 gap-3 px-2",
                          isActive
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.name}</span>
                            {item.external && (
                              <ExternalLink className="text-muted-foreground h-3 w-3" />
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer / User */}
        <div className={cn("border-border border-t", collapsed ? "p-2" : "p-3")}>
          <div
            className={cn(
              "hover:bg-muted flex items-center rounded-md transition-colors",
              collapsed ? "h-10 w-10 justify-center" : "gap-3 px-2 py-2",
            )}
            title={collapsed ? "Recruitment Team - HeavenPro" : undefined}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
                RC
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">Recruitment Team</p>
                <p className="text-muted-foreground truncate text-xs">HeavenPro</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
