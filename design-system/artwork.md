# Stickers and wordmarks

The artwork brings the live-production world into the brand: cases, tools, show cues and the everyday objects a crew recognises. It is simple, bright and a little playful, with enough restraint to sit beside a working app.

The collection has **26 designs in 52 SVGs**:
- 19 illustrations, each as a **sticker** (`assets/Stickers`) and a transparent **line** drawing (`assets/Linework`)
- 7 phrases, each as a shaped **patch** (`assets/Patches`) and transparent **lettering** (`assets/Lettering`)

## Pick the subject for the content

Match the art to the topic around it:

| Topic | Use |
|---|---|
| Logistics and warehouse | road case, van, gaff tape |
| Preparation | clipboard, batteries, wrench |
| Show equipment | microphone, speaker, monitor, moving head, mixing console, beltpack |
| Crew | AAA pass, walkie-talkie, coffee mug |
| The show itself | curtains, ticket stub |
| Pure warmth | pelican |

Someone who knows production should name the object without its label. The colours describe the collection, not a status system. A green sticker is not "available", and no sticker is a module colour.

## How the drawings are built

| Element | Value |
|---|---|
| Canvas | 128 × 128 units |
| Backing | circle (centre 64,64, radius 57) or a 114 × 114 rounded square at 7,7 with radius 23 |
| Illustration stroke | about 3.4 units, round caps and joins, `patch-border` cream `#FFFDF8` |
| Sticker edge | 3 units of cream |
| Depth | a solid shadow `#0C0A08` offset 2 right and 4 down, already in the file |
| Word patches | individual silhouettes, a 4-unit cream edge, tightly cropped viewBoxes |

Each subject is balanced by eye, taking roughly 55–70% of the sticker. A narrow walkie-talkie, an open tape roll and a diagonal microphone should feel equally present. The curtains deliberately frame the whole interior.

## The patch family

| Patch | Colour | Character |
|---|---|---|
| Standby | `amber` | A waving ribbon with a pause mark |
| Go! | `green` | A rounded burst with Archivo lettering |
| Crew | `purple` | A bowed badge, arched Baloo 2, stitched border |
| Load in | `blue` | A luggage tag with a punched hole |
| On air | `red` | A speech patch |
| Show time | cream oval with a coral edge | Taller than the others |
| RVLT Flow | espresso | Leaning red Archivo over rounded cream Flow |

The lettering is outlined paths, so no fonts are needed. Keep the supplied spacing and line breaks.

Standby, Go! and On air are **decorative phrases**. Real loading, actions and live status always come from the app's own components and words.

The RVLT Flow patch is an expressive lockup. Use the master marks in `assets/Logos` wherever formal identification is needed.

## Placing it

- **Marketing:** one main sticker plus one or two smaller companions, placed around a heading, hero or final CTA. A cluster needs a focal point. The same sticker at equal sizes in every section reads as wallpaper.
- **Apps:** a single illustration in a welcome, onboarding, empty or positive-completion state. Never put art in tables, controls, alerts, compliance messages, errors or destructive confirmations.
- **Size:**
  - stickers 96–240px on screen (160px default)
  - patches 160–320px, each sized by eye, because the viewBoxes differ
  - below 64px, use a Lucide UI icon instead
- **Clear space:** about 10% of the art's shorter side between it and text or controls.
- **Tilt, by context** (decision 2026-10-19): 2–5° in apps (the gallery's per-design tilt, applied once to the whole image); up to ±11° in marketing hero clusters. Keep the curtains upright. Never mirror words or recognisable gear, and never animate continuously.
- **Phones:** use fewer and smaller pieces. Hide extra decoration rather than overlap text.

## Using the files

| File | Contents | Use |
|---|---|---|
| `*-sticker.svg` | Illustration, colour backing, cream edge, hard shadow | A ready-made sticker on any ground |
| `*-line.svg` | Cream drawing on transparency | Quieter decoration on espresso or another dark surface only |
| `*-patch.svg` | Lettering with its shaped backing, border, shadow | Crew language, expressive brand moments |
| `*-wordmark.svg` | Outlined lettering on transparency (cream; RVLT Flow keeps red and cream) | A word accent on a dark surface |

How to place them:
- Use a plain `<img>`. Set the width and let the height follow.
- Never stretch, use `object-fit: cover`, add a CSS shadow or border, tint with filters, or clip the shadow.
- Parent CSS `color` doesn't recolour an external SVG.
- On light grounds, use the full sticker or patch. Cream line art disappears there.
- Decorative art gets `alt=""` and must never take pointer input or hide a focus ring. Art that carries meaning needs a real text alternative.
- If an SVG is inlined, keep the stage curtains' `curtain-interior` clip ID unique per copy.

## Print

The SVGs are artwork masters with no cut paths or bleed.
- Proof physical stickers at about 50–75mm wide.
- The cream border is the printed margin.
- Agree the cut contour, bleed, white ink (for clear vinyl) and colour profile with the printer, and decide together whether to keep the shadow.
- Embroidered patches need the maker to simplify the stitches and a physical sample, especially for Crew, Standby and Show time.

## Making new artwork

1. Pick a subject from the crew's world. Write down the two or three features that make it recognisable, and check the real object.
2. Draw the silhouette first. Add only the details that resolve ambiguity. Match the 3.4-unit stroke, round corners and density.
3. Choose a backing shape and a ramp colour. Balance it by eye beside a narrow, a wide and a diagonal neighbour.
4. Review it at the intended size and smaller. Remove tangents, tiny gaps, accidental symbols and decorative bolts, rays or faux wear.
5. Export both versions. Keep source credits.

Never redraw, trace, re-letter or recolour the supplied masters. Make any revision as a separately named version.

## Credits

Ten illustrations adapt Phosphor Icons (MIT): road case, microphone, monitor, van, wrench, calendar, AAA pass, clipboard, speaker and ticket stub. The lettering is outlined Archivo and Baloo 2 (SIL OFL). The licence notices are in `assets/Stickers/licenses/` and must ship with any distributed copy. The custom drawings and patch layouts are RVLT's own.
