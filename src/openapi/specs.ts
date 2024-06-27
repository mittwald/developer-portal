import { OpenAPIV3 } from "openapi-types";
import specv1 from "./openapi-v1.json";
import specv2 from "./openapi-v2.json";

export type APIVersion = `v${number}`;

export type OperationWithMeta = {
  path: string;
  method: string;
  operation: OpenAPIV3.OperationObject;
};

export const specs: Record<APIVersion, OpenAPIV3.Document> = {
  v1: specv1 as OpenAPIV3.Document,
  v2: specv2 as OpenAPIV3.Document,
};

export function useSpec(version: APIVersion) {
  return specs[version];
}

export function getOperationById(
  spec: OpenAPIV3.Document,
  operationId: string,
): OperationWithMeta | undefined {
  for (const path of Object.keys(spec.paths)) {
    for (const method of Object.keys(spec.paths[path])) {
      const operation = spec.paths[path][method];

      if (operation.operationId === operationId) {
        return { path, method, operation };
      }
    }
  }

  return undefined;
}

export function getOperationByTag(
  spec: OpenAPIV3.Document,
  tag: string,
): OperationWithMeta[] {
  const operations = Object.entries(spec.paths).flatMap(([path, methods]) =>
    Object.entries(methods).map(([method, operation]) => ({
      path,
      method,
      operation,
    })),
  );

  return operations.filter(({ operation }) => operation.tags?.includes(tag));
}
