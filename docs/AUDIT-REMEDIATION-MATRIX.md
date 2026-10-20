# Audit remediation matrix

Scope: the preserved branch `fix/rvlt-brand-authority-audit-remediation`, based on `e5296118569e91a2a9acff695d699f928485f356`. Inputs are the full `UI-UX-REVIEW.md`, `INDEPENDENT-VERIFICATION.md` and `CODEX-UI-UX-REVIEW.md` in the sibling artifacts directory. This is implementation evidence, not an independent review or a conformance certificate.

Status **I** means implemented with source, unit or compilation evidence. **V** means the row has relevant automated Chromium coverage in the final integrated run, not exhaustive accessibility certification. **H** means human or downstream product validation remains open. Combined statuses retain those limitations.

## Final integrated verification

`FINAL-VERIFICATION.log` records **91/91 unit checks and 142/142 browser tests passing**, with no skipped or cancelled tests. Theme and registry generation, local gallery compilation, preview typecheck and production export, site build, token/mirror/freshness checks and 443 internal links all passed. Chromium covered 320, 390, 768 and 1440px, Espresso and Paper, reduced motion, real fonts, accessible names, keyboard interaction, hit areas and recovery compositions under `/rvlt-designlanguage/`.

Earlier red runs are preserved separately and do not describe the delivered result. Independent code review found six defects, which were fixed with red/green regressions. Subsequent independent reviews approved the repaired source. Separate visual verification found a silent empty root CSS-generation block; the generator now handles empty blocks and rejects absent or duplicate markers. Painted theme colours and rendered Archivo/Hanken fonts have explicit browser guards.

Additional integrated repairs cover gallery namespace getters, Slot handler precedence, isolated registry dependency metadata, strict scheduler declarations, safe output paths, conflict undo history, natural stage/assignment names, named comboboxes, keyboard-scrollable tables, responsive tabs, narrow preview layouts and remaining contrast/landmark cases. Final screenshots and machine results are in `evidence-final/`; detailed commands and review records accompany the implementation report.

## Claude findings F1 to F19

| Finding | Status | Implementation | Regression evidence |
|---|---|---|---|
| F1 invisible hero title and asset names | I/V | `examples/flow-marketing/index.html`, explicit local ink on `.shot.lightui` | `tests/browser/marketing-data.test.mjs`; preserved slice 05a logs |
| F2 categorical fills and red crew avatar | I/V | Both marketing pages use theme-specific on-fill text and categorical avatar hues | `marketing-data.test.mjs`; `tests/unit/token-contrast.test.mjs` on-fill matrix |
| F3 contradictory precedence | I | `docs/AUTHORITY.md`, `authority.json`, `DESIGN.md` §0, root `README.md` and `index.html` | `tests/unit/authority.test.mjs` |
| F4 readable faint text across references | I/V | `contrast.json` restricts faint to decoration; registry, preview, gallery and static catalogue use muted for readable labels and placeholders | `token-contrast.test.mjs`, `readable-roles.test.mjs`; marketing and recovery browser axe checks |
| F5 checkbox, switch, tabs, close and small button targets | I/V | Registry `checkbox.tsx`, `switch.tsx`, `tabs.tsx`, `dialog.tsx`, `button.tsx`; dialog phone dismiss; static notice controls 44px | `tests/browser/registry-touch.test.mjs` probes actual hit areas, rather than assuming visual bounds |
| F6 white on red and red words | I/V | Separate action-red and red-text roles; core red stays locked; button and marketing fills updated | `token-contrast.test.mjs`, `registry-button.test.mjs`, `marketing-type-contrast.test.mjs` |
| F7 doodle overlap and clipped annotation | I/V | Marketing annotations outside data, hidden where there is no room | `marketing-data.test.mjs`, `marketing-layout.test.mjs` |
| F8 preview fonts and sentence case | I/V | Generated package `fonts.css` and local font copies, preview imports, sentence-case sections and headings | `theme-fonts.test.mjs`, `preview-v2-fonts.test.mjs`; preview build compiles |
| F9 form labels, linked errors, unnamed icons | I/V | Static catalogue, Input card, registry form example, preview icon names and search name | `public-contracts.test.mjs`, `preview-a11y.test.mjs`, `recovery-contracts.test.mjs` submission/focus checks |
| F10 module hue map | I/V | Marketing module patches match the documented map; fixed artwork untouched | `marketing-data.test.mjs` |
| F11 field boundaries | I/V | control-line/input role clears 3:1 across supported surfaces; static catalogue adopts it | `token-contrast.test.mjs`, browser contrast checks |
| F12 pulse and smooth scroll under reduced motion | I/V | Marketing blanket motion override; package disables transitions and animations; status pulse is motion-safe | `marketing-a11y.test.mjs`, `recovery-contracts.test.mjs` |
| F13 landmarks, skip links, headings, decoration | I/V | Marketing main/skip/headings/decorative hiding; preview h2 sections; static catalogue main | `marketing-a11y.test.mjs`, `preview-a11y.test.mjs`, browser axe |
| F14 missing phone navigation | I/V | Marketing drawer; preview native disclosure with named section navigation; gallery mobile menu retained | `marketing-a11y.test.mjs`, `preview-a11y.test.mjs`, browser phone navigation checks |
| F15 two-line phone CTA pills | I/V | Marketing CTAs stack below 480px | `marketing-layout.test.mjs` at 320/390/768/desktop |
| F16 clipped mini-UI rows | I/V | Marketing mini-UI sizing allows complete content | `marketing-layout.test.mjs` |
| F17 stale versions, fonts and overlapping catalogues | I/V | RVLT root reference, explicit authority roles, marketing relocation, legacy catalogue label, local fonts; current package/spec versions separated | `site.test.mjs`, `authority.test.mjs`, `theme-fonts.test.mjs`; local link checker |
| F18 Paper logo opacity | I/V | Paper marketing logo row uses readable opacity | `marketing-type-contrast.test.mjs` |
| F19 signature dashboard below first viewport | I/V | Tighter hero spacing, responsive composition and sticker placement | `marketing-layout.test.mjs`; rendered first-viewport geometry passes; hero screenshot visually inspected |

