import * as React from "react";

import {cn} from "@/lib/utils";

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {size?: "default" | "sm"}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card bg-card text-card-foreground border-border flex flex-col overflow-hidden rounded-lg border shadow-sm transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({className, ...props}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
      {...props}
    />
  );
}

function CardTitle({className, ...props}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-foreground text-base leading-snug font-semibold tracking-tight group-data-[size=sm]/card:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({className, ...props}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({className, ...props}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({className, ...props}: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-5 pt-4", className)} {...props} />;
}

function CardFooter({className, ...props}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("bg-muted/30 border-border flex items-center border-t px-5 py-4", className)}
      {...props}
    />
  );
}

export {Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent};
