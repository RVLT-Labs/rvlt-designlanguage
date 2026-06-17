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

function Label2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-widest text-faint ${className}`}>{children}</p>
  );
}

// ─── crew data for scheduler / table demo ────────────────────────────────────

const CREW = [
  { name: "Sam Kowalski", role: "Crew Chief", status: "ok" as const, hours: "8h" },
  { name: "Mia Thornton", role: "Rigger", status: "warn" as const, hours: "6h" },
  { name: "Dev Patel", role: "Lighting Op", status: "ok" as const, hours: "8h" },
  { name: "Jess Rivera", role: "A1 Audio", status: "overbooked" as const, hours: "12h" },
  { name: "Tom Larsen", role: "Camera Op", status: "repair" as const, hours: "4h" },
];

const STEPS: Step[] = [
  { label: "Enquiry", state: "done" },
  { label: "Quote", state: "done" },
  { label: "Confirmed", state: "now" },
  { label: "Prep", state: "future" },
  { label: "On site", state: "future" },
  { label: "Return", state: "future" },
];

const PALETTE_TOKENS = [
  { token: "--paper", label: "paper" },
  { token: "--paper-2", label: "paper-2" },
  { token: "--card", label: "card" },
  { token: "--elev", label: "elev" },
  { token: "--red", label: "red" },
  { token: "--ok", label: "ok" },
  { token: "--warn", label: "warn" },
  { token: "--amber", label: "amber" },
  { token: "--blue", label: "blue" },
  { token: "--green", label: "green" },
  { token: "--purple", label: "purple" },
  { token: "--coral", label: "coral" },
  { token: "--teal", label: "teal" },
  { token: "--pink", label: "pink" },
  { token: "--lime", label: "lime" },
];

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
          <span className="font-display font-extrabold tracking-tight text-ink">
            RVLT Flow
          </span>
          <Badge status="neutral" className="hidden sm:inline-flex">Preview v2</Badge>
        </div>

        <nav className="hidden gap-4 text-[13px] text-muted sm:flex">
          {["buttons", "cards", "forms", "overlays", "data", "signature"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="capitalize transition-colors hover:text-ink"
            >
              {s}
            </a>
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
          Preview v2 — 27 components · installed from{" "}
          <code className="rounded bg-elev px-1.5 py-0.5 font-mono text-[13px] text-ink-2">
            @rvlt/flow-theme
          </code>
        </p>
        <Row className="mt-6 justify-center">
          <Button variant="primary">Get started</Button>
          <Button variant="line">View docs</Button>
          <Button variant="ghost">Learn more</Button>
        </Row>
      </div>

      {/* content */}
      <main className="mx-auto max-w-5xl space-y-16 px-5 py-12">

        {/* ── COLOUR PALETTE ── */}
        <Section id="colour" label="Colour tokens">
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-15">
            {PALETTE_TOKENS.map(({ token, label }) => (
              <div key={token} className="flex flex-col gap-1.5">
                <div
                  className="h-10 w-full rounded-[var(--radius)] border border-line"
                  style={{ background: `var(${token})` }}
                />
                <span className="text-[10px] text-faint">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["ok-soft", "warn-soft", "out-soft", "rep-soft"] as const).map((t) => (
              <div
                key={t}
                className="rounded-[var(--radius)] border border-line p-3 text-[12px] text-muted"
                style={{ background: `var(--${t})` }}
              >
                --{t}
              </div>
            ))}
          </div>
        </Section>

        {/* ── BUTTONS ── */}
        <Section id="buttons" label="Buttons">
          <Label2>Variants</Label2>
          <Row>
            <Button variant="primary">Primary</Button>
            <Button variant="halo">Halo CTA</Button>
            <Button variant="line">Line</Button>
            <Button variant="ghost">Ghost</Button>
            <div className="rounded-[var(--radius)] bg-red p-3">
              <Button variant="cream">Cream</Button>
            </div>
          </Row>

          <Label2>Sizes</Label2>
          <Row className="items-end">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </Row>

          <Label2>States</Label2>
          <Row>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button variant="line" disabled>Disabled outline</Button>
          </Row>

          <Label2>With icon</Label2>
          <Row>
            <Button variant="primary">
              <Bell className="size-4" />
              Notify crew
            </Button>
            <Button variant="line" size="icon">
              <Wrench className="size-4" />
            </Button>
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
        </Section>

        {/* ── CARDS ── */}
        <Section id="cards" label="Cards">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Standard card</CardTitle>
                <CardDescription>2px outline · hard offset shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[13.5px] text-muted">
                  The base surface for content. No gradients, no blur.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Badge status="ok">Ready</Badge>
              </CardFooter>
            </Card>

            <Card interactive>
              <CardHeader>
                <CardTitle>Interactive card</CardTitle>
                <CardDescription>Hover lifts to --sh-hover</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[13.5px] text-muted">
                  Clickable cards lift 3px on hover. Try it.
                </p>
              </CardContent>
              <CardFooter>
                <ChevronRight className="ml-auto size-4 text-muted" />
              </CardFooter>
            </Card>

            <Card live>
              <CardHeader>
                <CardTitle>Live card</CardTitle>
                <CardDescription>Active · real-time · elevated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-ok" />
                  <span className="text-[13.5px] text-ok">On site · 3h 12m</span>
                </div>
              </CardContent>
              <CardFooter>
                <Badge status="ok">Live</Badge>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section id="typography" label="Typography">
          <div className="space-y-4">
            <div>
              <Label2>BC Alphapipe (display)</Label2>
              <p className="font-display font-extrabold text-[36px] tracking-tight text-ink">
                Run the show.
              </p>
            </div>
            <div>
              <Label2>DM Sans (sans — body)</Label2>
              <p className="font-sans text-[16px] text-ink-2">
                Production software built for people who actually do the work. Clear,
                direct, no fluff — like good ops.
              </p>
            </div>
            <div>
              <Label2>Mono (figures + code)</Label2>
              <p className="font-mono text-[15px] text-ink-2">
                08:30 → 16:00 · 7.5h · $1,240.00
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 rounded-[var(--radius)] border-2 border-border bg-card p-5">
            <Label2>App type ramp (§5.5)</Label2>
            {[
              ["text-page-title", "24px", "Page title"],
              ["text-section-head", "18px", "Section heading"],
              ["text-card-title", "15px", "Card title"],
              ["text-ui-text", "14px", "UI text"],
              ["text-table-cell", "13.5px", "Table cell"],
              ["text-label", "12px", "Label / meta"],
              ["text-micro", "11px", "Micro (floor)"],
            ].map(([cls, size, label]) => (
              <div key={cls} className="flex items-baseline gap-3">
                <span className={`${cls} font-sans text-ink`}>{label}</span>
                <span className="text-[11px] text-faint">{size}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── FORMS ── */}
        <Section id="forms" label="Form controls">
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
              <Label htmlFor="error-input">Error state</Label>
              <Input
                id="error-input"
                placeholder="Invalid entry"
                aria-invalid
                defaultValue="bad@"
              />
              <p className="text-[12px] text-red">Please enter a valid email.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="check1"
                checked={checked}
                onCheckedChange={(v) => setChecked(!!v)}
              />
              <Label htmlFor="check1">Available this week</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="check2" defaultChecked />
              <Label htmlFor="check2">On call</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="sw1"
                checked={switchOn}
                onCheckedChange={setSwitchOn}
              />
              <Label htmlFor="sw1">
                {switchOn ? "Notifications on" : "Notifications off"}
              </Label>
            </div>
          </div>
        </Section>

        {/* ── OVERLAYS ── */}
        <Section id="overlays" label="Overlays">
          <Row className="flex-wrap">
            {/* Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="line">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm booking</DialogTitle>
                  <DialogDescription>
                    This will send a confirmation to the crew and lock in the
                    schedule. You can still make changes before the prep date.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button variant="primary">Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="line">Open sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Crew details</SheetTitle>
                  <SheetDescription>
                    Review assignment and rates for this booking.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {CREW.slice(0, 3).map((c) => (
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
                  <SheetClose asChild>
                    <Button variant="line" className="w-full">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="line">Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <p className="text-[14px] font-semibold text-ink">Quick filters</p>
                <p className="mt-1 text-[12.5px] text-muted">
                  Floating panel for contextual actions. 2px outline + elevated surface.
                </p>
              </PopoverContent>
            </Popover>

            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="line" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="size-4" />
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red">
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            {/* Toasts */}
            <Button
              variant="line"
              onClick={() => toast.success("Booking confirmed — crew notified.")}
            >
              Toast success
            </Button>
            <Button
              variant="line"
              onClick={() => toast.warning("Double-booking detected on Saturday.")}
            >
              Toast warning
            </Button>
            <Button
              variant="line"
              onClick={() =>
                toast.error("Failed to save — check your connection.")
              }
            >
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
              <p className="text-[14px] text-muted">
                Shift grid and booking timeline lives here.
              </p>
            </TabsContent>
            <TabsContent value="crew">
              <p className="text-[14px] text-muted">
                Roster, availability, and hours at a glance.
              </p>
            </TabsContent>
            <TabsContent value="equipment">
              <p className="text-[14px] text-muted">
                Gear, repair status, and check-out records.
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Label2>Accordion / FAQ</Label2>
            <Accordion type="single" collapsible className="mt-3 max-w-xl">
              <AccordionItem value="q1">
                <AccordionTrigger>What counts as a double-booking?</AccordionTrigger>
                <AccordionContent>
                  When the same crew member is assigned to two overlapping bookings
                  with no buffer. Flow flags these in amber and won&apos;t let you
                  confirm until resolved.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Can I book crew cross-company?</AccordionTrigger>
                <AccordionContent>
                  Yes — with a cross-company agreement in place. Each company&apos;s
                  rates apply independently. Flow prorates automatically.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>How does the lifecycle stepper work?</AccordionTrigger>
                <AccordionContent>
                  It tracks the booking through Enquiry → Quote → Confirmed → Prep →
                  On site → Return. Each stage unlocks the next action.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Section>

        {/* ── DATA ── */}
        <Section id="data" label="Data display">
          <Label2>Crew roster table</Label2>
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
                {CREW.map((row) => (
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
                        {row.status === "ok"
                          ? "Available"
                          : row.status === "warn"
                          ? "Check due"
                          : row.status === "overbooked"
                          ? "Overbooked"
                          : "In repair"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-ink-2">
                      {row.hours}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Label2 className="col-span-full">Stats (§9)</Label2>
            <Stat bright figure="47" label="Crew booked this month" />
            <Stat figure="3" label="Double-bookings avoided" />
            <Stat figure="99.9%" label="Accounted for" />
            <Stat figure="0" label="Unresolved conflicts" />
          </div>

          <div className="mt-6">
            <Label2>Separator</Label2>
            <div className="mt-3 space-y-3">
              <Separator />
              <div className="flex items-center gap-4">
                <span className="text-[13.5px] text-ink">Section A</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-[13.5px] text-ink">Section B</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-[13.5px] text-ink">Section C</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── FEEDBACK ── */}
        <Section id="feedback" label="Feedback">
          <Label2>Skeleton loaders</Label2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
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

        {/* ── LIFECYCLE STEPPER ── */}
        <Section id="stepper" label="Lifecycle stepper">
          <div className="rounded-[var(--radius)] border-2 border-border bg-card p-5">
            <p className="mb-4 text-[13px] text-muted">
              Prod booking · Summer Gala 2026 — vertical on mobile, horizontal on md+
            </p>
            <LifecycleStepper steps={STEPS} />
          </div>
        </Section>

        {/* ── SIGNATURE ── */}
        <Section id="signature" label="RVLT signature">
          <Label2>Avatar palette — 8 deterministic crew hues (§3.7)</Label2>
          <Row className="flex-wrap">
            {CREW.map((c) => (
              <Tooltip key={c.name}>
                <TooltipTrigger asChild>
                  <PersonAvatar name={c.name} className="size-10" />
                </TooltipTrigger>
                <TooltipContent>{c.name}</TooltipContent>
              </Tooltip>
            ))}
            {["Alex Chen", "Finn Murphy", "Rosa Estrada"].map((n) => (
              <Tooltip key={n}>
                <TooltipTrigger asChild>
                  <PersonAvatar name={n} className="size-10" />
                </TooltipTrigger>
                <TooltipContent>{n}</TooltipContent>
              </Tooltip>
            ))}
            <Avatar>
              <AvatarFallback className="bg-paper-2 text-muted">?</AvatarFallback>
            </Avatar>
          </Row>

          <div className="mt-6">
            <Label2>Flow mascot (§11)</Label2>
            <Row className="mt-2 items-end">
              <FlowMascot className="size-8 text-muted" />
              <FlowMascot className="size-12 text-muted" />
              <FlowMascot className="size-16 text-muted" />
              <FlowMascot className="size-20 text-red" eyeColor="var(--amber)" />
              <FlowMascot className="size-20 text-ok" eyeColor="var(--blue)" />
            </Row>
          </div>

          <div className="mt-6">
            <Label2>Empty states (§15.5)</Label2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
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
          </div>
        </Section>

        {/* ── SEARCH / COMMAND ── */}
        <Section id="search" label="Command palette">
          <div className="rounded-[var(--radius)] border-2 border-border bg-elev shadow-[var(--sh-card),var(--lit)]">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-4 text-muted" />
              <input
                className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-faint outline-none"
                placeholder="Search crew, bookings, equipment…"
                readOnly
              />
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted">
                ⌘K
              </kbd>
            </div>
            <div className="px-2 py-2">
              {[
                { icon: User, label: "Sam Kowalski", hint: "Crew" },
                { icon: User, label: "Mia Thornton", hint: "Crew" },
                { icon: Wrench, label: "12kW Spotlight #3", hint: "Equipment" },
                { icon: Bell, label: "Summer Gala 2026", hint: "Booking" },
              ].map(({ icon: Icon, label, hint }) => (
                <div
                  key={label}
                  className="flex cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2 transition-colors hover:bg-paper-2"
                >
                  <Icon className="size-4 text-muted" />
                  <span className="flex-1 text-[14px] text-ink">{label}</span>
                  <span className="text-[12px] text-faint">{hint}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[12px] text-faint">
            Static preview — use the Command component for the real interactive palette.
          </p>
        </Section>

        {/* footer */}
        <footer className="border-t-2 border-border pt-8 text-center">
          <FlowMascot className="mx-auto mb-3 size-8 text-faint" />
          <p className="text-[12px] text-faint">
            RVLT Flow · @rvlt/flow-theme v1.1.1 · DESIGN.md v1.1.1
          </p>
          <p className="mt-1 text-[11px] text-faint">
            Built for production companies, by a production company.
          </p>
        </footer>
      </main>
    </TooltipProvider>
  );
}
