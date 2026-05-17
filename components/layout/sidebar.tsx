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
  PanelLeftClose,
  PanelLeftOpen,
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

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved !== null) setCollapsed(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  if (!mounted) return <div className="w-64 shrink-0 border-r border-border bg-card" />;

  return (
    <aside
      className={cn(
        "relative flex h-screen shrink-0 flex-col border-r border-border bg-card",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[64px]" : "w-[240px]",
      )}
    >
      {/* Header */}
      <div className="flex h-[60px] items-center justify-between border-b border-border px-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 overflow-hidden",
            collapsed && "pointer-events-none",
          )}
          tabIndex={collapsed ? -1 : undefined}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            HP
          </div>
          <span
            className={cn(
              "whitespace-nowrap text-sm font-semibold tracking-tight text-foreground",
              "transition-[opacity,width] duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            HeavenPro ATS
          </span>
        </Link>

        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
            "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={cn(groupIndex > 0 && "mt-1")}>
            {/* Group label — fades out when collapsed */}
            <div
              className={cn(
                "mb-1 overflow-hidden transition-[max-height,opacity] duration-300",
                collapsed ? "max-h-0 opacity-0" : "max-h-8 opacity-100",
              )}
            >
              <span className="block px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </span>
            </div>

            {/* Collapsed: thin separator between groups */}
            {groupIndex > 0 && collapsed && (
              <div className="mx-4 mb-2 h-px bg-border" />
            )}

            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      title={collapsed ? item.name : undefined}
                      className={cn(
                        "group flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium",
                        "transition-colors duration-150",
                        isActive
                          ? "bg-primary/8 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span
                        className={cn(
                          "flex-1 whitespace-nowrap transition-[opacity,width] duration-300",
                          collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100",
                        )}
                      >
                        {item.name}
                      </span>
                      {!collapsed && item.external && (
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/60" />
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
      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2 py-2",
            "transition-colors hover:bg-muted",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Recruitment Team · HeavenPro" : undefined}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
              RC
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "min-w-0 transition-[opacity,width] duration-300",
              collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100",
            )}
          >
            <p className="truncate text-[13px] font-medium leading-tight text-foreground">
              Recruitment Team
            </p>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">HeavenPro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
