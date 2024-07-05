import { OpenAPIV3 } from "openapi-types";
import camelcase from "camelcase";
import { tsTypeName } from "@site/src/openapi/name";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";

function generatePHPCodeExample(
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

  const requestObject: any = {};
  const tag = tsTypeName(spec.tags[0]);
  const operationId = tsTypeName(
    spec.operationId.replace(new RegExp(`^${tag}-`, "i"), ""),
  );

  const constructorParams: any = {};
  const constructorModifiers: any = {};
  const uses = [
    `\\Mittwald\\ApiClient\\Generated\\V2\\Clients\\${tag}\\${operationId}\\${operationId}Request`,
  ];

  let bodyClassName: string | undefined;
  const bodyConstructorParams: any = {};
  const bodyConstructorModifiers: any = {};

  for (const pathParam of pathParams) {
    constructorParams[pathParam.name] = JSON.stringify(
      generateSchemaExample(pathParam.schema as OpenAPIV3.SchemaObject),
    );
  }

  const bodySchema = (spec.requestBody as OpenAPIV3.RequestBodyObject)
    ?.content?.["application/json"]?.schema;
  if (bodySchema) {
    bodyClassName = `${operationId}RequestBody`;
    uses.push(
      `\\Mittwald\\ApiClient\\Generated\\V2\\Clients\\${tag}\\${operationId}\\${bodyClassName}`,
    );
    constructorParams.body = "$body";
  }

  if (queryParams.length > 0) {
    for (const queryParam of queryParams) {
      let example = generateSchemaExample(queryParam.schema as OpenAPIV3.SchemaObject);
      if (queryParam.name === "skip") {
        continue;
      } else if (queryParam.name === "limit") {
        example = 50;
      } else if (queryParam.name === "page") {
        example = 1;
      }

      constructorModifiers[queryParam.name] = JSON.stringify(example);
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

  const constructorParamsCode =
    Object.entries(constructorParams)
      .map(([key, value]) => `\n  ${key}: ${value}`)
      .join(",") + (Object.keys(constructorParams).length > 0 ? "\n" : "");
  const constructorModifiersCode = Object.entries(constructorModifiers)
    .map(([key, value]) => `\n  ->with${tsTypeName(key)}(${value})`)
    .join("");

  let bodyConstructor = "";
  if (bodyClassName) {
    bodyConstructor = `\n// TODO: Please consult the properties and constructor signature of\n// ${bodyClassName} to learn how to construct a valid instance\n$body = new ${bodyClassName}(/* TODO: ... */);\n`;
  }

  return `${uses.map((use) => `use ${use};`).join("\n")}
  
$client = MittwaldAPIClient::newWithToken(getenv('MITTWALD_API_TOKEN'));
${bodyConstructor}
$request = (new ${operationId}Request(${constructorParamsCode}))${constructorModifiersCode};
$response = $client->${camelcase(tag)}()->${camelcase(operationId)}($request);

var_dump($response->getBody();
  `;
}

export default generatePHPCodeExample;
