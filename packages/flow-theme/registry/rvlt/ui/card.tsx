import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

/**
 * RVLT Flow card — 2px outline + hard offset shadow (no soft blur).
 * - `interactive`: a card that opens something. Put a `CardLink` (a real <a href>) in the title;
 *   it stretches over the whole card, so pointer, keyboard (Tab, Enter) and screen readers all
 *   meet one link named by the title. The card lifts 3px to --sh-hover on hover and shows the
 *   red focus ring while its link has keyboard focus (§9, §9.1). Never put onClick on the card.
 * - `asChild`: render the card as your own element (for example an <article> or <li>).
 * - `live`: the one active / real-time card lifts to --elev + the lit top-edge (§4/§9).
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { live?: boolean; interactive?: boolean; asChild?: boolean }
>(({ className, live, interactive, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="card"
      className={cn(
        // 2px outline = --border (--line-2 dark / --ink light, §7); hard offset shadow, no blur
        "relative rounded-[var(--radius)] border-2 border-border bg-card text-ink shadow-[var(--sh-card)]",
        interactive &&
          "transition-[transform,box-shadow] has-[[data-card-link]:hover]:-translate-y-[3px] has-[[data-card-link]:hover]:shadow-[var(--sh-hover)] has-[[data-card-link]:focus-visible]:ring-2 has-[[data-card-link]:focus-visible]:ring-red has-[[data-card-link]:focus-visible]:ring-offset-2 has-[[data-card-link]:focus-visible]:ring-offset-paper motion-reduce:transition-none motion-reduce:has-[[data-card-link]:hover]:translate-y-0",
        live && "bg-elev shadow-[var(--sh-card),var(--lit)]",
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

/**
 * The one link of an interactive card. Its ::after covers the card, so the whole card is the
 * hit area, while the accessible name stays the title text it wraps.
 */
const CardLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      data-card-link=""
      className={cn(
        "text-ink no-underline after:absolute after:inset-0 after:z-[1] after:rounded-[inherit] after:content-[''] focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
CardLink.displayName = "CardLink";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

/** Card title. Pass `asChild` with a heading (`<h2>`/`<h3>`) at the level your page needs. */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "font-display font-bold text-[15px] leading-tight tracking-tight",
        className,
      )}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-[13.5px] text-muted", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardLink,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
