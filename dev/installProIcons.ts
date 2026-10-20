import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { proIconsDir, readProIconsVersion } from "./proIcons";

/*
 * Fetches the FontAwesome Pro icons that `@mittwald/flow-icons-pro` renders
 * with, like the Flow docs do. `package.json` aliases
 * `@fortawesome/sharp-regular-svg-icons` to a free set, so `npm install` needs
 * no license. This installs the real package beside it, outside the lockfile;
 * `docusaurus.config.ts` bundles it once it is there.
 *
 * - With `FONT_AWESOME_PACKAGE_TOKEN` (CI): FontAwesome's registry.
 * - Without it: npm.mittwald.it, which is reachable from mittwald's network
 *   only, so CI never tries it.
 *
 * Without either, the portal keeps Flow's default icons, unless
 * `REQUIRE_PRO_ICONS=1`.
 */

// The range `@mittwald/flow-icons-pro` accepts
const iconsPro = JSON.parse(
  readFileSync(
    path.resolve(
      __dirname,
      "../node_modules/@mittwald/flow-icons-pro/package.json",
    ),
    "utf8",
  ),
) as { peerDependencies: Record<string, string> };
const range = iconsPro.peerDependencies["@fortawesome/sharp-regular-svg-icons"];
const required = process.env.REQUIRE_PRO_ICONS === "1";
const token = process.env.FONT_AWESOME_PACKAGE_TOKEN;

function skip(reason: string): never {
  if (required) {
    console.error(`FontAwesome Pro icons required, but ${reason}`);
    process.exit(1);
  }
  console.warn(`${reason} — the portal shows Flow's default icons`);
  process.exit(0);
}

if (readProIconsVersion()) {
  console.log(`FontAwesome Pro ${readProIconsVersion()} already installed`);
  process.exit(0);
}
if (!token && process.env.CI) {
  skip("FONT_AWESOME_PACKAGE_TOKEN is not set");
}

const registry = token
  ? [
      "@fortawesome:registry=https://npm.fontawesome.com/",
      // npm expands the variable itself, so the token never lands on disk
      "//npm.fontawesome.com/:_authToken=${FONT_AWESOME_PACKAGE_TOKEN}",
    ]
  : ["@fortawesome:registry=https://npm.mittwald.it/"];

rmSync(proIconsDir, { recursive: true, force: true });
mkdirSync(proIconsDir, { recursive: true });
writeFileSync(
  path.join(proIconsDir, "package.json"),
  JSON.stringify({ private: true }),
);
writeFileSync(path.join(proIconsDir, ".npmrc"), [...registry, ""].join("\n"));

try {
  execFileSync(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      "--fetch-retries=0",
      `@fortawesome/sharp-regular-svg-icons@${range}`,
    ],
    { cwd: proIconsDir, stdio: "inherit" },
  );
} catch {
  rmSync(proIconsDir, { recursive: true, force: true });
  skip("installing them failed");
}
console.log(`Installed FontAwesome Pro ${readProIconsVersion()}`);
