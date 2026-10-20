import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * RVLT Flow button — pill, tactile press (lifts 1px on hover, drops 2px on active),
 * red = the one primary. See DESIGN.md §9 / §15.2.
 *
 * Primary and halo fill with `bg-primary` (= --action-red, white 4.5:1+ in both themes, §3.8);
 * the core --red stays for the focus ring.
 *
 * States (§9.1): `disabled` and `loading` both block activation. `loading` keeps the button's
 * width and its accessible name (the label is hidden with opacity, so it stays in the
 * accessibility tree in every engine), shows a spinner hidden from assistive tech, and sets
 * aria-busy. With `asChild` (e.g. a link) the child receives the same semantics: aria-disabled,
 * removed from the tab order, activation prevented, and aria-busy while loading.
 */
const buttonVariants = cva(
  // states (§9.1): focus-visible ring on every variant; tactile press; disabled = greyed,
  // not-allowed cursor, no lift/shadow (clicks blocked by the `disabled` attr or aria-disabled).
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-semibold text-[14px] transition-[transform,box-shadow,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:translate-y-0 disabled:hover:translate-y-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-disabled:shadow-none aria-disabled:translate-y-0 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // primary action — the one red (action red, so the white label clears AA)
        primary:
          "bg-primary text-primary-foreground shadow-[0_3px_0_var(--red-700)] hover:-translate-y-px active:translate-y-[2px] active:shadow-[0_1px_0_var(--red-700)]",
        // hero CTA only — primary + sanctioned red bloom (§8); bloom is the --sh-halo token
        halo: "bg-primary text-primary-foreground shadow-[var(--sh-halo)] hover:-translate-y-px active:translate-y-[2px] active:shadow-[0_1px_0_var(--red-700)]",
        // outline — 2px outline (--line-2 dark / --ink light, §9); fills ink on hover
        line: "border-2 border-border bg-transparent text-ink hover:bg-ink hover:text-paper active:translate-y-px",
        // text only — hover to red
        ghost: "bg-transparent text-ink hover:text-red-text active:opacity-80",
        // cream — for use on the full-red CTA block (fixed cream tokens, §3.6)
        cream:
          "bg-[var(--cream)] text-[var(--cream-ink)] shadow-[var(--sh-cream)] hover:-translate-y-px active:translate-y-[2px] active:shadow-[var(--sh-cream-press)]",
      },
      size: {
        // 44px on touch; 36px only where a fine pointer is guaranteed (§16.8)
        sm: "h-11 px-4 [@media(pointer:fine)]:h-9",
        default: "h-11 px-5",
        lg: "h-12 px-7 text-[15px]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

// the spinner keeps the variant's text colour even while the label itself is transparent
const spinnerTone: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "text-primary-foreground",
  halo: "text-primary-foreground",
  line: "text-ink",
  ghost: "text-ink",
  cream: "text-[var(--cream-ink)]",
};

function Spinner({ variant }: { variant: NonNullable<ButtonProps["variant"]> }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 grid place-items-center", spinnerTone[variant])}>
      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
    </span>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Loading state (§9.1) — spinner, keeps width and accessible name, aria-busy, blocks activation. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, onClick, ...props }, ref) => {
    const tone = variant ?? "primary";
    const classes = cn(buttonVariants({ variant, size, className }));
    const inactive = Boolean(disabled || loading);

    if (asChild) {
      // Slot composes child handlers first and lets child props win. Sanitize the
      // actual child before composition so inactive controls cannot activate first.
      const block = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const inactiveProps: Record<string, unknown> = inactive ? {
        tabIndex: -1,
        "aria-disabled": true,
        "aria-busy": loading || undefined,
        "data-loading": loading || undefined,
      } : {};
      if (inactive) {
        for (const name of ["onClick", "onDoubleClick", "onKeyDown", "onKeyUp",
          "onMouseDown", "onMouseUp", "onPointerDown", "onPointerUp", "onTouchStart", "onTouchEnd"]) {
          inactiveProps[name] = block;
          inactiveProps[`${name}Capture`] = block;
        }
      }
      const child = inactive && React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, inactiveProps)
        : children;
      return (
        <Slot
          {...props}
          className={cn(classes, loading && "text-transparent")}
          ref={ref}
          onClick={onClick}
          aria-disabled={inactive || undefined}
          aria-busy={loading || undefined}
          data-loading={loading || undefined}
          tabIndex={inactive ? -1 : props.tabIndex}
          {...inactiveProps}
        >
          {loading && <Spinner variant={tone} />}
          <Slottable>{child}</Slottable>
        </Slot>
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={inactive}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        onClick={onClick}
        {...props}
      >
        {loading && <Spinner variant={tone} />}
        {/* the label keeps its width and stays in the accessibility tree while loading */}
        <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>{children}</span>
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
