# Authority map

This is the one place that decides **which RVLT source wins** when two of them disagree. Every
other document points here. The machine-readable copy is [`authority.json`](../authority.json);
`tests/unit/authority.test.mjs` fails if a top-level file or folder is not classified in it, or if
a document still crowns a lower layer.

## The layers, highest first

1. **Normative RVLT rules** — [`DESIGN.md`](../DESIGN.md) §0–§18 and this map. What things mean,
   accessibility, voice, budgets, the spotlight rule, the contrast contract (§3.8), touch targets
   (§16.8). Owned by this repository (`RVLT-Labs/rvlt-designlanguage`). Prose is normative where it
   states a rule; where prose and a table give values, the table wins; where a table and the
   machine tokens disagree, that is a bug in the table.
2. **Product contracts** — [`DESIGN.md` §19](../DESIGN.md#19-product-layers--rvlt-flow-rvlt-binder-and-pulse):
   RVLT Flow, RVLT Binder and Pulse. The only places a product may depart from layer 1, and only where §19
   records the difference as deliberate (Flow pills versus Binder rounded rectangles, Binder's
   fixed white script page, Binder department colours, Pulse's fault-only red on channel
   cards and 1px secondary controls). A product's own `DESIGN.md` may add what
   only it needs; it never overrides layer 1 silently.
3. **Canonical machine tokens** — [`packages/flow-theme/tokens.json`](../packages/flow-theme/tokens.json)
   (values) and [`packages/flow-theme/contrast.json`](../packages/flow-theme/contrast.json)
   (which pairings are allowed). Mirrors, never sources: `DESIGN.md` Appendix A and §15.1
   (`check-sync.mjs`), [`design-system/tokens.json`](../design-system/tokens.json)
   (`scripts/design-system/check.mjs`). Generated, never hand-edited:
   `packages/flow-theme/dist/`.
4. **Implementation** — the `@rvlt/flow-theme` registry
   ([`packages/flow-theme/registry/`](../packages/flow-theme/registry)) is the **public component
   contract**: component names, props and behaviour that agents install and copy. Its
   generated CSS and font faces ship from `dist/`.
5. **Verified examples** — compositions that are compiled or rendered by the test suite:
   [`examples/`](../examples) (reference compositions and the static catalogue),
   [`apps/preview-v2`](../apps/preview-v2) (compiled against the registry source), and the
   [design-system cards](../design-system/components). Flow cards render the local registry overlay built by `scripts/design-system/bundle/build-registry.mjs`. Binder cards retain the pinned app adapters. Compilation and browser evidence are recorded separately in `docs/AUDIT-REMEDIATION-MATRIX.md`; the layer name does not imply that every human validation has passed.
6. **Marketing expression** — [`examples/flow-marketing/`](../examples/flow-marketing) (Espresso
   and Paper). It demonstrates the expressive end of the dial: the spotlight, stickers, doodles,
   copy. **Marketing never wins a conflict.** Copy its feel, never its values; its figures are
   illustrative, not measured.

## Resolving a conflict

- **A higher layer wins.** Fix the lower layer in the same change, or, if the higher layer is
  wrong, change it first (with a changelog line in `DESIGN.md` §18.3) and then regenerate or
  re-check the mirrors.
- **Tokens:** change `tokens.json`, mirror Appendix A and §15.1, mirror `design-system/tokens.json`,
  run `node packages/flow-theme/scripts/build-css.mjs`, then `npm test`.
- **A lower layer that cannot be fixed here** (for example a Flow or Binder adapter in the live
  bundle) is labelled where it is shown and listed under *Not yet adopted* below. It never becomes
  the reference by being the thing on screen.

## Ownership and sync

| Source | Owner | Direction | Guard |
|---|---|---|---|
| `DESIGN.md`, `docs/`, `authority.json`, `README.md`, `index.html` | this repository | master | `tests/unit/authority.test.mjs` |
| `packages/flow-theme/` | this repository | master; Flow installs it | `tests/unit/*.test.mjs`, `check-sync.mjs`, preview-v2 typecheck |
| `design-system/` (overview, tokens, cards, fonts, logos, icons) | this repository; published to the claude.ai design-system artifact | repo → artifact | `scripts/design-system/check.mjs` |
| `design-system/components/bundle.js`, `bundle.css` (Part 1) | **generated** from `TwoToned/gearflow` and `RVLT-Labs/binder` at pinned commits | Flow/Binder → repo, generated files only | `scripts/design-system/bundle/build.mjs` writes only the files `authority.json` marks `generated-external`, and refuses to overwrite anything else |
| `design-system/components/bundle.css` (Part 2) | this repository (`scripts/design-system/bundle/static.css`) | master | `check.mjs` verifies Part 2 equals `static.css` |
| `assets/stickers/`, `assets/albert/`, `design-system/assets/Logos/` | locked identity artwork | supplied packs; never redrawn | `check.mjs` (sizes, presence), Albert `Design-lock.json` hashes |
| `examples/flow-marketing/` | this repository | expression only | browser and link tests |

## Not yet adopted downstream

These contracts changed here and still need adopting in the products. They are human/product work,
not something this repository can close:

- Flow's `globals.css` and components: `--action-red` for primary fills, `--control-line` for
  control boundaries, `--muted` instead of `--faint` for readable meta, ink labels on active module
  items, the 44px hit areas and named stepper rings in the registry.
- Binder's cue tags: department abbreviation in `--page-ink` (the static CueTag rendition here
  already follows the contract).
- The external bundle retains its pinned Flow and Binder sources. Published Flow cards overlay it with this repository's registry. Binder adapter adoption still requires product work.
