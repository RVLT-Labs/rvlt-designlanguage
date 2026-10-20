# Button

The RVLT pill button with a tactile press — Flow and marketing; red `primary` is the one main action per view. Binder draws its buttons as rounded rectangles (see BinderButton).

## When to use
- `primary` — the single most important action in a view (Save, Book out, Send quote). One per region.
- `line` — secondary actions: 2px `border` outline, fills `ink` on hover.
- `ghost` — tertiary / cancel: text only, turns `red` on hover.
- `halo` — hero CTA only (marketing, auth). Adds the `sh-halo` bloom. Never inside the app shell.
- `cream` — only on a full-`red` block (the marketing final CTA).
- Danger pattern: start as `line`, escalate to a filled `destructive` on hover. Never a red primary for delete.

## Sizes
`default` 44px (`touch-target`), `sm` 44px on phones / 36px from 640px up, `lg` 48px at 15px, `icon` 44×44. Icons inside are 20px Lucide glyphs.

## Behaviour
- Hover lifts 1px; active drops 2px and the `red-700` offset shadow shrinks from 3px to 1px.
- `loading` shows a spinner over the label and keeps the label's width (no layout shift), sets `aria-busy`, disables.
- Disabled: 45% opacity, no shadow, no lift, not-allowed cursor.
- Focus: 2px `ring` with a 2px `paper` offset.

## Consumer provides
Label text in sentence case, an optional leading Lucide icon, `onClick` or `asChild` with a `<Link>` (Radix Slot). Shortcut hints go in a tooltip: "New asset (N)".

_Published Flow preview: local registry source, compiled by `scripts/design-system/bundle/build-registry.mjs`. The pinned external bundle is retained for Binder adapters._
