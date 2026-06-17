"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sun,
  Moon,
  Wrench,
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  ChevronRight,
  MoreHorizontal,
  Package,
  Users,
  Zap,
  Shield,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  PersonAvatar,
} from "@/components/ui/avatar";
import { Stat } from "@/components/ui/stat";
import { LifecycleStepper, type Step } from "@/components/ui/stepper";
import { EmptyState } from "@/components/ui/empty-state";
import { FlowMascot } from "@/components/ui/flow-mascot";
import { Toaster } from "@/components/ui/sonner";

// ─── helpers ─────────────────────────────────────────────────────────────────

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 space-y-5">
      <div className="flex items-center gap-3">
        <span className="font-display font-extrabold text-[22px] tracking-tight text-ink">
          {label}
        </span>
        <Separator className="flex-1" />
      </div>
      {children}
    </section>
  );
}

function Row({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-faint">{children}</p>
  );
}

function Swatch({ token, label, hint }: { token: string; label: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-10 w-full rounded-[var(--radius)] border border-line"
        style={{ background: `var(${token})` }}
      />
      <span className="text-[11px] text-faint">{label}</span>
      {hint && <span className="text-[10px] text-faint opacity-60">{hint}</span>}
    </div>
  );
}

// ─── data ────────────────────────────────────────────────────────────────────

const CREW = [
  { name: "Jay Nash",    role: "Crew Chief",  status: "ok"         as const, hours: "8h",  shift: [0,   60] },
  { name: "Tara Moon",   role: "Rigger",      status: "overbooked" as const, hours: "12h", shift: [10,  80] },
  { name: "Rae Singh",   role: "Lighting Op", status: "ok"         as const, hours: "8h",  shift: [0,   55] },
  { name: "Kit Osei",   role: "A1 Audio",    status: "ok"         as const, hours: "8h",  shift: [20,  70] },
  { name: "Lee Park",   role: "Camera Op",   status: "repair"     as const, hours: "4h",  shift: [0,   30] },
];

const TABLE_CREW = [
  { name: "Sam Kowalski", role: "Crew Chief",  status: "ok"         as const, hours: "8h" },
  { name: "Mia Thornton", role: "Rigger",      status: "warn"       as const, hours: "6h" },
  { name: "Dev Patel",    role: "Lighting Op", status: "ok"         as const, hours: "8h" },
  { name: "Jess Rivera",  role: "A1 Audio",    status: "overbooked" as const, hours: "12h" },
  { name: "Tom Larsen",   role: "Camera Op",   status: "repair"     as const, hours: "4h" },
];

const STEPS: Step[] = [
  { label: "Enquiry",   state: "done"   },
  { label: "Quote",     state: "done"   },
  { label: "Confirmed", state: "now"    },
  { label: "Prep",      state: "future" },
  { label: "On site",   state: "future" },
  { label: "Return",    state: "future" },
];

const MODULES = [
  { label: "Projects",    icon: Package,  color: "bg-blue"   },
  { label: "Crew",        icon: Users,    color: "bg-purple" },
  { label: "Gear",        icon: Zap,      color: "bg-amber"  },
  { label: "Compliance",  icon: Shield,   color: "bg-teal"   },
  { label: "Maintenance", icon: Wrench,   color: "bg-coral"  },
  { label: "Schedule",    icon: Calendar, color: "bg-green"  },
];

const DATAVIZ_ORDER = ["blue","amber","green","purple","coral","teal","pink","lime"];

// ─── main ────────────────────────────────────────────────────────────────────

