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

export async function loadSpec(
  apiVersion: APIVersion,
): Promise<OpenAPIV3.Document> {
  const spec = await fetch(
    `https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`,
  );
  return await spec.json();
}

export async function applyOverlayToSpec(
  spec: OpenAPIV3.Document,
  apiVersion: APIVersion,
  overlaySuffix?: string,
): Promise<OpenAPIV3.Document> {
  const overlayPath = path.join(
    "generator",
    "overlays",
    apiVersion,
    overlaySuffix ? `overlay-${overlaySuffix}.yaml` : "overlay.yaml",
  );
  try {
    const overlayYaml = await readFile(overlayPath, { encoding: "utf-8" });
    const overlay = yaml.parse(overlayYaml, { merge: true });

    return applyOverlay(spec, overlay as unknown as OverlaySpec);
  } catch (err) {
    if (err.code === "ENOENT") {
      return spec;
    }
    throw err;
  }
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
