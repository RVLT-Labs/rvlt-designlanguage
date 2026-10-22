RVLT Labs makes production software, built by a production company. It was born inside Two Toned Productions in Sydney (audio, lighting, theatre and events). There are three products today:

- **RVLT Flow** — the hire business: jobs, quotes, gear, warehouse, crew, compliance.
- **RVLT Binder** — the stage manager's script binder: cues marked on the page, calling the show.
- **Pulse, by RVLT** — live audio and wireless monitoring: the A2's grid of channels and the A1's mix confidence.

All three run on one design language: warm espresso dark, a single RVLT red, 2px outlines, hard offset shadows, and a voice that sounds like crew. Its master copy is the `RVLT-Labs/rvlt-designlanguage` repo (v1.4.0); this system is synced from it. When two RVLT sources disagree, the repo's authority map (`docs/AUTHORITY.md`) decides: rules, then product contracts, then the machine tokens, then the `@rvlt/flow-theme` registry, then verified examples, and the marketing mockups last.

The brand is used along a dial.
- **Marketing** sits at the *expressive* end: gear stickers, big display type, hand-drawn doodles, spotlight pops.
- **Apps** sit at the *functional* end: "calm data, fun chrome". Dense data stays clean and quiet. Personality goes into the chrome and the moments around it: sidebars, modals, toasts, empty states, success.

The rules below apply to everything RVLT unless a product section says otherwise.

## Content fundamentals

Talk like a production manager, not a marketer. Read it aloud and ask whether a PM would say it.

- **Name the real job or pain, not an aspiration.**
  - Good: "Flow wasn't built to sell software. It was built to solve problems." / "Stop promising gear you've already booked out."
  - Bad: "Unleash your operations."
- **Use the trade's words:** kits, load-out, bump-in, prep, dry hire, sub-hire, test & tag, road case, dock, FOH, AAA, enquiry. For Binder: book, cue, standby, warn, go, calling, department.
- **Be concrete:** "0 double-bookings this month", "99.9% gear accounted for".
- **Dry wit, lightly:** "priced per warehouse, not per headache", "No clashes. Suspiciously calm.", "the quiet before the pad comes in".
- **Banned words:** revolutionary (except as a deliberate joke), streamline, seamless, "transform your workflow", unleash, supercharge. Never fake logos or testimonials. Social proof is positioning: "Built inside Two Toned Productions · tested on real jobs from day one".
- **Sentence case everywhere.** No ALL CAPS, and no `text-transform: uppercase`.
- **Personality has a place, and some places are off-limits.**
  - Allowed in: empty states, onboarding, greetings, positive completions, button labels, tooltips.
  - Banned in: alerts, overdue and compliance failures, conflicts, deletes and other destructive confirmations. There the copy says plainly what happens and what's recoverable: "It goes from the page, the cue list and the cue sheet. Activity keeps a record so it can be reverted."
- **Name people and agents:** "Oli moved LX 12 to p.2 while you were offline." "Jayden via Claude Code placed 42 LX cues."
- No emoji, no glyph characters as icons, no decorative icons.

## Colour

**Espresso (dark) is the primary surface. Paper (light) is the opt-in alternate.** Both themes share the same token names. Tint the dark warm, never cold slate or pure black.

- **Luminance ladder.** Depth comes from stepping up through surfaces, never from glow:
  - `paper`: the page
  - `paper-2`: alternate sections, rails, tab lists
  - `card`: cards, inputs
  - `elev`: the one hovered, active or "live" surface, menus
- **Text:** `ink`, `ink-2`, `muted`. All three pass 4.5:1 on every surface in both themes. `faint` is **not a text colour** (3.0 to 3.3:1 on Espresso, 4.2:1 on Paper `paper-2`): use it for dividers, decorative glyphs and disabled marks. Placeholders, stat labels, hour labels and future stepper labels are `muted`. Every allowed pairing is listed in `packages/flow-theme/contrast.json` and verified by the repo's tests.
- **Lines:** `line` for 1px hairlines. `border` is the signature **2px outline**: `line-2` on Espresso, full `ink` on Paper.
- **`red` is the one accent.** Use it for primary action, live/active state and alerts. It is `#E0363D` on dark and `#C12229` on light. Never use a gradient, and never make red one of many. In apps, red is never a module, department or avatar colour.
- **One red primary per region.** A region is a top bar, a dialog, a panel, or a repeated row or card group. Each gets at most one red primary action, so a list may repeat its row action in red. Red is never decoration.
- **Links** are `link` blue, never red.
- **No gradients, ever.** The single exception is one ≤0.12-alpha amber stage-wash behind a marketing hero.

