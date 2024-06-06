import { OpenAPIV3 } from "openapi-types";
import CodeBlock from "@theme/CodeBlock";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";

function SchemaExample({ schema, title }: { title?: string, schema: OpenAPIV3.SchemaObject }) {
  if (schema.oneOf) {
    return schema.oneOf.map((s, idx) => <SchemaExample key={idx} title={`Alternative #${idx+1}`} schema={s as OpenAPIV3.SchemaObject} />);
  }
  const example = generateSchemaExample(schema);
  return <CodeBlock showLineNumbers={true} language="json" title={title}>{JSON.stringify(example, null, 2)}</CodeBlock>
}

export default SchemaExample;