# Logos

## Company
- `rvlt-mark.svg`: the RVLT letters, drawn from BC Alphapipe outlines, in light-theme red #C12229. Use it on light grounds. On Espresso, the apps draw the same shapes in #E0363D.
- `rvlt-labs-logo.svg`: RVLT LABS. RVLT is in #C12229 and LABS in white, so use it on dark grounds only.

## RVLT Flow
- `rvlt-flow-wordmark-dark.svg`: for Espresso grounds. RVLT in `red` #E0363D, FLOW in `ink` #F5EFE2.
- `rvlt-flow-wordmark-light.svg`: for Paper grounds. RVLT in #C12229, FLOW in #1D1A15.
- `r-mark-dark.svg` / `r-mark-light.svg`: Flow's compact R mark for the collapsed nav rail, in that theme's `red`.
- `flow-mascot.svg`: Flow, the stage-light mascot, in its idle pose. The body uses dark-theme `muted` #9E9483, the eyes `blue` #5B8DEF and the glints `cream`. Use it only in Flow's empty states and onboarding, never in alerts.

## RVLT Binder
- `binder-mark.svg`: the Rings B. It's a monoline B in `cream` #F5EFE2 (stem stroke 50, bowls stroke 44, round caps) on an RVLT red #E0363D tile with radius 116 on a 512 grid. It serves as the app icon, favicon and header mark.

The apps draw their marks inline with `var(--red)` / `var(--ink)` so they switch with the theme. These files bake each theme's values in, because an `<img>` can't inherit CSS colours.

Always pick the file that matches the ground it sits on. Never recolour, stretch or redraw the marks.