## Additional Claude prose findings and independent verification

The independent verification confirms F1, F2, F3, F5, F7 and F9 and narrows the target-size claim. Those are covered above. It does not replace fresh final-tree rendering.

| Source concern | Status | Resolution or remaining validation |
|---|---|---|
| §7.1 hierarchy, strong outer edges versus dense content | I/H | Scheduler uses quiet separators and one outer boundary; forms and recovery examples group one task. Perceived density needs crew review. |
| §7.2 four catalogues and unclear trust | I | Root is RVLT-wide, gallery is component reference, preview compiles registry examples, static catalogue visibly legacy, marketing is expressive only. `site.test.mjs` checks structure. |
| §7.3 eight centred phone lead lines | I/V | Responsive marketing layouts and 320px regression cover fit. Readability preference and text enlargement still need visual/human review. |
| §7.4 10px swatch captions and stale fonts | I/V | Preview swatch captions raised to the 11px floor, opacity removed from readable hints, local brand faces loaded. Font browser tests pass with local faces loaded. |
| §7.5 individual contrast pairs, composited soft fills and actual underlays | I/V | `packages/flow-theme/contrast.json` enumerates supported compositions. Unit calculations include alpha compositing on paper, paper-2, card and elev. Browser axe tests pass on the tested actual compositions. No accepted brand exceptions. |
| §7.6 pill list with rectangular tab triggers | I/V | `tabs.tsx` uses rounded-full triggers, 44px height. |
| §7.6 disabled semantics and loading names | I/V | Native disabled retained; asChild gets aria-disabled, tabindex and blocked activation; loading labels remain in the accessibility tree. `registry-button.test.mjs` tests Chromium AX nodes and activation. |
| §7.6 inconsistent focus | I/V | Marketing explicit brand outline, registry focus rings, static notice focus styles and keyboard card link. Browser focus/hit-area checks retained. |
| §7.7 h1 to h3 preview jump | I/V | Preview Section renders h2, Sub renders h3. `preview-a11y.test.mjs` and browser axe. |
| §7.8 footer, theme-toggle and catalogue touch targets | I/V | Marketing target rules, preview toggle 44px, static catalogue buttons at least 44px, gallery theme controls 44px, static notice actions 44px. Effective primitive hit areas are measured; exhaustive real-device target validation remains H. |
| §7.8 hidden overflow must not stand in for fit | I/V | Browser geometry checks at all requested widths; scheduler scroll region contains only the desktop track, phone agenda has full labels. Final rendered geometry checks pass. |
| §7.9 brand distinction and illustration placement | I/H | Locked assets, core red and font choices preserved; no artwork redrawn. Representative root, gallery, marketing and phone agenda screenshots were visually inspected. Live product adoption and crew judgement remain open. |
| §4 and §13 non-Chromium, screen reader, zoom, devices, forced colours, print and performance gaps | H | Chromium automation is now complete for the stated matrix. The remaining modes in this row are not claimed. See the human validation list below. |
| Recommendations: automated checks in CI | I/H | `.github/workflows/verify.yml` and `pages.yml` run unit/token checks, local gallery, typecheck, Next export, site/link checks and Chromium regressions before publication. Workflows have not been run remotely. |
| Build-script verification missing in original audit | I | Theme CSS, resolved registry, local gallery, preview typecheck/build and site build executed locally. Exact commands/results are in `../artifacts/IMPLEMENTATION-REPORT.md`. |
| External bundle generation | I/H | External generator limited by `write-policy.mjs`; local contracts cannot be overwritten. Published Flow cards overlay the local registry. Pinned Binder adapter regeneration/adoption requires external products and is intentionally not performed. |

