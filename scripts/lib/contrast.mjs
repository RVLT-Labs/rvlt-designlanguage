// WCAG 2.x contrast maths shared by the token guards, the landing page generator and the
// browser checks. Colours are "#rgb", "#rrggbb" or "rgba(r,g,b,a)". Translucent colours are
// composited source-over onto their backdrop in sRGB before luminance, with no rounding.

/** @returns {{r:number,g:number,b:number,a:number}} channels 0..255, alpha 0..1 */
export function parseColour(input) {
  const s = String(input).trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3})$/);
  if (m) {
    const [r, g, b] = m[1].split("").map((c) => parseInt(c + c, 16));
    return { r, g, b, a: 1 };
  }
  m = s.match(/^#([0-9a-f]{6})$/);
  if (m) {
    const n = parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  throw new Error(`unsupported colour: ${input}`);
}

/** Source-over composite of `top` onto an opaque `bottom`. */
export function composite(top, bottom) {
  const t = typeof top === "string" ? parseColour(top) : top;
  const b = typeof bottom === "string" ? parseColour(bottom) : bottom;
  if (b.a !== 1) throw new Error("backdrop must be opaque");
  const mix = (x, y) => t.a * x + (1 - t.a) * y;
  return { r: mix(t.r, b.r), g: mix(t.g, b.g), b: mix(t.b, b.b), a: 1 };
}

export function luminance(colour) {
  const c = typeof colour === "string" ? parseColour(colour) : colour;
  const lin = (v) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
}

/**
 * Contrast of `fg` over `bg`. Layers are composited bottom-up: `bg` may be translucent if an
 * opaque `under` surface is given (for example a soft status fill over a card).
 */
export function contrast(fg, bg, under) {
  let back = typeof bg === "string" ? parseColour(bg) : bg;
  if (back.a !== 1) {
    if (!under) throw new Error(`translucent backdrop ${bg} needs an opaque surface under it`);
    back = composite(back, under);
  }
  const front = composite(fg, back);
  const [l1, l2] = [luminance(front), luminance(back)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

export const round2 = (n) => Math.floor(n * 100) / 100;
