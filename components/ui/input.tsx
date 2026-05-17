import * as React from "react";
import {Input as InputPrimitive} from "@base-ui/react/input";

import {cn} from "@/lib/utils";

function Input({className, type, ...props}: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background aria-invalid:border-danger aria-invalid:ring-danger/20 flex h-9 w-full min-w-0 rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export {Input};
