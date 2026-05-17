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
    <header
      className={cn(
        "flex h-16 items-center border-b border-border bg-card px-6",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  );
}