**Red has two treatments.**
- Solid `action-red` fill with white text means live / active / in use (and the primary action). `action-red` is a slightly deeper red so white text clears 4.5:1 on Espresso (4.8:1); the core `red` stays for the mark, focus and now rings, strokes and indicators.
- `t-out` text on `out-soft` means a problem: overdue, failed, cancelled, conflict.

Red words on a surface (Kalam eyebrows, doodle notes) use `red-text`, never core `red`. There are no contrast exceptions. Status always carries a word as well as the colour.

**Status intents** (identical meaning in every product):

| Intent | Text / dot | Pill |
|---|---|---|
| success | `ok` | `ok` on `ok-soft` |
| warning | `warn` | `warn` on `warn-soft` |
| error | `t-out` | `t-out` on `out-soft` |
| info | `info` | `info` on `blue-soft` |
| neutral | `rep` | `rep` on `rep-soft` |
| live | white | solid `action-red` |

**The categorical ramp** is used for wayfinding, avatars and charts. It runs `blue · amber · green · purple · coral · teal · pink · lime`. Each module or area gets one hue, and its `*-soft` fill marks the active state.
- People get a hue from a stable hash of their name or id.
- Chart series follow the ramp order.
- Red only marks thresholds.

**On-fill rule.** Never assume white text on a colour.
- On Espresso, use `dark` text on every hue fill.
- On Paper, use white, except on `amber` and `lime`, which keep `dark`.
- `action-red` always takes white.

**Fixed tokens** stay the same in both themes:
- `cream` / `cream-ink`: the cream button on a red block, the cream spotlight tier.
- `patch-border`: the sticker die-cut edge.
- Binder's page tokens.

## The spotlight rule (marketing)

A dark page is an espresso stage in a dark room. Light is a spotlight, not the houselights.

- About 90% of every viewport stays in the espresso ramp.
- Spend brightness as **at most 3 pops per page**, each a single object, never a section. Use at most 2 on mobile. The pops are:
  - the glowing light-mode product screenshot (`sh-lightui`)
  - one cream spotlight card
  - one bounded cream panel
- `lit` (the top-edge highlight) is for `elev` surfaces only.
- Red is tiered to one moment per viewport. It builds from the red hero keyword, to a haloed CTA (`sh-halo`), to the full-red closing block as the crescendo.

## Type

| Family | Token | Use |
|---|---|---|
| Archivo | `--font-display` | Headlines, titles, step numbers, stat figures (700–900). **The official display face** everywhere. BC Alphapipe survives only as the drawn RVLT mark. |
| Hanken Grotesk | `--font-sans` | All UI and body text (400 / 500 / 600 / 700) |
| Geist Mono | `--font-mono` | Data: asset tags, IDs, quantities, times, cue and page numbers, key caps. Always tabular. |
| Kalam | `--font-hand` | Handwritten kickers, doodle notes, empty-state lines (400 / 700). Never body text, never alerts. |
| Baloo 2 | `--font-wordmark` | The product half of a lockup only ("Flow"). Not a headline face. |

All five are SIL Open Font License fonts. The files are in `fonts/` and their licences in `fonts/licenses/`.

- **Marketing** uses the *Marketing* styles: `display-xl` 72px hero, `display-l`, `display-m`, `lead` 19px, `body` 16px, Kalam 700 `eyebrow` kickers (often red, slightly rotated).
- **Apps** use the *Functional ramp* only. Don't invent UI sizes:
  - Titles: `text-page-title` 24px / 800, `text-section-header` 18px, `text-card-title` 15px
  - **One page title across RVLT:** every app's page `h1` is 24px / 800 Archivo, shipped as the `t-page-title` utility. Each app's `t-title` stays for dialog, card and section titles.
  - Text: `text-reading-body` 16px, `text-ui-text` 14px, `text-button` 14px / 600, `text-table-cell` 13.5px, `text-caption` 12px, `text-badge` 11px
  - Flow's composite `t-*` presets sit on top of this ramp.
