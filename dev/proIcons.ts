import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/*
 * Where `installProIcons.ts` puts FontAwesome Pro. Shared with
 * `docusaurus.config.ts`, which bundles the package when it is there.
 */
export const proIconsDir = path.resolve(__dirname, "../.pro-icons");

export const proIconsPackage = path.join(
  proIconsDir,
  "node_modules/@fortawesome/sharp-regular-svg-icons",
);

export function readProIconsVersion(): string | undefined {
  const manifest = path.join(proIconsPackage, "package.json");
  return existsSync(manifest)
    ? JSON.parse(readFileSync(manifest, "utf8")).version
    : undefined;
}
