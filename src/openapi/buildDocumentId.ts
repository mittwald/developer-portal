import { APIVersion } from "@site/src/openapi/specs";
import { OpenAPIV3 } from "openapi-types";

function slugFromTagName(tagName: string): string {
  return tagName
    .replace(/ /g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/, "");
}

export default function buildDocumentId(op: OpenAPIV3.OperationObject): string {
  const firstTag = op.tags?.[0];
  return `reference/${slugFromTagName(firstTag || "untagged")}/${op.operationId}`;
}