- **11px is the floor everywhere.** Reading body stays at 16px or larger. Functional text may step down.
- **Use high-contrast jumps.** Pair big tight display with small quiet body. Show one bright stat (`stat-hero`, 38px `ink`) and drop its siblings to `stat` (24px `ink-2`).

## Space, shape, elevation

- **Spacing** is a 4px base.
  - Apps use `space-1` … `space-16` (4–64): page padding `space-6`, card padding `space-5`, cells 8 × 12.
  - Marketing breathes on 4 / 8 / 12 / 16 / 20 / 28 / 40 / 56 / 84: `container` 1140px, `gutter` 28px, `grid-gap` 18px, `space-21` section bands.
- **Radii:**
  - `r` 14px: cards, inputs, patches
  - `r-lg` 20px: dialogs, large panels, showcases
  - `r-pill`: Flow and marketing buttons, badges, avatars
  - `r-sm` 8px: checkboxes, tab triggers
  - Binder adds `r-btn` 10px, `r-md` 12px and `r-seg` 9px.
- **Signature edge:** a 2px `border` outline plus a **hard offset shadow, no blur**. Think flight-case labels and enamel patches.
  - `sh-card` at rest; `sh-hover` with a 3px lift.
  - `sh-stk` for stickers and toasts.
  - `lit` for the live/active surface.
  - Inner rows are 1px `line`.
- **The only soft shadows:**
  - marketing's `sh-lightui` screenshot float and the cream pops
  - Binder's `sh-dialog`, a hard drop plus a soft cast

## Motion

Motion is weighty, physical and purposeful, never ambient.

- **Easing:** `cubic-bezier(0.2, 0, 0, 1)`.
- **Durations:** 100 / 150 / 200 / 300ms.
- **Press feedback:** primaries lift 1px on hover and drop 2px on press, and the shadow shrinks.
- **Loops:** at most two signature loops, the live-dot pulse (1.7s) and the pipeline grow (2.4s).
- **Scroll effects:** the hero gear stickers' parallax is the only one, and only on marketing pages.
- **Reduced motion:** honour `prefers-reduced-motion` everywhere. Freeze at rest. Binder drops sheet and press transitions entirely.

## States

Every interactive element handles all of these:
- **Default and hover:** hover is never the only affordance, because touch has no hover.
- **Focus:** a 2px `ring` (red) offset from the surface.
- **Active press**
- **Selected:** `elev` + `lit` + a red or hue indicator.
- **Disabled:** 45% opacity, not-allowed cursor, no shadow.
- **Loading:** the element keeps its width; skeletons are solid `elev` blocks that pulse, with no shimmer gradient.
- **Error:** `t-out` border and ring, plus a text message.
- **Empty:** one operator-voice line.

Touch targets are at least `touch-target` (44px). On phones, honour all four safe-area insets.

## Iconography

- **Lucide** is the icon set; Phosphor only for rare duotone moments.
- Default stroke is 2px. Sizes: 16px inline / rows, 20px buttons / nav / inputs, 24px section headers, and 42px patch icons at 2.6px white stroke.
- Binder's denser chrome uses 18px rail icons and 16px inline icons, also at the 2px stroke. Stroke is 2px in every product.
- Icons inherit text colour (`ink-2`). Module icons take their hue. Status icons always come with a label.
- Exact glyphs for the Flow sidebar are in `assets/Icons`.

## Illustration, photography, mascot

- **Gear stickers are the most ownable element.** The current set is the **Stickers and wordmarks** pack:
  - 19 illustrations, each as a sticker and as linework
  - 7 phrase patches (Standby, Go!, Crew, Load in, On air, Show time, RVLT Flow), each as a patch and as lettering

  The full rules are in the *Stickers and wordmarks* section; the files are in `assets/Stickers`, `Patches`, `Linework` and `Lettering`.
