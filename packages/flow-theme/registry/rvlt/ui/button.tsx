import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * RVLT Flow button — pill, tactile press (lifts 1px on hover, drops 2px on active),
 * red = the one primary. See DESIGN.md §9 / §15.2.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-semibold text-[14px] transition-[transform,box-shadow,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // primary action — the one red
        primary:
          "bg-red text-white shadow-[0_3px_0_var(--red-700)] hover:-translate-y-px active:translate-y-[2px] active:shadow-[0_1px_0_var(--red-700)]",
        // hero CTA only — primary + sanctioned red bloom (§8)
        halo: "bg-red text-white shadow-[0_3px_0_var(--red-700),0_0_28px_rgba(224,54,61,.5)] hover:-translate-y-px active:translate-y-[2px] active:shadow-[0_1px_0_var(--red-700)]",
        // outline — fills ink on hover
        line: "border-2 border-line-2 bg-transparent text-ink hover:bg-ink hover:text-paper",
        // text only — hover to red
        ghost: "bg-transparent text-ink hover:text-red",
        // cream — for use on the full-red CTA block
        cream:
          "bg-[#F5EFE2] text-[#1D1A15] shadow-[0_3px_0_rgba(0,0,0,.25)] hover:-translate-y-px active:translate-y-[2px]",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-11 px-5",
        lg: "h-12 px-7 text-[15px]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