## Codex priorities and subpoints

| Item | Status | Implementation and evidence |
|---|---|---|
| 1a faint on all four surfaces, placeholders, combobox, future stages, hour labels | I/V | Muted roles in registry and references; `readable-roles.test.mjs`, contrast matrix, browser axe. |
| 1b normal-size white button labels on red | I/V | action-red is separate from locked red; token matrix and button browser tests. |
| 1c necessary field boundary on card | I/V | input/control-line roles checked against every surface in both themes. |
| 1d warning/info soft-fill pills, blue status text | I/V | Supported pill foregrounds use warn/info roles; public StatusIndicator labels are muted. Legacy card APIs reconciled. Unit pair matrix and gallery browser checks. |
| 1e preserve hierarchy rather than making everything bright | I/H | Ink, ink-2 and muted remain separate. Perceived hierarchy in field conditions needs crew validation. |
| 2a Binder department words versus marks | I/V | CueTag words and numbers use page-ink, department hue stays on marks. `gallery.test.mjs`, token Binder pairs. |
| 2b shape/dash distinctions, zoom and monochrome | I/H | Go/standby/warn shapes and dash patterns preserved. Actual print, script zoom and calling validation remain open. |
| 3a checkbox/switch/close/stage effective hit area | I/V | 44px target implementations and browser hit testing, including pseudo-element hit layers. Independent review caveat honoured. |
| 3b short shift target and overlap | I/V | Short timeline bars are noninteractive marks. Phone agenda and full assignment list offer accurate independent targets, without enlarging overlapping bars. |
| 3c completed stages named | I/V | Stepper list name and stage/state name for each step; `registry-stepper.test.mjs`. |
| 4a for/id, required, error association, email type | I/V | Catalogue/Input card corrections and compiled `form-field.tsx`; validation preserves value, announces error, focuses invalid field. |
| 4b persistent search and notes labels | I/V | Input card labels; compiled SearchInput; preview named search example. |
| 4c SearchInput dimensions and phone two-column collapse | I/V | SearchInput shares 44px/16px Input; form uses one column then md two columns; Input README corrected. |
| 5a status props and domain mapping divergence | I | Chosen contract is distributed registry intents. Status README, card and Table use it; mapping is consumer-owned, no unsupported pill/category/value API claimed. `public-contracts.test.mjs`, compiled `statuses.tsx`. |
| 5b SearchInput missing export | I | Added typed forwarded SearchInput export, compiled form and public-contract guard. |
| 5c examples compile against distributed source | I | preview syncs registry and examples before every typecheck/build; successful typecheck/export recorded. External Binder examples remain explicitly pinned adapters, not public Flow API. |
| 6a phone alternative and day selection | I/V | CrewScheduler agenda below 768px, consumer day callback, full names/jobs/times; `scheduler-recovery.tsx` wires date and rows together. |
| 6b overlap covering another assignment | I/V | Deterministic lane packing and explicit Clash text, separate full assignment detail targets. `scheduler.test.mjs`. |
| 6c resolution and understandable effects | I/V | Dialog lists both calls, explains single-call reassignment, explicit confirm/cancel, truthful local status and no notification claim. Destination rejects unavailable/overlapping assignments. `recovery.test.mjs`, `preview-a11y.test.mjs`, browser recovery tests. |
| 6d long names, short/adjacent/overnight/unavailable | I/V | Long-name and 15-minute call fixtures, overnight 22 to 2, unavailable row; unit tests cover adjacent nonclashes and next-day formatting. |
| 6e generic Table mobile responsibility | I | Public docs specify scroll region or a consumer card list, with required columns retained. No automatic sticky/card behaviour is claimed. |
| 7a scan duplicate and return undo | I/V | `scan-return.tsx`, `recovery-state.mjs`, reducer tests and browser interactions. Unknown tag retains entry and offers retry. |
| 7b offline saved versus synced, reconnect and rejection | I/V | In-memory pending state labelled honestly, explicit retry, simulated acceptance/rejection and retained changes. No durable device-save claim. Reducer tests. |
| 7c partial return, damaged substitute, expired ticket/load block, reconnect conflict | I/V/H | `operational-recovery.tsx` and reducer demonstrate expected/returned/outstanding quantities, undo, original/replacement identity, explicit substitute confirmation, expired-ticket block and local/server draft choice. `operational-flows.test.mjs` passes. Real stock, ticket verification and persistent conflict handling require product integration and crew validation. |
| 7d timing, usability and field recovery | H | No task-time, usability, sunlight, glove or backend claim is made. |
| 7e Binder Calling, current/next cue, protected Go, keyboard, offline edits and page navigation | I/V/H | `binder-calling.tsx` and `calling-state.mjs` implement entry confirmation, cancel/confirm Go, native keyboard plus Alt+G, current/next labels, page controls, zoom, pending offline note and geometry-preserving display brightness experiment. Fixed tokens checked against canonical Binder tokens. Real PDF, calling, print and stage-manager validation remain open. |
| 8a one authority map and lower marketing precedence | I | `docs/AUTHORITY.md`, machine map, root and rule documents; authority tests. |
| 8b stale references where consumed | I | Legacy catalogue banner and redirects, local registry Flow cards, pinned Binder explanation. |
| 8c live/active/checked-out semantics | I | Connection live is green with a visible label; selection is a ring/edge, checked-out is a domain label. Status docs and overview distinguish them. |
| 8d repeated red row action density | I/H | New task compositions use one primary per decision; operational density judgement still needs crew review. |
| 9a loading accessible name and asChild semantics | I/V | Button correction with AX-name, busy, disabled, width and navigation regressions. |
| 9b semantic interactive Card | I/V | CardLink is a real stretched link with title name and focus ring; static cards inert. Gallery Card example updated. `registry-card.test.mjs`. |
| 9c Tab/Enter/Space/arrows/focus return | I/V/H | Native buttons/links and Radix retained; browser tests exercise button/card/dialog/tabs. Exhaustive assistive-tech and every overlay path remain human validation. |
| 10a hard outer boundaries versus quiet rows | I/H | Scheduler and recovery use quiet internal separators. Perceived density remains a human design judgement. |
| 10b three operational type roles, restrained Kalam/art | I | Body/display/mono retain operational roles; locked artwork untouched; local fonts and tests. |
| 10c 320px and text zoom | I/V/H | 320/390/768/desktop browser regressions exist. Text enlargement, virtual keyboard and real-device readability remain open. |
| 10d precise marketing statistics look measured | I/V | Illustrative labels linked to figures and visible notes; `marketing-type-contrast.test.mjs`. No fake testimonials or backend proof. |
| 11a animations, transitions and smooth scroll | I/V | Unified reduced-motion contract in generated CSS, marketing and static rules. |
| 11b motion preference changes and overlay dismissal | V | Browser motion-preference and keyboard-dismissal regressions pass in the final integrated run. |

## Human and downstream validation that remains open

- Actual Flow/Binder adoption, real persistence, scanner input, backend sync/conflicts, permissions and notifications.
- Partial return accounting, damaged substitute selection and expired-tag load blocking with product domain rules.
- Observed, timed crew tasks on the dock and stage managers at the prompt corner, including glare, gloves and recovery confidence.
- NVDA, JAWS, VoiceOver and TalkBack listening sessions; exhaustive keyboard and overlay coverage.
- iOS/Android devices, Safari/WebKit and Firefox, virtual keyboard, landscape, safe areas and zoom-on-focus.
- 200%/400% reflow, text-spacing override, forced colours, colour-vision simulation and low-end device performance.
- Binder monochrome print, actual script size/zoom, prompt-corner brightness, live calling and sync behaviour.
- Remote GitHub Actions execution and live Pages deployment were intentionally not triggered. Local equivalents passed. Browser automation is not a screen-reader or crew-usability sign-off.