- **How a sticker is built:**
  - a 128-unit canvas
  - a ramp-colour circle or rounded square
  - 3.4-unit cream strokes and a 3-unit `patch-border` edge
  - a hard `#0C0A08` shadow offset 2,4, already in the file
  - a tilt by context: 2–5° in apps (the pack's gallery tilt), up to ±11° in marketing hero clusters
- **Use the supplied files only.** Never redraw, recolour or generate new art.
  - Apps get a single piece in a welcome, onboarding, empty or success state.
  - Marketing gets one focal piece plus one or two companions.
  - Never on data screens, alerts or controls.
  - Go!, Standby and On air are decoration, never status.
- **Doodles** are red Kalam scribble-underlines, dashed circles and arrows with short notes. They cluster around the hero and CTA.
- **Photography** shows the real job: gear, cases, crew, the dock, a lit stage.
  - Use a warm grade, never crushed black, never stock or AI.
  - Frame it like a card: 2px outline, `r-lg`, hard offset shadow.
  - Text goes beside a photo, or over it only on a `scrim`.
- **Albert is RVLT's character.** He is a filled-in bearded dragon, used across every product and the site. Rules and asset picking are in the *Albert* section, and the files are in `assets/Albert` and `assets/Albert-illustrations`.
  - Use him for welcomes, onboarding, large empty states, success and assistant moments, always with the state in live text.
  - Never use him in alerts, compliance, conflict or destructive messages.
- **Flow's stage light** (a moving-head light with googly eyes) stays as Flow's in-app mascot.
  - Use it for empty states, loading, 404, onboarding and success. Never in dense tables, forms or alerts.
  - Only the idle pose exists. Don't invent new ones.

## Logos and lockups

- **`rvlt-mark.svg`** (the RVLT letters in red) and **`rvlt-labs-logo.svg`** (RVLT LABS) are the company marks.
  - RVLT is drawn from BC Alphapipe outlines. It is always the SVG, never typed.
  - The LABS half is white, so use the Labs logo on dark grounds only.
- **Product lockups** are red **RVLT** plus the product name in `ink`. Use the files that match the ground: `rvlt-flow-wordmark-dark/-light.svg`.
  - Flow's own name is Baloo 2.
  - "RVLT BINDER" follows the same pattern.
- **App marks:**
  - Flow's compact R mark (`r-mark-*`) is for its collapsed rail.
  - Binder's mark is a monoline B on the red tile, whose two bowls are binder rings (`binder-mark.svg`, `cream` ink on `red`, tile radius 116/512). In the app header it sits beside "Binder" in Archivo 800 with a "by RVLT" chip.
  - For print footers, use the bare mark in page ink.
- Never recolour, stretch or redraw a mark.

## RVLT Flow — the hire business

Flow's character is "Field Premium": sharp, practical, slightly dry, like an ops room that runs well.

- **Module hues:**
  - Projects / Dashboard: `blue`
  - Assets: `amber`
  - Schedule / Finance: `green`
  - Crew: `purple`
  - Maintenance: `coral`
  - Warehouse / Test & Tag: `teal`
- **Desktop shell:** a 220px sidebar (`sidebar-width`) where each item carries its module hue.
- **Mobile:** a 5-slot bottom nav (Dashboard, Jobs, Warehouse, Crew, Assets), with the active slot in red.
- **Buttons** are pills (Button). Buttons are deliberately per product.
- **App icon:** the R mark in cream on an RVLT-red tile, built the same way as Binder's icon.
- **Empty states** are centred and mascot-led (EmptyState).
- **Dashboards** are bento grids of bordered tiles, at most 4 per row.
- **Detail pages** use two columns of about 63/37, with a sticky key-facts aside of at least `detail-aside-min`.
- **Content zones** cap at `content-max` (1080px); tables run full width.
- **Projects** show their lifecycle in LifecycleStepper.

## RVLT Binder — the prompt corner

Binder is used in the dark: at the tech table, at FOH, in a bio box. Its mood is calm, quick and quiet. Three rules outrank everything else in Binder:

1. **The page is paper.** A script page renders as `page` white in both themes and is the brightest thing on screen. It sits on `stage`. Chrome never competes with it, and controls stay muted until hovered or focused.
2. **Department colour is the only colour on the page.**
   - Defaults are `dept-lx`, `dept-snd`, `dept-tm`, `dept-sm`, `dept-vid`, `dept-stg`, `dept-fly`, all tuned as ink on white.
   - In chrome, a department shows as its ramp tint (amber, blue, purple, teal, pink, coral, lime).
   - Red is never a department. The colour picker refuses anything within ΔE76 20 of RVLT red.
3. **Two modes, one layout.** Markup is the full shell. Calling strips it to the page, a slim status line and a floating strip, and nothing is editable. What you mark is what you call and what you print.

The rest of Binder:
- **Buttons are rounded rectangles** (BinderButton): 30px tall with `r-btn` on desktop, 44px with `r-md` on phones. This is the deliberate per-product difference. Red follows the per-region rule: the top bar's primary plus each script row's Open.
- **Page `h1`s** use `t-page-title` (24px / 800). Dialog titles keep the mockups' 22px `t-title`.
- **Markup type on the page is Helvetica-metric**, so screen and print measure identically. This is the one place RVLT's UI fonts aren't used. The script's own text is never restyled.
- **Every cue number, page, version, time, count and key cap** is Geist Mono, tabular.
- **Shell:**
  - Desktop: a `binder-rail` (56px) with hues Script `blue`, Cues `amber`, Docs `teal`, Activity `purple`, Exports `green`; a `binder-topbar` (44px); a docked `binder-panel` (340px).
  - Tablet: an icon rail, and the panel as a 360px slide-over.
  - Phone: a 5-tab bar (Script · Cues · Docs · Activity · More) with red active tabs and `muted` inactive ones; the cue editor as a bottom sheet with a 20px top radius.
- **⌘K palette** (`palette-width`, `r-lg`) has fixed groups: Go to · Cues · In the script · Actions. Key caps (Kbd) sit next to their actions.
- **Offline is a state, not an error.** It shows as a muted dot and the OfflineBanner, never red.
- **Kalam** appears only in greetings, the sign-in card and empty states, in `ink-2`.
- **No mascot of its own.** Albert may appear where Kalam may: greetings, sign-in and empty states. Never in Calling mode.

## Pulse, by RVLT — the instrument panel

Pulse is read in a wing, a booth or at a tech table, lights down, for a few seconds at a time. It is dark only (no Paper theme). Its mood is calm and exact. Three rules outrank everything else in Pulse:

1. **Never colour alone, and never a guess that looks like a measurement.** Every state carries a glyph and a word. Observed, inferred, stale and unknown data look different, and unknown is never drawn as zero or healthy.
2. **Machine type is mono, human type is not.** Levels, frequencies, times and IDs are Geist Mono, tabular. An operator's note is Hanken Grotesk italic in `ink-2`. Kalam isn't used.
3. **Mute and dim are always one touch away**, never in a menu. Listening starts unmuted.

The rest of Pulse:
- **Red on a channel card means a critical fault, and nothing else.** In chrome, red is the primary action and the RVLT mark. This narrows the per-region rule, because a "listening" ring and a "failing" ring in one colour can't be told apart on a 64-channel grid.
- **Live and listening are `ok` green**, the same live pill as Flow.
- **Per-channel status** is `ok` / `warn` / `t-out` / `rep` tick fills with labels, and `purple` for replay.
- **Cards** are a 2px `line-2` outline with the hard offset shadow. **Secondary controls** (filter chips, toggles, icon and outline buttons) are a 1px `line-2` pill with no shadow. The offset shadow belongs to cards, panels and the red primary.
- **Focus** is a 2px `red` ring on chrome and a 2px `ink` ring on channel cards, so focus never reads as a fault.
- **Buttons** are pills with a red primary.
- **No mascot, stickers, Kalam or doodles** on live screens. The one soft glow is the attention pulse around an unacknowledged critical alert or an unclaimed fault report.
- **Lockup:** the five-bar Pulse glyph in `cream` on a `red` tile (radius 22.6%, built like Binder's and Flow's icons), beside "Pulse" in Archivo 800, with a "by RVLT" pill holding the unaltered RVLT mark.
- **Fonts are self-hosted**, because core show operation works without internet.
- **Run of show** rows sit behind one collapsible disclosure with a summary line; they have no panel of their own.

The Pulse mark is `assets/Logos/pulse-mark.svg`, and the **PulseChannelCard** card (group Pulse, a static rendition) shows the lockup and three channel states: listening, a critical fault and stale/unknown.

Pulse lives in `qubered/a2-monitor`; its own `docs/design/DESIGN.md` (v3.0.0) holds the channel card, status strip and alert overlay. It mirrors the token values in `packages/ui/tokens.css` rather than installing `@rvlt/flow-theme`.

## Components

**20 cards are live**: the real React components from both apps, compiled into `components/bundle.js` (`window.Rvlt`, React 18.3.1 from `components/lib/`) and styled by `components/bundle.css` (Tailwind v4 compiled from their own class strings, mapped onto these tokens). Clicking a Tab, Switch, Checkbox or Segmented in a preview really changes it, and the theme switch flips them exactly as the apps do. Three Binder cards and the two artwork cards stay static renditions (class prefix `rf-`): the real Binder ones need PowerSync, the PDF page layer or app state.

- **Shared RVLT primitives, live** (the `@rvlt/flow-theme` registry, as shipped in Flow): Button, Badge, StatusIndicator, Card/Panel, Stat, EmptyState, Skeleton, Input, Checkbox, Switch, Tabs, SectionHeader, Table, LifecycleStepper, FeaturePatch, PersonAvatar, Kbd.
- **Binder, live:** BinderButton, Segmented, BinderEmptyState.
- **Binder, static:** Notice + OfflineBanner, SyncStatus, CueTag.
- **Artwork, static:** Sticker (placing pack art), Albert (RVLT's character).
- **Composing them:**
  - Radix overlays (Dialog, Sheet, DropdownMenu, Popover, Select, Tooltip) compose with `asChild`.
  - Each Tooltip needs a `TooltipProvider` ancestor.
- Never ship a stock shadcn primitive. Restyle it through the role aliases (`primary`, `border`, `ring`, `destructive`).

## Not synced

**Sources**
- `RVLT-Labs/rvlt-designlanguage` (`DESIGN.md` v1.4.0, `packages/flow-theme`, `assets/`). This is the master copy, and its `design-system/` folder mirrors this design system file for file. The 2026-10-19 decisions are merged there (#12), in Flow (`TwoToned/gearflow` #1352) and in Binder (`RVLT-Labs/binder` #1).
- `TwoToned/gearflow` (`src/app/globals.css`, `DESIGN.md`, `src/components`)
- `qubered/a2-monitor` (`packages/ui/tokens.css`, `packages/ui/brand`, `docs/design/DESIGN.md`) — Pulse; documented here, not synced into the bundle
- `RVLT-Labs/binder` (`apps/web/src/styles`, `DESIGN.md`, `apps/web/src/components`, `packages/core` cue geometry)

**Not brought in**
- **BC Alphapipe** is only the drawn RVLT mark; Archivo is the official display face, so no font file is missing.
- **Motion** durations are prose only, because the token format has no motion family.
- **Org branding** red ramps (Flow's BrandingProvider) are not included.
- **Marketing reference pages:** the Flow marketing mockups (`examples/flow-marketing/` in the repo) are not imported as cards. They are expression only and never win a conflict.
- **Registry components not rendered:** accordion, breadcrumb, combobox, command, dialog, drawer, dropdown-menu, popover, select, sheet, sonner, tooltip, page-header, crew-scheduler.
- **Binder components not rendered:** AppShell, ContextPanel, CueEditor, LayerRow, ToolStrip, CueTable, ActivityRow, ReviewRow, DocumentRow, Presence, CommandPalette, CallingStrip, GoToKeypad, Confirm.
- **Artwork not imported:** the sticker pack's illustrated Word guide and style figures (its text is condensed into *Stickers and wordmarks*). Also the Albert pack's PNG exports of his SVGs (the SVGs themselves are here).
- **Known source gaps:**
  - In Paper, the `amber` icon on `amber-soft` is about 2:1. It's a graphic, not text, but it's under 3:1.
  - Flow's email and PDF templates still default to the old teal; PDF branding is deferred in Flow's own `DESIGN.md`.
  - Binder's mockups still draw 22px titles, 1.8 icon strokes and 10.5px key caps. The code and `DESIGN.md` now follow the RVLT decisions, and the difference is recorded in Binder's decisions log.

Connection freshness uses StatusIndicator `live`, a green dot and the words “Connection live”. It is distinct from an active selection edge and a domain label such as “Checked out”. Solid action-red pills describe active operational states only when a consumer explicitly chooses that composition. The public StatusIndicator API does not expose a red pill or domain mapping. Flow gallery cards use the local registry; pinned Binder adapters remain labelled separately.
