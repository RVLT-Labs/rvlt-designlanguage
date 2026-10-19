# Collection update · 25 September 2026

Package 1.1.0 adds **Beltpack transmitter** (`beltpack`). The current collection contains 26 designs and 52 SVG exports: 19 illustrations and 7 wordmarks. The previous 50 SVG files are unchanged. The original nine-page Word guide remains the record of the earlier collection; this note extends it.

## Design and colour

The small rectangular body, gently curved antenna, top input socket, screen, battery-door seam and slim side clip provide the identifying cues. The drawing omits tiny controls, screws, product names and radio-wave decoration. The open battery compartment area keeps it distinct from the walkie-talkie's speaker marks. Its proportions are balanced alongside the existing illustrations rather than expanded to fill the sticker.

The circular blue backing (`#5B8DEF`) introduces a different silhouette and colour from the green walkie-talkie. It uses the collection's cream (`#FFFDF8`), 3.4-unit rounded strokes, 3-unit sticker edge and hard shadow (`#0C0A08`, offset 2,4). Blue is a decorative choice, not a wireless connection or app status colour.

The geometry is original. [Shure's bodypack product reference](https://www.shure.com/en-US/products/wireless-systems/slx_d_digital_wireless/slxd1) informed the equipment's identifying features; no product photo, branded label or manufacturer's line drawing is included in the asset.

## Files and placement

| Variant | Master file | Canvas | Suggested starting width |
| --- | --- | --- | --- |
| Sticker | `assets/svg/beltpack-sticker.svg` | `0 0 128 128` | 128–160 px |
| Transparent drawing | `assets/svg/beltpack-line.svg` | `0 0 128 128` | 96 px on a dark surface |

Use it for wireless-microphone preparation, audio equipment introductions and performance stories. Keep it outside dense equipment tables and retain the app's normal functional icons. The sticker includes its blue backing, cream edge and shadow. The line version contains cream artwork on transparency.

The suggested gallery tilt is −4 degrees, applied to the whole image by the page; it is not baked into the SVG. Preserve the viewBox and let height follow width. Use an empty alt attribute when decorative, or `Beltpack transmitter` when the image itself conveys necessary information.

The manifest, catalogue, React registry and offline visual index all include the new `beltpack` ID. After copying `assets/` to the app's `public/rvlt-art/`, the default URL is `/rvlt-art/svg/beltpack-sticker.svg`.

```tsx
<RvltArt id="beltpack" width={144} tilt />
<RvltArt id="beltpack" variant="line" width={96} />
```
