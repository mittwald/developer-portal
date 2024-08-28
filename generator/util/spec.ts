import { OpenAPIV3 } from "openapi-types";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { APIVersion } from "@site/src/openapi/specs";

export async function loadSpec(apiVersion: APIVersion): Promise<OpenAPIV3.Document> {
  const spec = await fetch(`https://api.mittwald.de/${apiVersion}/openapi.json?withRedirects=false`);
  return await spec.json();
}

export async function dereferenceSpec(spec: OpenAPIV3.Document): Promise<OpenAPIV3.Document> {
  return await $RefParser.dereference(spec, {
    dereference: {
      circular: "ignore"
    }
  });
}