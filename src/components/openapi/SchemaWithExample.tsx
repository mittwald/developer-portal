import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Schema from "@site/src/components/openapi/Schema";
import SchemaExample, {
  ExampleFormat,
  SchemaExampleRenderer,
} from "@site/src/components/openapi/SchemaExample";
import { OpenAPIV3 } from "openapi-types";
import { translate } from "@docusaurus/Translate";
import CodeBlock from "@theme/CodeBlock";
import MDXComponents from "@theme/MDXComponents";
import React from "react";
import { Text } from "@mittwald/flow-react-components";
import Description from "@site/src/components/openapi/Description";
import ExampleObject = OpenAPIV3.ExampleObject;

interface Props {
  schema: OpenAPIV3.SchemaObject;
  example?: any;
  examples?: Record<string, ExampleObject>;
  format?: ExampleFormat;
  withRawJSONSchema?: boolean;
  withHeaders?: boolean;
}

/**
 * This component renders a schema with an example in a tabbed view.
 *
 * @param schema The schema to render and to generate an example for
 * @param example Optional single example to show instead of generating one
 * @param examples Optional examples to show instead of generating one; take
 *   precedence over `example`
 * @param withRawJSONSchema Whether to show the raw JSON schema in a tab
 * @param format Optional format for the example (json or yaml)
 * @param withHeaders Whether to include headers in the example
 * @see Schema
 * @see SchemaExample
 */
export default function SchemaWithExample({
  schema,
  example,
  examples,
  withRawJSONSchema,
  format,
  withHeaders,
}: Props) {
  let renderedExamples: React.ReactNode;

  if (examples) {
    renderedExamples = Object.entries(examples).map(([key, example]) => (
      <React.Fragment key={key}>
        {example.description && (
          <Description>{example.description}</Description>
        )}
        {example.value !== undefined ? (
          <SchemaExampleRenderer
            content={example.value}
            withHeaders={withHeaders}
            format={format}
            title={example.summary ?? key}
          />
        ) : (
          example.externalValue && (
            <Text elementType="p">
              {example.summary ?? key}:{" "}
              <MDXComponents.a href={example.externalValue}>
                {example.externalValue}
              </MDXComponents.a>
            </Text>
          )
        )}
      </React.Fragment>
    ));
  } else if (example !== undefined) {
    renderedExamples = (
      <SchemaExampleRenderer
        content={example}
        withHeaders={withHeaders}
        format={format}
      />
    );
  } else {
    renderedExamples = (
      <SchemaExample
        schema={schema}
        format={format}
        withHeaders={withHeaders}
      />
    );
  }

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
        {renderedExamples}
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
