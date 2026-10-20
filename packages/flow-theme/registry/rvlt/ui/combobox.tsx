"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Combobox — searchable single/multi-select built on Command + Popover.
 * Replaces the ad-hoc Command+Popover combos in asset assignment, crew picker,
 * client selector, category filter, etc.
 *
 * Trigger styled as Input: 2px border-input, bg-card, red focus ring (§15.2).
 * Multi-select: checked square tick; single: checked circle tick. Both use red fill.
 * Clear button (×) appears when a value is selected.
 *
 * DESIGN.md §15.2 (input recipe) · §9.1 (disabled, focus-visible states).
 */

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface ComboboxMultiProps extends ComboboxBaseProps {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultiProps;

function Combobox({
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "Nothing found.",
  disabled = false,
  className,
  ...rest
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const isMulti = rest.multiple === true;

  const selectedValues: string[] = isMulti
    ? ((rest as ComboboxMultiProps).value ?? [])
    : (rest as ComboboxSingleProps).value
      ? [(rest as ComboboxSingleProps).value as string]
      : [];

  function toggle(val: string) {
    if (isMulti) {
      const props = rest as ComboboxMultiProps;
      const next = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      props.onValueChange?.(next);
    } else {
      const props = rest as ComboboxSingleProps;
      props.onValueChange?.(selectedValues[0] === val ? "" : val);
      setOpen(false);
    }
  }

  function clearAll(e: React.MouseEvent) {
    e.stopPropagation();
    if (isMulti) {
      (rest as ComboboxMultiProps).onValueChange?.([]);
    } else {
      (rest as ComboboxSingleProps).onValueChange?.("");
    }
  }

  const hasValue = selectedValues.length > 0;
  const triggerLabel = isMulti
    ? selectedValues.length === 0
      ? placeholder
      : selectedValues.length === 1
        ? (options.find((o) => o.value === selectedValues[0])?.label ?? placeholder)
        : `${selectedValues.length} selected`
    : (options.find((o) => o.value === selectedValues[0])?.label ?? placeholder);

  return (
    <div className="flex items-center gap-2">
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-label={triggerLabel}
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn(
            // Input-style trigger: 2px outline, bg-card, red focus ring (§15.2)
            "flex h-11 w-full min-w-0 flex-1 items-center justify-between gap-2 rounded-[var(--radius)]",
            "border-2 border-input bg-card px-3 text-[14px] transition-colors",
            hasValue ? "text-ink" : "text-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]",
            "disabled:cursor-not-allowed disabled:opacity-45",
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", className)}
        align="start"
        // match trigger width via Radix CSS variable
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const selected = selectedValues.includes(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    onSelect={() => toggle(opt.value)}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center border-2 border-border transition-colors",
                        isMulti ? "rounded-[4px]" : "rounded-full",
                        selected && "border-red bg-red",
                      )}
                    >
                      {selected && (
                        <Check
                          className="size-3 text-primary-foreground"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    {opt.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    {/* Clear is its own 44px control beside the trigger (§16.8): a sibling, never nested in the
        trigger button, and never overlapping its press area. */}
    {hasValue && (
      <button
        type="button"
        aria-label="Clear selection"
        disabled={disabled}
        onClick={clearAll}
        className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-input text-muted transition-colors hover:bg-paper-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-45"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
    )}
    </div>
  );
}

export { Combobox };
