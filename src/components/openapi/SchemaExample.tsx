import { OpenAPIV3 } from "openapi-types";
import CodeBlock from "@theme/CodeBlock";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";
import * as yaml from "yaml";

interface Props {
  title?: string;
  schema: OpenAPIV3.SchemaObject;
  format?: ExampleFormat;
}

export type ExampleFormat = "json" | "yaml";

/**
 * This component renders an example of a given schema.
 *
 * The schema example is generated using the `generateSchemaExample` function.
 * Existing `.example` values defined with in the schema are respected;
 * otherwise, the example is generated based on the schema type.
 *
 * @param schema The schema for which to generate an example
 * @param title Optional title for the example
 * @param format Optional format for the example (json or yaml; will default to json)
 */
export default function SchemaExample({
  schema,
  title,
  format = "json",
}: Props) {
  if (schema.oneOf) {
    return schema.oneOf.map((s, idx) => (
      <SchemaExample
        key={idx}
        title={`Alternative #${idx + 1}`}
        schema={s as OpenAPIV3.SchemaObject}
      />
    ));
  }

  const example = generateSchemaExample(schema);
  const rendered =
    format === "yaml"
      ? yaml.stringify(example)
      : JSON.stringify(example, null, 2);

  return (
    <CodeBlock showLineNumbers={true} language="yaml" title={title}>
      {rendered}
    </CodeBlock>
  );
}
