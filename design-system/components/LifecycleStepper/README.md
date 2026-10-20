# LifecycleStepper

The project-status spine — Enquiry, Quote, Confirmed, Prep, On site, Return — as numbered rings joined by connectors.

States: `done` = `ink` ring filled, check icon; `now` = `red` ring + 5px `red-soft` glow + semibold label; `future` = `line-2` ring on `card`, `faint` label. Rings are 28px, Geist Mono 12px bold. Connectors: `ink` after done, `red` into now, `line-2` ahead.

Horizontal from 768px (shown); a vertical timeline on phones. Rings become buttons when `onStepClick` is set.

## Consumer provides
`steps: { label, state }[]`, optional `onStepClick(index)`.

_Published Flow preview: local registry source, compiled by `scripts/design-system/bundle/build-registry.mjs`. The pinned external bundle is retained for Binder adapters._
