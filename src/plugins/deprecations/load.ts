import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import * as z from "zod";
import { type DeprecationInput, deprecationSchema } from "./schema";
import type { DeprecationStatus } from "./types";

export interface DeprecationSource {
  slug: string;
  /** Path of the YAML file, relative to the current directory */
  file: string;
  input: DeprecationInput;
  status: DeprecationStatus;
}

/**
 * Reads and validates `<contentPath>/<slug>.yaml`; drafts are skipped in
 * production builds. Synchronous, so that `sidebars.js` can use it as well.
 * Sorted: active deprecations by sunset date (unscheduled ones last), then
 * past ones, most recent sunset first.
 */
export function readDeprecations(contentPath: string): DeprecationSource[] {
  const includeDrafts = process.env.NODE_ENV !== "production";
  const today = new Date().toISOString().slice(0, 10);

  return fs
    .readdirSync(contentPath)
    .filter((file) => /\.ya?ml$/.test(file))
    .map((file): DeprecationSource => {
      const source = path.join(contentPath, file);
      const parsed = deprecationSchema.safeParse(
        parseYaml(fs.readFileSync(source, "utf-8")),
      );
      if (!parsed.success) {
        throw new Error(
          `Invalid deprecation ${path.relative(".", source)}:\n${z.prettifyError(parsed.error)}`,
        );
      }

      const { sunset } = parsed.data;
      return {
        slug: path.parse(file).name,
        file: path.relative(".", source),
        input: parsed.data,
        status: sunset && sunset < today ? "past" : "active",
      };
    })
    .filter((d) => includeDrafts || !d.input.draft)
    .sort(compareDeprecations);
}

function compareDeprecations(
  a: DeprecationSource,
  b: DeprecationSource,
): number {
  if (a.status !== b.status) {
    return a.status === "active" ? -1 : 1;
  }
  if (a.status === "active") {
    return (a.input.sunset ?? "9999").localeCompare(b.input.sunset ?? "9999");
  }
  return (b.input.sunset ?? "").localeCompare(a.input.sunset ?? "");
}
