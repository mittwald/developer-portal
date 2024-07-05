import { OpenAPIV3 } from "openapi-types";
import camelcase from "camelcase";
import { tsTypeName } from "@site/src/openapi/name";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";

function generateJavascriptCodeExample(
  method: string,
  url: string,
  spec: OpenAPIV3.OperationObject,
  baseURL: string,
) {
  const parameters = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
  const pathParams = parameters.filter((p) => p.in === "path") ?? [];
  const queryParams = parameters.filter((p) => p.in === "query") ?? [];
  const headers = parameters.filter((p) => p.in === "headers") ?? [];
  const successfulStatus =
    Object.keys(spec.responses).find((status) => status.startsWith("2")) ??
    "200";

  const tagPrefixRegex = new RegExp(`^${spec.tags[0]}-`, 'i');

  const requestObject: any = {};
  const tag = camelcase(tsTypeName(spec.tags[0]));
  const operationId = camelcase(tsTypeName(spec.operationId.replace(tagPrefixRegex, "")));

  for (const pathParam of pathParams) {
    requestObject[pathParam.name] = generateSchemaExample(
      pathParam.schema as OpenAPIV3.SchemaObject,
    );
  }

  const bodySchema = (spec.requestBody as OpenAPIV3.RequestBodyObject)
    ?.content?.["application/json"]?.schema;
  if (bodySchema) {
    const body = generateSchemaExample(bodySchema as OpenAPIV3.SchemaObject);
    if (body) {
      requestObject.data = body;
    }
  }

  if (queryParams.length > 0) {
    requestObject.queryParameters = {};
    for (const queryParam of queryParams) {
      requestObject.queryParameters[queryParam.name] = generateSchemaExample(
        queryParam.schema as OpenAPIV3.SchemaObject,
      );
    }
  }

  if (headers.length > 0) {
    requestObject.headers = {};
    for (const header of headers) {
      requestObject.headers[header.name] = generateSchemaExample(
        header.schema as OpenAPIV3.SchemaObject,
      );
    }
  }

  const requestObjectJson = JSON.stringify(requestObject, null, 2);

  return `import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
  
const client = MittwaldAPIClient.newWithToken(process.env.MITTWALD_API_TOKEN);
const response = await client.${tag}.${operationId}(${requestObjectJson});

assertStatus(response, ${successfulStatus});
  `;
}

export default generateJavascriptCodeExample;