export function PreviewPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [switchOn, setSwitchOn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "light") {
      html.classList.add("light");
    } else {
      html.classList.remove("light");
    }
  }, [theme]);

  return (
    <TooltipProvider delayDuration={200}>
      <Toaster />

      {/* sticky nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-border bg-paper/90 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <FlowMascot className="size-7 text-red" />
          <span className="font-display font-extrabold tracking-tight text-ink">RVLT Flow</span>
          <Badge status="neutral" className="hidden sm:inline-flex">Preview v2</Badge>
        </div>

        <nav className="hidden gap-4 text-[13px] text-muted sm:flex">
          {["colour","typography","buttons","forms","overlays","data","signature"].map((s) => (
            <a key={s} href={`#${s}`} className="capitalize transition-colors hover:text-ink">{s}</a>
          ))}
        </nav>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex size-9 items-center justify-center rounded-full border-2 border-border bg-card text-ink transition-colors hover:bg-elev"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </header>

      {/* hero */}
      <div className="border-b-2 border-border bg-paper-2 px-5 py-12 text-center">
        <FlowMascot className="mx-auto mb-4 size-16 text-muted" eyeColor="var(--red)" />
        <h1 className="font-display font-extrabold text-[36px] tracking-tight text-ink sm:text-[48px]">
          RVLT Flow
        </h1>
        <p className="mt-2 text-[16px] text-muted">
          Preview v2 · 27 components from{" "}
          <code className="rounded bg-elev px-1.5 py-0.5 font-mono text-[13px] text-ink-2">
            @rvlt/flow-theme
          </code>
        </p>
        <Row className="mt-6 justify-center">
          <Button variant="primary">Get started</Button>
          <Button variant="halo">Halo CTA</Button>
          <Button variant="line">View docs</Button>
          <Button variant="ghost">Learn more</Button>
        </Row>
      </div>

      <main className="mx-auto max-w-5xl space-y-16 px-5 py-12">

        {/* ── COLOUR ── */}
        <Section id="colour" label="Colour (§3)">

          <Sub>Surfaces — luminance ladder</Sub>
          <div className="grid grid-cols-4 gap-2">
            {(["--paper","--paper-2","--card","--elev"] as const).map((t) => (
              <Swatch key={t} token={t} label={t.replace("--","")} hint="surface" />
            ))}
          </div>

          <Sub>Ink + lines</Sub>
          <div className="grid grid-cols-6 gap-2">
            {["--ink","--ink-2","--muted","--faint","--line","--line-2"].map((t) => (
              <Swatch key={t} token={t} label={t.replace("--","")} />
            ))}
          </div>

          <Sub>Red — the one accent (§3.1)</Sub>
          <div className="grid grid-cols-3 gap-2 max-w-xs">
            <Swatch token="--red" label="red" hint="primary" />
            <Swatch token="--red-700" label="red-700" hint="pressed" />
            <Swatch token="--red-soft" label="red-soft" hint="tint" />
          </div>

          <Sub>Status colours + soft fills</Sub>
          <div className="grid grid-cols-4 gap-3">
            {[
              { color: "--ok",    soft: "--ok-soft",   badge: "ok"         as const, label: "ok / ready"    },
              { color: "--warn",  soft: "--warn-soft",  badge: "warn"       as const, label: "warn / check"  },
              { color: "--t-out", soft: "--out-soft",   badge: "overbooked" as const, label: "overbooked"    },
              { color: "--rep",   soft: "--rep-soft",   badge: "repair"     as const, label: "repair"        },
            ].map(({ color, soft, badge, label }) => (
              <div key={color} className="space-y-2">
                <div className="flex gap-1">
                  <div className="h-8 flex-1 rounded-[var(--radius)] border border-line" style={{ background: `var(${color})` }} />
                  <div className="h-8 flex-1 rounded-[var(--radius)] border border-line" style={{ background: `var(${soft})` }} />
                </div>
                <Badge status={badge}>{label}</Badge>
              </div>
            ))}
          </div>

          <Sub>Module hues + soft tints (§3.7) — red is never a module colour</Sub>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {["blue","amber","green","purple","coral","teal","pink","lime"].map((h) => (
              <div key={h} className="space-y-1">
                <div className="h-8 rounded-[var(--radius)] border border-line" style={{ background: `var(--${h})` }} />
                <div className="h-5 rounded-[var(--radius)] border border-line opacity-70" style={{ background: `var(--${h}-soft)` }} />
                <span className="block text-[10px] text-faint">{h}</span>
              </div>
            ))}
          </div>

          <Sub>Data-viz series order — red reserved for thresholds only</Sub>
          <div className="flex h-7 overflow-hidden rounded-[var(--radius)] border-2 border-border">
            {DATAVIZ_ORDER.map((h) => (
              <div key={h} className="flex-1" style={{ background: `var(--${h})` }} />
            ))}
          </div>
          <p className="text-[12px] text-faint">
            Always assign chart series in this order: {DATAVIZ_ORDER.join(" · ")}
          </p>

          <Sub>Utility tokens</Sub>
          <div className="grid grid-cols-3 gap-2 max-w-xs">
            <Swatch token="--scrim" label="scrim" hint="overlay" />
            <Swatch token="--select" label="select" hint="row sel." />
            <Swatch token="--link" label="link" hint="blue, not red" />
          </div>
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section id="typography" label="Typography (§5)">

          <Sub>Display / marketing scale (§5.1)</Sub>
          <div className="space-y-3 rounded-[var(--radius)] border-2 border-border bg-card p-5">
            <p className="font-display font-extrabold leading-none tracking-[-0.035em] text-ink" style={{fontSize: "clamp(36px, 8vw, 72px)"}}>Flow</p>
            <p className="font-display font-extrabold text-[44px] leading-none tracking-tight text-ink">Run the show.</p>
            <p className="font-display font-bold text-[30px] leading-snug tracking-tight text-ink-2">Production software that keeps up.</p>
            <p className="font-hand text-[17px] font-bold text-red">the spec, rendered</p>
          </div>

          <Sub>App functional ramp (§5.5 — LOCKED, 11px floor)</Sub>
          <div className="space-y-2 rounded-[var(--radius)] border-2 border-border bg-card p-5">
            {[
              ["text-page-title",   "24px", "Page title",     "font-semibold"],
              ["text-section-head", "18px", "Section heading","font-semibold"],
              ["text-card-title",   "15px", "Card title",     "font-bold"],
              ["text-ui-text",      "14px", "UI text / label",""],
              ["text-table-cell",   "13.5px","Table cell",    "font-mono"],
              ["text-label",        "12px", "Caption / meta", "text-muted"],
              ["text-micro",        "11px", "Micro (floor)",  "text-faint"],
            ].map(([cls, size, label, extra]) => (
              <div key={cls} className="flex items-baseline gap-3">
                <span className={`${cls} ${extra} text-ink`}>{label}</span>
                <span className="text-[11px] text-faint">{size}</span>
                <code className="ml-auto text-[10px] text-faint hidden sm:block">{cls}</code>
              </div>
            ))}
          </div>

          <Sub>Typefaces</Sub>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius)] border-2 border-border bg-card p-4">
              <p className="font-display font-extrabold text-[24px] text-ink">Alphapipe</p>
              <p className="text-[12px] text-faint">BC Alphapipe / Archivo fallback · display, headings</p>
            </div>
            <div className="rounded-[var(--radius)] border-2 border-border bg-card p-4">
              <p className="font-sans text-[18px] text-ink">DM Sans</p>
              <p className="text-[12px] text-faint">font-sans · all UI text</p>
            </div>
            <div className="rounded-[var(--radius)] border-2 border-border bg-card p-4">
              <p className="font-mono text-[15px] text-ink-2">08:30 → 16:00</p>
              <p className="text-[12px] text-faint">font-mono · figures, code</p>
            </div>
          </div>
        </Section>

        {/* ── SHAPE / ELEVATION ── */}
        <Section id="elevation" label="Shape + elevation (§7)">

          <Sub>Border radii</Sub>
          <Row>
            <div className="flex h-16 w-24 items-center justify-center rounded-[var(--radius)] border-2 border-border bg-card text-[12px] text-muted">--r (14px)</div>
            <div className="flex h-16 w-24 items-center justify-center rounded-[var(--r-lg)] border-2 border-border bg-card text-[12px] text-muted">--r-lg (20px)</div>
            <div className="flex h-16 w-24 items-center justify-center rounded-full border-2 border-border bg-card text-[12px] text-muted">pill</div>
          </Row>

          <Sub>Shadow ramp — hard offset, no blur</Sub>
          <Row className="items-end">
            <div className="flex h-20 w-36 flex-col items-center justify-center rounded-[var(--radius)] border-2 border-border bg-card shadow-[var(--sh-card)]">
              <span className="text-[11px] text-muted">--sh-card</span>
              <span className="text-[10px] text-faint">resting · 3px</span>
            </div>
            <div className="flex h-20 w-36 -translate-y-[3px] flex-col items-center justify-center rounded-[var(--radius)] border-2 border-border bg-card shadow-[var(--sh-hover)]">
              <span className="text-[11px] text-muted">--sh-hover</span>
              <span className="text-[10px] text-faint">lifted · 7px</span>
            </div>
            <div className="flex h-20 w-36 flex-col items-center justify-center rounded-[var(--radius)] border-2 border-border bg-elev shadow-[var(--sh-card),var(--lit)]">
              <span className="text-[11px] text-muted">--lit</span>
              <span className="text-[10px] text-faint">live · top-edge glow</span>
            </div>
            <div className="flex h-20 w-36 flex-col items-center justify-center rounded-full border-2 border-border bg-red shadow-[var(--sh-halo)] text-white">
              <span className="text-[11px]">--sh-halo</span>
              <span className="text-[10px] opacity-70">hero CTA bloom</span>
            </div>
          </Row>

          <p className="text-[12px] text-faint">
            No blur on depth shadows. Blur is reserved for sticky nav only (§7).
          </p>
        </Section>

        {/* ── BUTTONS ── */}
        <Section id="buttons" label="Buttons (§9 / §15.2)">
          <Sub>Variants</Sub>
          <Row>
            <Button variant="primary">Primary</Button>
            <Button variant="halo">Halo CTA</Button>
            <Button variant="line">Line</Button>
            <Button variant="ghost">Ghost</Button>
            <div className="rounded-[var(--radius)] bg-red p-3">
              <Button variant="cream">Cream</Button>
            </div>
          </Row>

          <Sub>Sizes</Sub>
          <Row className="items-end">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="line"><Wrench className="size-4" /></Button>
          </Row>

          <Sub>States</Sub>
          <Row>
            <Button variant="primary">Default</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="line" disabled>Line disabled</Button>
          </Row>

          <Sub>With icon</Sub>
          <Row>
            <Button variant="primary"><Bell className="size-4" />Notify crew</Button>
            <Button variant="line"><Package className="size-4" />New booking</Button>
          </Row>
        </Section>

        {/* ── BADGES ── */}
        <Section id="badges" label="Badges">
          <Row>
            <Badge status="ok">Available</Badge>
            <Badge status="warn">Check due</Badge>
            <Badge status="overbooked">Overbooked</Badge>
            <Badge status="repair">In repair</Badge>
            <Badge status="neutral">Neutral</Badge>
          </Row>
          <p className="text-[12px] text-faint">Status encoded by colour AND label — never colour-only (§3.3).</p>
        </Section>

        {/* ── CARDS ── */}
        <Section id="cards" label="Cards (§9)">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Standard card</CardTitle>
                <CardDescription>2px outline · hard offset shadow</CardDescription>
              </CardHeader>
              <CardContent><p className="text-[13.5px] text-muted">Base surface. No gradients, no blur.</p></CardContent>
              <CardFooter><Badge status="ok">Ready</Badge></CardFooter>
            </Card>

            <Card interactive>
              <CardHeader>
                <CardTitle>Interactive card</CardTitle>
                <CardDescription>Hover lifts 3px to --sh-hover</CardDescription>
              </CardHeader>
              <CardContent><p className="text-[13.5px] text-muted">Clickable cards lift on hover. Try it.</p></CardContent>
              <CardFooter><ChevronRight className="ml-auto size-4 text-muted" /></CardFooter>
            </Card>

            <Card live>
              <CardHeader>
                <CardTitle>Live card</CardTitle>
                <CardDescription>--elev bg + --lit top-edge · real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-ok" />
                  <span className="text-[13.5px] text-ok">On site · 3h 12m</span>
                </div>
              </CardContent>
              <CardFooter><Badge status="ok">Live</Badge></CardFooter>
            </Card>
          </div>

          {/* Availability row — real-world pattern */}
          <Sub>Availability row card (gear status)</Sub>
          <Card>
            <CardContent className="pt-5">
              <div className="space-y-0">
                {[
                  { name: "K2 Moving Head", qty: "×12", status: "ok" as const,     label: "Ready"         },
                  { name: "SGM P-5",        qty: "×4",  status: "overbooked" as const, label: "Short ×2"  },
                  { name: "Cable loom 16A", qty: "×8",  status: "warn" as const,    label: "Check due"    },
                ].map((row, i, arr) => (
                  <div
                    key={row.name}
                    className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? "border-b border-line" : ""}`}
                  >
                    <span className="flex-1 text-[14px] text-ink">{row.name}</span>
                    <span className="font-mono text-[13px] text-muted">{row.qty}</span>
                    <Badge status={row.status}>{row.label}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── MODULE WAYFINDING ── */}
        <Section id="modules" label="Module wayfinding (§3.7)">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Sidebar */}
            <div>
              <Sub>Module sidebar</Sub>
              <div className="mt-3 w-56 overflow-hidden rounded-[var(--radius)] border-2 border-border bg-card">
                {MODULES.map(({ label, icon: Icon, color }, i) => {
                  const active = i === 0;
                  return (
                    <div
                      key={label}
                      className={`relative flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors ${active ? "bg-elev shadow-[var(--lit)]" : "hover:bg-paper-2"}`}
                    >
                      {active && (
                        <span
                          className={`absolute left-0 top-0 h-full w-[3px] rounded-r-full ${color}`}
                        />
                      )}
                      <div className={`flex size-6 items-center justify-center rounded-[6px] ${color} text-dark`}>
                        <Icon className="size-3.5" />
                      </div>
                      <span className={`text-[14px] ${active ? "font-semibold text-ink" : "text-muted"}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Module patches */}
            <div>
              <Sub>Feature patches (§9.2)</Sub>
              <div className="mt-3 flex flex-wrap gap-3">
                {MODULES.map(({ label, icon: Icon, color }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex size-[42px] -rotate-[4deg] cursor-pointer items-center justify-center rounded-[10px] border-2 border-[var(--cream)] ${color} shadow-[2px_4px_0_rgba(0,0,0,0.5)] transition-transform hover:rotate-0`}
                        style={{ borderColor: "var(--cream)" }}
                      >
                        <Icon className="size-5 text-dark" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── FORMS ── */}
        <Section id="forms" label="Form controls (§9.1)">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Sam Kowalski" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Crew</SelectLabel>
                    <SelectItem value="crew-chief">Crew Chief</SelectItem>
                    <SelectItem value="rigger">Rigger</SelectItem>
                    <SelectItem value="lighting">Lighting Op</SelectItem>
                    <SelectItem value="audio">A1 Audio</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Add availability notes…" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="err">Error state — ≥16px, no iOS zoom</Label>
              <Input id="err" placeholder="bad@entry" aria-invalid defaultValue="bad@" />
              <p className="text-[12px] text-red">Please enter a valid email.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="ch1" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
              <Label htmlFor="ch1">Available this week</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="ch2" defaultChecked />
              <Label htmlFor="ch2">On call</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="sw1" checked={switchOn} onCheckedChange={setSwitchOn} />
              <Label htmlFor="sw1">{switchOn ? "Notifications on" : "Notifications off"}</Label>
            </div>
          </div>
        </Section>

        {/* ── OVERLAYS ── */}
        <Section id="overlays" label="Overlays">
          <Row className="flex-wrap">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="line">Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm booking</DialogTitle>
                  <DialogDescription>
                    This will lock in the schedule and notify the crew. Changes still possible before prep date.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                  <Button variant="primary">Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="line">Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Crew details</SheetTitle>
                  <SheetDescription>Review assignment and rates.</SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {TABLE_CREW.slice(0, 3).map((c) => (
                    <div key={c.name} className="flex items-center gap-3 rounded-[var(--radius)] border-2 border-border bg-card p-3">
                      <PersonAvatar name={c.name} className="size-8" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-ink">{c.name}</p>
                        <p className="text-[12px] text-muted">{c.role}</p>
                      </div>
                      <Badge status={c.status}>{c.hours}</Badge>
                    </div>
                  ))}
                </div>
                <SheetFooter className="mt-6">
                  <SheetClose asChild><Button variant="line" className="w-full">Close</Button></SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="line">Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-4">
                <p className="text-[14px] font-semibold text-ink">Quick filters</p>
                <p className="mt-1 text-[12.5px] text-muted">Floating panel, elevated surface, 2px outline.</p>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="line" size="icon"><MoreHorizontal className="size-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="size-4" />View profile</DropdownMenuItem>
                <DropdownMenuItem><Settings className="size-4" />Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red"><LogOut className="size-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"><Bell className="size-4" /></Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <Button variant="line" onClick={() => toast.success("Booking confirmed — crew notified.")}>
              Toast success
            </Button>
            <Button variant="line" onClick={() => toast.warning("Double-booking detected on Saturday.")}>
              Toast warning
            </Button>
            <Button variant="line" onClick={() => toast.error("Failed to save — check your connection.")}>
              Toast error
            </Button>
          </Row>
        </Section>

        {/* ── NAVIGATION ── */}
        <Section id="navigation" label="Navigation">
          <Tabs defaultValue="schedule">
            <TabsList>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="finance" disabled>Finance</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule">
              <p className="text-[14px] text-muted">Shift grid and booking timeline lives here.</p>
            </TabsContent>
            <TabsContent value="crew">
              <p className="text-[14px] text-muted">Roster, availability, and hours at a glance.</p>
            </TabsContent>
            <TabsContent value="equipment">
              <p className="text-[14px] text-muted">Gear, repair status, and check-out records.</p>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Sub>Accordion / FAQ</Sub>
            <Accordion type="single" collapsible className="mt-3 max-w-xl">
              <AccordionItem value="q1">
                <AccordionTrigger>What counts as a double-booking?</AccordionTrigger>
                <AccordionContent>
                  When the same crew member is assigned to two overlapping bookings with no buffer. Flow flags these in amber and won&apos;t let you confirm until resolved.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Can I book crew cross-company?</AccordionTrigger>
                <AccordionContent>
                  Yes — with a cross-company agreement in place. Each company&apos;s rates apply independently. Flow prorates automatically.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>How does the lifecycle stepper work?</AccordionTrigger>
                <AccordionContent>
                  It tracks the booking through Enquiry → Quote → Confirmed → Prep → On site → Return. Each stage unlocks the next action.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Section>

        {/* ── LIFECYCLE STEPPER ── */}
        <Section id="stepper" label="Lifecycle stepper (§15.4a)">
          <Card>
            <CardContent className="pt-5">
              <p className="mb-4 text-[13px] text-muted">Summer Gala 2026 · vertical on mobile, horizontal on md+</p>
              <LifecycleStepper steps={STEPS} />
            </CardContent>
          </Card>
        </Section>

        {/* ── CREW SCHEDULER ── */}
        <Section id="scheduler" label="Crew scheduler (§15.4c)">
          <Card>
            <CardHeader>
              <CardTitle>Saturday 14 Jun — Summer Gala</CardTitle>
              <CardDescription>5 crew · 1 clash detected</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-0">
                {CREW.map((c, i, arr) => {
                  const clash = c.status === "overbooked";
                  return (
                    <div
                      key={c.name}
                      className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? "border-b border-line" : ""}`}
                    >
                      <PersonAvatar name={c.name} className="size-8 shrink-0" />
                      <div className="w-28 shrink-0">
                        <p className="text-[13.5px] font-medium text-ink">{c.name}</p>
                        <p className="text-[11px] text-muted">{c.role}</p>
                      </div>
                      {/* shift bar */}
                      <div className="relative flex-1 overflow-hidden rounded-full bg-paper-2 h-5">
                        <div
                          className={`absolute inset-y-0 rounded-full ${clash ? "bg-t-out opacity-80 outline outline-2 outline-red" : "bg-blue opacity-70"}`}
                          style={{
                            left:  `${c.shift[0]}%`,
                            width: `${c.shift[1] - c.shift[0]}%`,
                          }}
                        />
                      </div>
                      <div className="w-24 shrink-0 text-right">
                        {clash
                          ? <Badge status="overbooked">{c.hours}</Badge>
                          : <Badge status={c.status}>{c.hours}</Badge>
                        }
                      </div>
                    </div>
                  );
                })}
                {/* open slot */}
                <div className="flex items-center gap-3 border-t border-line py-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-line-2 text-[12px] text-faint">+</div>
                  <div className="w-28 shrink-0">
                    <p className="text-[13.5px] text-faint">Open slot</p>
                    <p className="text-[11px] text-faint">Unfilled call</p>
                  </div>
                  <div className="relative flex-1 overflow-hidden rounded-full h-5">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-rep" style={{ background: "var(--rep-soft)" }} />
                  </div>
                  <div className="w-24 shrink-0 text-right">
                    <Badge status="repair">—</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── DATA ── */}
        <Section id="data" label="Data display">
          <Sub>Crew roster table</Sub>
          <div className="rounded-[var(--radius)] border-2 border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TABLE_CREW.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar name={row.name} className="size-7" />
                        <span className="font-medium">{row.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted">{row.role}</TableCell>
                    <TableCell>
                      <Badge status={row.status}>
                        {row.status === "ok" ? "Available" : row.status === "warn" ? "Check due" : row.status === "overbooked" ? "Overbooked" : "In repair"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-ink-2">{row.hours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Sub>Stat widgets (§9) — one bright hero, siblings dim</Sub>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat bright figure="47"    label="Crew booked this month" />
            <Stat        figure="3"     label="Double-bookings avoided" />
            <Stat        figure="99.9%" label="Accounted for" />
            <Stat        figure="0"     label="Unresolved conflicts" />
          </div>

          <Sub>Selected row (--select token)</Sub>
          <div className="rounded-[var(--radius)] border-2 border-border overflow-hidden">
            <div className="relative flex items-center gap-3 border-b border-line px-4 py-3" style={{ background: "var(--select)" }}>
              <span className="absolute left-0 top-0 h-full w-[2px] bg-red rounded-r" />
              <PersonAvatar name="Jay Nash" className="size-7" />
              <span className="text-[14px] font-medium text-ink">Jay Nash</span>
              <Badge status="ok" className="ml-auto">Selected</Badge>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <PersonAvatar name="Tara Moon" className="size-7" />
              <span className="text-[14px] text-ink-2">Tara Moon</span>
            </div>
          </div>

          <Sub>Separator</Sub>
          <div className="space-y-3">
            <Separator />
            <div className="flex items-center gap-4">
              <span className="text-[13.5px] text-ink">Schedule</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-[13.5px] text-ink">Crew</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-[13.5px] text-ink">Gear</span>
            </div>
          </div>
        </Section>

        {/* ── FEEDBACK ── */}
        <Section id="feedback" label="Feedback">
          <Sub>Skeleton loaders — solid --elev pulse, no gradient</Sub>
          <div className="grid gap-4 sm:grid-cols-3">
            {[0,1,2].map((i) => (
              <div key={i} className="space-y-3 rounded-[var(--radius)] border-2 border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-8 w-1/3 rounded-full" />
              </div>
            ))}
          </div>
        </Section>

        {/* ── RVLT SIGNATURE ── */}
        <Section id="signature" label="RVLT signature">

          <Sub>Avatar palette — 8 deterministic crew hues · red is never an avatar hue (§3.7)</Sub>
          <Row className="flex-wrap">
            {["Jay Nash","Tara Moon","Rae Singh","Kit Osei","Dev Park","Alex Chen","Finn Murphy","Rosa Estrada"].map((n) => (
              <Tooltip key={n}>
                <TooltipTrigger asChild>
                  <PersonAvatar name={n} className="size-10" />
                </TooltipTrigger>
                <TooltipContent>{n}</TooltipContent>
              </Tooltip>
            ))}
            <Avatar><AvatarFallback className="bg-paper-2 text-muted">?</AvatarFallback></Avatar>
          </Row>
          <p className="text-[12px] text-faint">
            Dark theme: bright fills → <code className="rounded bg-elev px-1 text-[11px]">--dark</code> ink.
            Light theme: white ink except amber/lime → <code className="rounded bg-elev px-1 text-[11px]">--dark</code>.
            Toggle above to verify AA-safe contrast.
          </p>

          <Sub>Flow mascot (§11) — concept idle pose, no fabricated expressions</Sub>
          <Row className="items-end">
            <FlowMascot className="size-8 text-muted" />
            <FlowMascot className="size-12 text-muted" />
            <FlowMascot className="size-16 text-muted" />
            <FlowMascot className="size-20 text-red" eyeColor="var(--amber)" />
            <FlowMascot className="size-20 text-ok" eyeColor="var(--blue)" />
          </Row>

          <Sub>Empty states (§15.5) — mascot + operator-voice line</Sub>
          <div className="grid gap-4 sm:grid-cols-2">
            <EmptyState
              title="Nothing booked yet — Flow's having a quiet one."
              description="Add a booking to get started."
              action={<Button variant="line" size="sm">New booking</Button>}
            />
            <EmptyState
              title="No clashes. Suspiciously calm."
              description="All crew assigned, all gear accounted for."
            />
          </div>

          {/* Pricing / cream tier */}
          <Sub>Cream tier — editorial pop on the hero plan (§4)</Sub>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "Core",    desc: "For small crews",  cream: false, highlight: false },
              { name: "Flow",    desc: "Most crews",       cream: true,  highlight: true  },
              { name: "Network", desc: "Multi-warehouse",  cream: false, highlight: false },
            ].map(({ name, desc, cream, highlight }) => (
              <div
                key={name}
                className={`relative rounded-[var(--r-lg)] border-2 p-5 transition-transform ${
                  cream
                    ? "-translate-y-1.5 border-border bg-[var(--cream)] text-[var(--cream-ink)] shadow-[var(--sh-hover)]"
                    : "border-border bg-card"
                }`}
              >
                {highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red px-3 py-0.5 text-[11px] font-bold text-white">
                    Most crews
                  </span>
                )}
                <p className={`font-display font-extrabold text-[20px] ${cream ? "text-[var(--cream-ink)]" : "text-ink"}`}>{name}</p>
                <p className={`text-[13px] ${cream ? "text-[var(--cream-ink)] opacity-70" : "text-muted"}`}>{desc}</p>
                <div className="mt-4">
                  <Button variant={cream ? "cream" : "line"} className="w-full">Get started</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SEARCH / COMMAND ── */}
        <Section id="search" label="Command palette (§15.5)">
          <div className="rounded-[var(--radius)] border-2 border-border bg-elev shadow-[var(--sh-card),var(--lit)]">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-4 text-muted" />
              <input
                className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-faint outline-none"
                placeholder="Search crew, bookings, equipment…"
                readOnly
              />
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted">⌘K</kbd>
            </div>
            <div className="px-2 py-2">
              {[
                { icon: User,    label: "Sam Kowalski",      hint: "Crew"      },
                { icon: Package, label: "Summer Gala 2026",  hint: "Booking"   },
                { icon: Wrench,  label: "12kW Spotlight #3", hint: "Equipment" },
                { icon: Bell,    label: "Saturday 14 Jun",   hint: "Schedule"  },
              ].map(({ icon: Icon, label, hint }) => (
                <div key={label} className="flex cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2 transition-colors hover:bg-paper-2">
                  <Icon className="size-4 text-muted" />
                  <span className="flex-1 text-[14px] text-ink">{label}</span>
                  <span className="text-[12px] text-faint">{hint}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* footer */}
        <footer className="border-t-2 border-border pt-8 text-center">
          <FlowMascot className="mx-auto mb-3 size-8 text-faint" />
          <p className="font-hand text-[16px] text-red">No clashes. Suspiciously calm.</p>
          <p className="mt-2 text-[12px] text-faint">RVLT Flow · @rvlt/flow-theme v1.1.1 · DESIGN.md v1.1.1</p>
          <p className="mt-1 text-[11px] text-faint">Built for production companies, by a production company.</p>
        </footer>
      </main>
    </TooltipProvider>
  );
}
