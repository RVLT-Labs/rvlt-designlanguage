// Maps each asset in design-system/design-system.json (uploaded to the claude.ai design system's
// asset store, addressed there as /_blob/<id>) to the one repo file that holds it.
import { existsSync, statSync } from "node:fs";
import path from "node:path";

// Where each asset group's files live in this repo.
export const GROUP_DIRS = {
  Logos: "design-system/assets/Logos",
  Icons: "design-system/assets/Icons",
  Stickers: "assets/stickers/svg",
  Patches: "assets/stickers/svg",
  Linework: "assets/stickers/svg",
  Lettering: "assets/stickers/svg",
  Albert: "assets/albert/svg",
  "Albert-illustrations": "assets/albert/illustrations",
};

/** @returns {{ byBlob: Map<string, {group: string, name: string, file: string}>, missing: string[] }} */
export function resolveAssets(repo, index) {
  const byBlob = new Map();
  const missing = [];
  for (const [group, { files }] of Object.entries(index.assetGroups)) {
    const dir = GROUP_DIRS[group];
    if (!dir) {
      missing.push(`asset group ${group} has no repo folder in GROUP_DIRS`);
      continue;
    }
    for (const [name, rec] of Object.entries(files)) {
      const file = path.join(dir, name);
      const abs = path.join(repo, file);
      if (!existsSync(abs)) missing.push(`asset ${group}/${name} is not at ${file}`);
      // The asset store re-serialises SVGs on upload, so only raster sizes are comparable.
      else if (rec.type !== "image/svg+xml" && statSync(abs).size !== rec.size) {
        missing.push(`asset ${file} is ${statSync(abs).size} bytes, the design system has ${rec.size}`);
      } else byBlob.set(rec.blob, { group, name, file });
    }
  }
  return { byBlob, missing };
}
