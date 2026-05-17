"use client";

import {Search, Bell, RefreshCw} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  className?: string;
}

/**
 * Header Component
 *
 * Navigation header with title, search functionality, refresh button, and notifications.
 */
export function Header({title, subtitle, onRefresh, className}: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-border bg-card px-6",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative hidden md:flex">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="text" placeholder="Search..." className="w-64 pl-9" />
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh data"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        )}

        {/* Notifications Button */}
        <Button variant="outline" size="icon-sm" className="relative" title="View notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}
