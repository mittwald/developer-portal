import { OpenAPIV3 } from "openapi-types";

export function generateSchemaExample(schema: OpenAPIV3.SchemaObject): any {
  if (schema.example) {
    if (schema.format === "binary") {
      return "[Binary Example]";
    }
    return schema.example;
  }

  if (schema.oneOf) {
    return generateSchemaExample(schema.oneOf[0] as OpenAPIV3.SchemaObject);
  }

  if (schema.type === "object" || "properties" in schema) {
    const example: any = {};
    if (schema.properties) {
      const nonDeprecatedProperties = Object.entries(schema.properties).filter(
        ([, property]) => !(property as OpenAPIV3.SchemaObject).deprecated,
      );
      nonDeprecatedProperties.forEach(([name, property]) => {
        example[name] = generateSchemaExample(
          property as OpenAPIV3.SchemaObject,
        );
      });
    }
    if (schema.additionalProperties) {
      let exampleKey = "string";

      if ("x-example-key" in schema) {
        exampleKey = schema["x-example-key"] as string;
      }

      example[exampleKey] = generateSchemaExample(
        schema.additionalProperties as OpenAPIV3.SchemaObject,
      );
    }
    return example;
  }

  if (schema.type === "array") {
    return [generateSchemaExample(schema.items as OpenAPIV3.SchemaObject)];
  }

  // ATTN: Keep this output static in order to avoid hydration issues,
  // as the examples are (re-)generated on the client side!
  if (schema.type === "string") {
    if (schema.format === "date-time") {
      return "1985-10-26T01:21:00.000Z";
    } else if (schema.format === "email" || schema.format === "idn-email") {
      return "email@mittwald.example";
    } else if (schema.format === "uuid") {
      return "f0f86186-0a5a-45b2-aa33-502777496347";
    } else if (schema.format === "idn-hostname") {
      return "some-hostname.example";
    } else if (schema.format === "binary") {
      return new Uint8Array([1, 2, 3, 4, 5]);
    }

    if (schema.enum !== undefined) {
      return schema.enum[0];
    }

    return "string";
  }

  if (schema.type === "number" || schema.type === "integer") {
    return 123;
  }

  if (schema.type === "boolean") {
    return true;
  }

  return null;
}
