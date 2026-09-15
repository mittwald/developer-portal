import { OpenAPIV3 } from "openapi-types";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { APIVersion } from "@site/src/openapi/specs";
import { readFile } from "fs/promises";
import * as path from "path";
import * as yaml from "yaml";
import { applyOverlay, OverlaySpec } from "@site/generator/util/overlay";

export type SpecLoader = (
  apiVersion: APIVersion,
) => Promise<OpenAPIV3.Document>;

/** Name of the overlay holding the AI-generated summaries and descriptions */
export const AI_OVERLAY_NAME = "overlay-ai";

const specCache = new Map<APIVersion, Promise<OpenAPIV3.Document>>();

export async function loadSpec(
  apiVersion: APIVersion,
): Promise<OpenAPIV3.Document> {
  // Cached, because a single generator run loads the same spec multiple times
  let spec = specCache.get(apiVersion);
  if (!spec) {
    spec = fetch(
      `https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`,
    ).then((response) => response.json());
    specCache.set(apiVersion, spec);
  }
  return await spec;
}

export function overlayPath(
  apiVersion: APIVersion,
  overlayName: string,
): string {
  return path.join("generator", "overlays", apiVersion, `${overlayName}.yaml`);
}

export async function loadOverlay(
  apiVersion: APIVersion,
  overlayName: string,
): Promise<OverlaySpec | undefined> {
  try {
    const overlayYaml = await readFile(overlayPath(apiVersion, overlayName), {
      encoding: "utf-8",
    });
    return yaml.parse(overlayYaml, { merge: true }) as unknown as OverlaySpec;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw err;
  }
}

/**
 * Applies a list of overlays to a spec, in order; later overlays take
 * precedence over earlier ones. Overlays that do not exist are skipped.
 */
export async function applyOverlaysToSpec(
  spec: OpenAPIV3.Document,
  apiVersion: APIVersion,
  overlayNames: string[],
): Promise<OpenAPIV3.Document> {
  let overlayedSpec = spec;

  for (const overlayName of overlayNames) {
    const overlay = await loadOverlay(apiVersion, overlayName);
    if (!overlay) {
      continue;
    }

    overlayedSpec = applyOverlay(overlayedSpec, overlay, {
      // Generated overlays may lag behind the spec; do not fail the build for
      // operations that have been removed in the meantime.
      ignoreMissingTargets: overlayName === AI_OVERLAY_NAME,
    });
  }

  return overlayedSpec;
}

export async function loadSpecPreview(
  apiVersion: APIVersion,
): Promise<OpenAPIV3.Document> {
  const content = await readFile(
    path.join("static", "specs", `openapi-${apiVersion}-dev.json`),
    { encoding: "utf-8" },
  );
  return JSON.parse(content);
}

export async function dereferenceSpec(
  spec: OpenAPIV3.Document,
): Promise<OpenAPIV3.Document> {
  return await $RefParser.dereference(spec, {
    dereference: {
      circular: "ignore",
    },
  });
}

export function versionedOutputPath(
  latestVersion: APIVersion,
): (apiVersion: APIVersion, outputPathInDocs: string) => string {
  return (apiVersion: APIVersion, outputPathInDocs: string) => {
    return apiVersion === latestVersion
      ? path.join("docs", outputPathInDocs)
      : path.join("versioned_docs", "version-v1", outputPathInDocs);
  };
}
