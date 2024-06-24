import { OpenAPIV3 } from "openapi-types";

export default function isDeprecated(spec: OpenAPIV3.OperationObject): boolean {
  return (
    spec.deprecated ||
    spec.operationId.startsWith("deprecated-") ||
    spec.operationId.endsWith("-deprecated")
  );
}
