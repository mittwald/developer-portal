import { OpenAPIV3 } from "openapi-types";
import specv1 from "./openapi-v1.json";
import specv2 from "./openapi-v2.json";

export type APIVersion = `v${number}`;

export const specs: Record<APIVersion, OpenAPIV3.Document> = {
  v1: specv1 as OpenAPIV3.Document,
  v2: specv2 as OpenAPIV3.Document,
};
