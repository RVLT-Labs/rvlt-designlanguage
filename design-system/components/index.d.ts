// RVLT components — prop contracts copied from the source apps.
// Shared primitives: the local registry, packages/flow-theme/registry/rvlt/ui (overlaid on window.Rvlt
// in the published artifact bundle); Panel and SidebarSection still come from TwoToned/gearflow.
// Binder components: RVLT-Labs/binder apps/web/src/components. Both are React + Radix + Tailwind v4.
// Live: every component in components/bundle.js (window.Rvlt) is the real source compiled; Notice,
// OfflineBanner, SyncStatus and CueTag below are documented here but shipped as static rf- renditions.
import type * as React from "react";

export type StatusIntent = "ok" | "warn" | "overbooked" | "repair" | "neutral" | "live";
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
  status?: "ok" | "warn" | "overbooked" | "repair" | "neutral";
}

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default "neutral". `live` = connection freshness (green dot, pulses, glows). */
  intent?: StatusIntent;
  /** Dot size. Default "default". */
  size?: "sm" | "default" | "lg";
  /** Soft ring-glow around the dot. Auto-enabled for `live`. */
  glow?: boolean;
  /** Label beside the dot, sentence case. Status is never colour-only: pass one when standalone. */
  label?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The one active / real-time card: elev fill + lit edge. */
  live?: boolean;
  /** Opens something: put a CardLink in the title. Lifts 3px to sh-hover. Never onClick on the card. */
  interactive?: boolean;
  /** Render as your own element (e.g. <article>, <li>) via Radix Slot. */
  asChild?: boolean;
}
/** A real <a href> in an interactive card's title; stretches over the whole card. */
export type CardLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
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

/** `title` is the heading text, not the HTML tooltip attribute. */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
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

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Overline label, sentence case — never uppercase. */
  label: string;
  /** default = muted section label · prominent = Kalam red eyebrow (marketing and hero moments only). */
  variant?: "default" | "prominent";
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

// ── Pulse (window.RvltPulse from components/pulse-bundle.js; qubered/a2-monitor) ──
// A separate namespace: load ../pulse-bundle.css and ../pulse-bundle.js beside the Rvlt bundle.
// Pulse is dark only. Prop names are the components' own; the data shapes are the fields the
// cards read, as Pulse's API sends them (see the PulseChannelCard preview for a full example).

export interface PulseLockupProps {
  /** Accessible name. Default "Pulse by RVLT". */
  label?: string;
  /** App suffix after the wordmark, e.g. "Manager". */
  suffix?: string;
}
export interface PulseTileProps {
  /** Tile size in px. Default 36. */
  size?: number;
}

export type PulseStatus = "good" | "caution" | "fault" | "unknown";
export type PulseAvailability = "observed" | "inferred" | "stale" | "unknown";
export interface PulseChannelStatuses {
  rf: PulseStatus;
  audio: PulseStatus;
  battery: PulseStatus;
  check: PulseStatus;
}
export interface PulseChannel {
  id: string;
  number: number;
  name: string;
  performer: string | null;
  kind: string;
  /** Unknown mic type: a glyph stands in for the photo; "inferred" reads "Likely". */
  micType: string | null;
  micTypeSource: "operator" | "inferred" | null;
  hasImage: boolean;
  input: { index: number; label: string };
  statuses: PulseChannelStatuses;
  audio: { availability: PulseAvailability; peakDbfs: number | null; rmsDbfs: number | null; [field: string]: unknown };
  rf: { availability: PulseAvailability; levelDbm: number | null; linkQualityPercent: number | null; [field: string]: unknown };
  battery: { availability: PulseAvailability; percent: number | null; bars: number | null; runtimeMinutes: number | null; [field: string]: unknown };
  [field: string]: unknown;
}
export interface PulseAlert {
  id: string;
  kind: string;
  dimension: string;
  /** "critical" draws the red overlay and the attention pulse. */
  severity: string;
  /** Words on the overlay, e.g. "Battery critical". */
  label: string;
  detail: string;
  channelId: string;
  raisedAtUtc: string;
  acknowledgedAtUtc: string | null;
  [field: string]: unknown;
}
export interface PulseChannelCardProps {
  channel: PulseChannel;
  alert: PulseAlert | null;
  report?: unknown;
  /** Default "Select". */
  actionLabel?: string;
  /** Default "card". */
  density?: string;
  /** Default true. */
  tabbable?: boolean;
  overlayExpiryMs: number;
  nowMs: number;
  selected: boolean;
  /** The channel in the operator's ears: a 2px ok ring. */
  listening: boolean;
  imageRevision: number;
  /** A MeterStore (new RvltPulse.MeterStore(null) for a static feed). */
  meterStore: unknown;
  /** Draws the meter as stale rather than silent. */
  metersStale: boolean;
  onAcknowledge: () => void;
  onSelect: () => void;
  onLongPressSelect?: () => void;
  onOpenDetail: () => void;
}
export interface PulseStatusStripProps {
  statuses: PulseChannelStatuses;
  /** Default false. */
  compact?: boolean;
}
export interface PulseRunOfShowProps {
  /** Always visible, even when the rows are hidden. */
  summary: string;
  needsAttention: boolean;
  /** SessionBar rows. */
  children: React.ReactNode;
}
export interface PulseSessionBarProps {
  session: { roomId: string; activeId: string | null; nextId: string | null; sessions: { id: string; name: string; startMinute: number; channelCount: number }[]; [field: string]: unknown };
  roomName?: string | null;
  /** One per channel in the next session; any tone but "ready" counts toward the summary. */
  turnover: { tone: string; readiness: string; [field: string]: unknown }[];
  offline: boolean;
  onOpen: () => void;
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
