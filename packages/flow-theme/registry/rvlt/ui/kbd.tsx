import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * RVLT key cap — one spec in every RVLT product (DESIGN.md §9, 2026-10-19): Geist Mono at
 * the 11px floor, --muted on --paper-2, a 1px --line-2 border with a 2px bottom edge,
 * radius 5px. Show it next to the action it triggers ("New asset" N, ⌘K).
 */
function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-[5px] border border-b-2 border-line-2 bg-paper-2 px-1.5",
        "font-mono text-[11px] text-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
