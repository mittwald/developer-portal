import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Schema from "@site/src/components/openapi/Schema";
import SchemaExample, {
  ExampleFormat,
} from "@site/src/components/openapi/SchemaExample";
import { OpenAPIV3 } from "openapi-types";
import { translate } from "@docusaurus/Translate";
import CodeBlock from "@theme/CodeBlock";
import React from "react";

interface Props {
  schema: OpenAPIV3.SchemaObject;
  format?: ExampleFormat;
  withRawJSONSchema?: boolean;
  withHeaders?: boolean;
}

/**
 * This component renders a schema with an example in a tabbed view.
 *
 * @param schema The schema to render and to generate an example for
 * @param withRawJSONSchema Whether to show the raw JSON schema in a tab
 * @param format Optional format for the example (json or yaml)
 * @param withHeaders Whether to include headers in the example
 * @see Schema
 * @see SchemaExample
 */
export default function SchemaWithExample({
  schema,
  withRawJSONSchema,
  format,
  withHeaders,
}: Props) {
  return (
    <Tabs groupId="component" defaultValue="schema">
      <TabItem
        value="schema"
        label={translate({ id: "components.SchemaWithExample.schema" })}
      >
        <Schema schema={schema} />
      </TabItem>
      <TabItem
        value="example"
        label={translate({ id: "components.SchemaWithExample.example" })}
      >
        <SchemaExample
          schema={schema}
          format={format}
          withHeaders={withHeaders}
        />
      </TabItem>
      {withRawJSONSchema && (
        <TabItem
          value="raw"
          label={translate({ id: "components.SchemaWithExample.raw" })}
        >
          <CodeBlock language="yaml">
            {JSON.stringify(schema, null, 2)}
          </CodeBlock>
        </TabItem>
      )}
    </Tabs>
  );
}
