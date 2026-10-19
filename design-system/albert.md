# Albert

**Albert is RVLT's character.** He is a compact, solid bearded dragon with:
- a broad, low head
- a cream beard and belly
- short splayed limbs and a substantial tail
- coral cheek markings
- rounded eyes and a restrained, uneven smile

He was approved on 2026-09-17 (revision 4). Three identity illustrations are locked: *sitting*, *on the roadcase* and *resting*. Every other pose and the 22 workday pieces are companion art built from them.

Albert appears in every RVLT product and on the site. Flow's stage-light mascot stays as Flow's in-app empty-state mark. Binder has no mascot of its own and uses Albert where it wants a character.

## Picking an asset

| Need | Use |
|---|---|
| Chat button, tiny avatar, inline mark (24–48px) | `albert-icon` on light grounds, `albert-icon-cream` on dark |
| A head with room (64px or larger) | `albert-avatar` |
| An assistant state | the matching `albert-expression-*`, with the state also in live text |
| A sticker or badge (96px or larger) | `albert-sticker-amber` or `albert-sticker-red` |
| Welcome, header, large empty state | a locked illustration (`sitting`, `on-the-case`, `rest`) |
| A topic or screen | the workday illustration mapped to it (see `assets/Albert-illustrations`) |
| A monochrome mark on a light ground | `albert-head-line-espresso`, the only line drawing |

These are the expression mappings for an assistant:

| State | Expression |
|---|---|
| ready | avatar |
| listening | `listening` |
| processing | `thinking` |
| needs clarification | `puzzled` |
| success | `content` or `happy` |
| recovering from an error | `reassuring` |

Use `catch`, `blep` and `wink` rarely. Loading, success and errors are always written in real UI text too, never shown by his face alone.

## Rules

- **Always filled in.** Never uncoloured full-body line art, translucent silhouettes, or shiny, over-detailed surface marks.
- **Always lizard-like.** He stays a lizard even in a suit, high-vis or a hard hat. Never a thin or humanoid redraw. Keep his head and beard visible.
- **Every illustration is complete.** Never detach props, stack PNGs or treat the files as a puppet. Never recolour pixels to a flat swatch.
- **Leave room** around his beard, paws, props and tail. Crop only for a deliberate peeking composition. Never put a full-body illustration inside a 24–48px control.
- **Not in serious moments.** Keep him out of alerts, overdue and compliance failures, conflicts and destructive confirmations. Never a novelty cursor, never an insect.
- **Accessibility.** Write meaningful alt text when he carries context ("Albert checks the run-sheet"). Use `alt=""` when he is decorative.

His palette is amber `#EBA53A`, cream `#FFFDF8`, espresso `#141210`, coral `#EF7E55` and RVLT red `#E0363D`, all already in this system's tokens.
