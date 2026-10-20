# PersonAvatar

A crew member's initials on a hue picked deterministically from their name — never hand-picked, never red.

36px circle with a 2px `card` ring (so stacks overlap cleanly), initials 12px bold. Hue = a stable hash of the name over blue, amber, green, purple, coral, teal, pink, lime, so a person keeps one colour everywhere. Initials: `dark` in the dark theme; white in light, except amber and lime (`dark`). A photo replaces the initials when supplied.

Binder assigns the same hues as person colours from a stable hash of the user id; presence on the page is that colour as a 2px outline, never a department's colour.

## Consumer provides
`name`, optional `src`.

_Published Flow preview: local registry source, compiled by `scripts/design-system/bundle/build-registry.mjs`. The pinned external bundle is retained for Binder adapters._
