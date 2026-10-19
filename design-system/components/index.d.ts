// RVLT components — prop contracts copied from the source apps.
// Shared primitives: TwoToned/gearflow src/components/ui (the RVLT registry as Flow ships it).
// Binder components: RVLT-Labs/binder apps/web/src/components. Both are React + Radix + Tailwind v4.
// Live: every component in components/bundle.js (window.Rvlt) is the real source compiled; Notice,
// OfflineBanner, SyncStatus and CueTag below are documented here but shipped as static rf- renditions.
import type * as React from "react";

export type ColorIntent = "success" | "warning" | "error" | "info" | "neutral" | "primary";
export type ModuleHue = "blue" | "amber" | "green" | "purple" | "coral" | "teal";
export type AvatarHue = ModuleHue | "pink" | "lime";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = the one red action · halo = hero CTA only · line = 2px outline · ghost = text · cream = on a red block */
  variant?: "primary" | "halo" | "line" | "ghost" | "cream";
  /** default 44px · sm 44px phones / 36px ≥640px · lg 48px · icon 44×44 */
  size?: "default" | "sm" | "lg" | "icon";
  /** Render the single child (e.g. a Link) with button styling (Radix Slot). */
  asChild?: boolean;
  /** Spinner over the label, keeps width, disables, sets aria-busy. */
  loading?: boolean;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default "neutral". Always render a text label. */
  status?: "ok" | "warn" | "overbooked" | "repair" | "neutral" | "info" | "primary";
}

export interface StatusIndicatorProps {
  /** Domain status table, e.g. "asset", "project". */
  category?: string;
  /** Domain status value, e.g. "CHECKED_OUT". */
  value?: string;
  /** Direct intent when there is no category/value pair. */
  intent?: ColorIntent;
  /** Human-readable label — required, sentence case. */
  label: string;
  /** dot = detail views (default) · pill = tables */
  variant?: "dot" | "pill";
  className?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The one active / real-time card: elev fill + lit edge. */
  live?: boolean;
  /** Clickable: lifts 3px to sh-hover. */
  interactive?: boolean;
}
export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = React.HTMLAttributes<HTMLDivElement>;
export type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement>;
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;
export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "default" | "responsive";
}

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  figure: React.ReactNode;
  label: React.ReactNode;
  /** The ONE bright stat per group: 38px ink. Default 24px ink-2. */
  bright?: boolean;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Usually a line Button. */
  action?: React.ReactNode;
}

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

/** Radix Checkbox root props. */
export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
}

/** Radix Switch root props. */
export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** Radix Tabs: Tabs › TabsList › TabsTrigger + TabsContent. */
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export interface SectionHeaderProps {
  /** Overline label, sentence case — never uppercase. */
  label: string;
  className?: string;
}
export interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  /** Bottom rule; false on the last section. Default true. */
  divider?: boolean;
  className?: string;
}

/** Table › TableHeader › TableRow › TableHead; TableBody › TableRow › TableCell; TableFooter; TableCaption. */
export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & { "data-state"?: "selected" };

export type StepState = "done" | "now" | "future";
export interface Step {
  label: string;
  state: StepState;
}
export interface LifecycleStepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: Step[];
  /** Makes each ring a button. */
  onStepClick?: (index: number) => void;
}

export interface FeaturePatchProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Default "sticker". */
  variant?: "sticker" | "soft";
  /** Default "blue". Red is never a module hue. */
  hue?: ModuleHue;
  /** default 42px · sm 32px */
  size?: "default" | "sm";
  /** A Lucide icon element. */
  children: React.ReactNode;
}

export interface PersonAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Drives the initials and the deterministic hue. */
  name: string;
  /** Photo URL; initials show until it loads. */
  src?: string;
}

// ── Binder ───────────────────────────────────────────────

export interface BinderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = red + sticker shadow · line = card + 2px outline (default look) · ghost = ink-2 text · halo / cream as in Button */
  variant?: "primary" | "halo" | "line" | "ghost" | "cream";
  /** ≥768px: sm 26 · default 30 · lg 40 (radius 8/10/10). Phones: 44 (lg 48), radius 12. icon 44×44. */
  size?: "sm" | "default" | "lg" | "icon";
  asChild?: boolean;
  loading?: boolean;
}

export interface BadgeBinderProps extends BadgeProps {
  /** default 20px · sm 18px (inline flag) */
  size?: "default" | "sm";
}

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
}
export interface SegmentedProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedOption[];
  "aria-label": string;
  className?: string;
  itemClassName?: string;
  disabled?: boolean;
}

export interface KbdProps {
  /** e.g. "N", "⌘K", "]" */
  children: React.ReactNode;
  className?: string;
}

export interface Notice {
  id: string;
  /** rejection and error draw the red left bar; info has none. */
  kind: "rejection" | "error" | "info";
  message: React.ReactNode;
  action?: { label: string; run: () => void };
}
export interface OfflineBannerProps {
  /** Local changes not yet uploaded. */
  waiting: number;
}

export interface SyncStatusProps {
  /** Dot only; the word goes to assistive tech. */
  compact?: boolean;
  crowded?: boolean;
}

export interface BinderEmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  label?: React.ReactNode;
  heading: React.ReactNode;
  /** The one line under the heading. */
  children?: React.ReactNode;
  /** The Kalam line: personality, never instructions. */
  hand?: string;
  action?: React.ReactNode;
  className?: string;
}

export type CueType = "go" | "standby" | "warn";
export interface CueTagProps {
  /** Department code, e.g. "LX". Dropped first when the margin is narrow. */
  code: string;
  /** Cue number, e.g. "12.5". Never dropped. */
  number: string;
  /** The department's stored colour (ink on white). */
  colour: string;
  type: CueType;
  selected?: boolean;
  /** Accessible name: department, type, number, label, trigger. */
  "aria-label": string;
}

// ── Artwork (RVLT Flow Stickers and Wordmarks pack 1.1.0, examples/react/RvltArt.tsx) ──

export type IllustrationId =
  | "road-case" | "gaff-tape" | "microphone" | "monitor" | "production-van" | "wrench" | "calendar"
  | "batteries" | "aaa-pass" | "clipboard" | "speaker" | "moving-head" | "mixing-console" | "beltpack"
  | "walkie-talkie" | "coffee-mug" | "ticket-stub" | "stage-curtains" | "pelican";
export type WordmarkId = "standby" | "go" | "crew" | "load-in" | "on-air" | "show-time" | "rvlt-flow";

type ArtSelection =
  | { id: IllustrationId; variant?: "sticker" | "line" }
  | { id: WordmarkId; variant?: "patch" | "wordmark" };
type ArtMeaning =
  | { decorative?: true; label?: never }
  | { decorative: false; label: string };
export type RvltArtProps = ArtSelection & ArtMeaning & {
  /** CSS width; height follows the viewBox. Default = the design's display width (160 sticker). */
  width?: number | string;
  /** Apply the design's gallery tilt once (2–5°). */
  tilt?: boolean;
  /** Where assets/ was copied, default "/rvlt-art". */
  basePath?: string;
  className?: string;
  loading?: "eager" | "lazy";
};
