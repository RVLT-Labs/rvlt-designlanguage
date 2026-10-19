# Icons

These are Lucide 1.44 glyphs, copied exactly from `lucide-react`'s icon data: a 24px grid, 2px stroke, round caps and joins.

The files use a single neutral ink, `#7D7565`, because an `<img>` can't inherit `currentColor`. It reads at about 4:1 on both Paper and Espresso, above the 3:1 that graphics need. It isn't a theme token: Paper's `muted` is now `#665E4F` after the 2026-10-19 retone. The Lucide licence is in `licenses/`. In the app the same icons render in `currentColor`, so recolour them with CSS.

Sidebar module icons:

| Module | Icon |
|---|---|
| Dashboard | `layout-dashboard` |
| Projects | `folder-open` |
| Finance | `landmark` |
| Schedule | `calendar-range` |
| Crew | `hard-hat` |
| Assets | `package` |
| Warehouse | `warehouse` |
| Test & Tag | `shield-check` |
| Maintenance | `wrench` |
| Clients | `users` |
| Suppliers | `truck` |

Common glyphs: `search` (list toolbars), `triangle-alert` (overbookings and notices), `check` (checkbox, stepper).

Any other Lucide icon is fair game. Don't mix in another icon set or emoji.
