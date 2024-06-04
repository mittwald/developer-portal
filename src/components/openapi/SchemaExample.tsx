import { OpenAPIV3 } from "openapi-types";
import CodeBlock from "@theme/CodeBlock";

function generateExample(schema: OpenAPIV3.SchemaObject): any {
  if (schema.example) {
    return schema.example;
  }

  if (schema.type === "object") {
    const example: any = {};
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([name, property]) => {
        example[name] = generateExample(property as OpenAPIV3.SchemaObject);
      });
    }
    if (schema.additionalProperties) {
      example["string"] = generateExample(schema.additionalProperties as OpenAPIV3.SchemaObject);
    }
    return example;
  }

  if (schema.type === "array") {
    return [generateExample(schema.items as OpenAPIV3.SchemaObject)];
  }

  if (schema.type === "string") {
    if (schema.format === "date-time") {
      return new Date().toISOString();
    } else if (schema.format === "email") {
      return "email@mittwald.example";
    } else if (schema.format === "uuid") {
      return "f0f86186-0a5a-45b2-aa33-502777496347";
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

function SchemaExample({ schema }: { schema: OpenAPIV3.SchemaObject }) {
  const example = generateExample(schema);
  return <CodeBlock showLineNumbers={true} language="json">{JSON.stringify(example, null, 2)}</CodeBlock>
}

export default SchemaExample;