"use client";

import {cn} from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Header Component
 *
 * Clean page header with title and optional subtitle.
 */
export function Header({title, subtitle, className}: HeaderProps) {
  return (
    <header className={cn("border-border bg-card flex h-16 items-center border-b px-6 pl-16 md:pl-6", className)}>
      <div className="flex flex-col gap-0.5">
        <h1 className="text-foreground text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>
    </header>
  );
}
