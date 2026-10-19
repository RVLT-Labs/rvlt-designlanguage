# RVLT Flow stickers and wordmarks

Implementation pack · 25 September 2026 · package version 1.1.0

**26 designs, 52 editable SVGs.** The complete current set from the sticker and wordmark gallery: 19 illustrations, each as a sticker and a transparent line drawing; 7 wordmarks, each as a shaped patch and transparent lettering.

## Start here

1. Read [AGENTS.md](AGENTS.md), then [the implementation guide](docs/IMPLEMENTATION.md).
2. Open [preview/index.html](preview/index.html) in a browser to see every export offline. No installation or network connection is required.
3. Select designs by their stable IDs in [manifest.json](manifest.json) or the [asset catalogue](docs/ASSET-CATALOG.md).
4. Copy the contents of `assets/` into the app's `public/rvlt-art/` directory. The public URL for the mug sticker is then `/rvlt-art/svg/coffee-mug-sticker.svg`.
5. Use a normal image element, or adapt the small [React component](examples/react/RvltArt.tsx). Review it in the actual screen at desktop and phone sizes.

## What is included

| Path | Purpose |
| --- | --- |
| `assets/svg/` | All 52 current SVG exports, with original filenames and metadata |
| `assets/licenses/` | Phosphor MIT and Archivo and Baloo 2 font licence notices |
| `manifest.json` | Design IDs, variants, paths, exact viewBoxes, aspect ratios, colour values, placement hints and SHA-256 hashes |
| `palette.json` | Artwork palette, separate from app status colours |
| `docs/STYLE-GUIDE.md` | The illustrated design guide in Markdown, readable by agents |
| `docs/COLLECTION-UPDATES.md` | Beltpack design rationale, files, sizing and package changes |
| `docs/RVLT-Flow-Artwork-Design-Guide.docx` | The original illustrated nine-page Word guide, preserved unchanged |
| `docs/IMPLEMENTATION.md` | Asset selection, installation, sizing, colour, accessibility and integration checks |
| `docs/ASSET-CATALOG.md` | All 26 designs with variants, use suggestions and sizing |
| `docs/PRINT-AND-EXPORT.md` | How to prepare physical stickers and raster derivatives |
| `docs/CREDITS.md` | Sources and licence mapping |
| `examples/react/` | Optional typed image wrapper, generated file registry and usage examples |
| `preview/index.html` | Offline visual index with all 52 variants |
| `preview/contact-sheet.png` | At-a-glance overview of the 26 sticker and patch designs |
| `tools/validate_pack.py` | Standard-library Python validator for files, hashes, SVG structure and references |
| `CHECKSUMS.sha256` | Integrity list for every other file in the pack |

## Handoff prompt for another agent

> Integrate the supplied RVLT Flow artwork pack into the app. First read README.md, AGENTS.md and docs/IMPLEMENTATION.md, then inspect manifest.json and preview/index.html. Reuse the supplied SVGs and choose a small, context-appropriate selection. Preserve their proportions, viewBoxes, colours, stroke weights and lettering. Keep decorative art away from operational data and controls. Use local app asset paths, follow the app's existing conventions, and verify the result at desktop and phone widths. Do not redraw the art or convert it to generic icons.

## Scope and provenance

This pack covers the stickers and wordmarks from this design project. Albert has a separate static character pack and is not included here. No retired XLR cable, par can, earlier coffee mug, experimental character rig, animation or historical duplicate is included.

The source assets were copied from the current gallery repository. Package 1.1.0 adds the beltpack transmitter; all 50 earlier SVG exports retain their original bytes. The preserved Word and Markdown design guide describes gallery revision 9, before the beltpack addition. Read [the collection update](docs/COLLECTION-UPDATES.md) for the beltpack; use the current manifest and visual index for the complete inventory. The exact repository commit and per-file hashes are recorded in `manifest.json`. The offline preview and local files are sufficient for implementation; the private hosted gallery is an optional reference, not an asset CDN.

Run `python3 tools/validate_pack.py` from this folder to validate the handoff. Keep this pack as the master copy and make any intentionally revised artwork in a separately named version.
