import { APIVersion } from "@site/src/openapi/specs";
import buildDocumentId from "@site/src/openapi/buildDocumentId";
import { OpenAPIV3 } from "openapi-types";

/** The URL of an operation's reference page */
export const buildOperationUrl = (
  apiVersion: APIVersion,
  operation: OpenAPIV3.OperationObject,
) => {
  const docId = buildDocumentId(operation);
  return apiVersion.endsWith("-preview")
    ? `/docs/${apiVersion.replace("-preview", "")}/preview/${docId.replace("reference/", "")}`
    : `/docs/${apiVersion}/reference/${docId.replace("reference/", "")}`;
};
