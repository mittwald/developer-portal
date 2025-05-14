import { OpenAPIV3 } from "openapi-types";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";

function generateCurlCodeExample(
  method: string,
  url: string,
  spec: OpenAPIV3.OperationObject,
  baseURL: string,
) {
  const parameters = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
  const pathParams = parameters.filter((p) => p.in === "path") ?? [];
  const queryParams = parameters.filter((p) => p.in === "query") ?? [];
  const headers = parameters.filter((p) => p.in === "headers") ?? [];

  const headerArgs = headers.map(
    (header) =>
      `-H "${header.name}: ${generateSchemaExample((header.schema ?? { type: "string" }) as OpenAPIV3.NonArraySchemaObject)}"`,
  );

  headerArgs.push(`-H "Authorization: Bearer $MITTWALD_API_TOKEN"`);

  const queryParamsSet = new URLSearchParams();
  for (const queryParam of queryParams) {
    let example = generateSchemaExample(
      queryParam.schema as OpenAPIV3.SchemaObject,
    );

    if (queryParam.name === "skip") {
      continue;
    } else if (queryParam.name === "limit") {
      example = "50";
    } else if (queryParam.name === "page") {
      example = "1";
    }

    queryParamsSet.set(queryParam.name, example);
  }

  for (const pathParam of pathParams) {
    url = url.replace(
      `{${pathParam.name}}`,
      generateSchemaExample(pathParam.schema as OpenAPIV3.SchemaObject),
    );
  }

  const completeURL = new URL(url, baseURL);
  completeURL.search = queryParamsSet.toString();

  const params = ["--fail", "--location"];

  if (method !== "get") {
    params.push("-X " + method.toUpperCase());
  }

  const body = spec.requestBody as OpenAPIV3.RequestBodyObject;
  const bodyJsonSchema = body?.content?.["application/json"]?.schema;
  if (bodyJsonSchema) {
    const body = generateSchemaExample(
      bodyJsonSchema as OpenAPIV3.SchemaObject,
    );
    if (body) {
      headerArgs.push("-H 'Content-Type: application/json'");
      params.push(`-d '${JSON.stringify(body)}'`);
    }
  }

  const bodyMultipartSchema = body?.content?.["multipart/form-data"]?.schema;
  if (bodyMultipartSchema) {
    const body = generateSchemaExample(
      bodyMultipartSchema as OpenAPIV3.SchemaObject,
    );
    if (body) {
      for (let [key, value] of Object.entries(body)) {
        if (value instanceof Uint8Array) {
          value = "@some-filename.jpg";
        }
        headerArgs.push(`-F "${key}=${value}"`);
      }
    }
  }

  params.push(...headerArgs);
  params.push(completeURL.toString());

  return `$ curl \\${params.map((p) => `\n    ${p}`).join(" \\")}`;
}

export default generateCurlCodeExample;
