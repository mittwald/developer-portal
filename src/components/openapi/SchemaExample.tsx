import { OpenAPIV3 } from "openapi-types";
import CodeBlock from "@theme/CodeBlock";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";
import * as yaml from "yaml";
import React from "react";

interface Props {
  title?: string;
  schema: OpenAPIV3.SchemaObject;
  format?: ExampleFormat;
  withHeaders?: boolean;
}

type RendererProps = Omit<Props, "schema"> & { content: any };

export type ExampleFormat = "json" | "yaml" | "form" | "multipart-form";

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
 * @param withHeaders Whether to include headers in the example
 */
export default function SchemaExample({
  schema,
  title,
  format = "json",
  withHeaders = false,
}: Props) {
  if (schema.oneOf) {
    return schema.oneOf.map((s, idx) => (
      <SchemaExample
        key={idx}
        title={`Alternative #${idx + 1}`}
        schema={s as OpenAPIV3.SchemaObject}
        withHeaders={withHeaders}
      />
    ));
  }

  return (
    <SchemaExampleRenderer
      content={generateSchemaExample(schema)}
      withHeaders={withHeaders}
      title={title}
      format={format}
    />
  );
}

export function SchemaExampleRenderer({
  content,
  title,
  format = "json",
  withHeaders = false,
}: RendererProps) {
  const rendered = withHeaders
    ? renderExampleWithHeaders(format, content)
    : renderExample(format, content);

  return (
    <CodeBlock showLineNumbers={true} language="yaml" title={title}>
      {rendered}
    </CodeBlock>
  );
}

function renderExampleWithHeaders(format: ExampleFormat, example: any): string {
  const rendered = renderExample(format, example);

  if (format === "yaml") {
    return "Content-Type: application/yaml\r\n\r\n" + rendered;
  }

  if (format === "json") {
    return "Content-Type: application/json\r\n\r\n" + rendered;
  }

  if (format === "multipart-form") {
    return (
      "Content-Type: multipart/form-data; boundary=------FormDataBoundary\r\n\r\n" +
      rendered
    );
  }
}

function renderExample(format: ExampleFormat, example: any): string {
  if (format === "yaml") {
    return yaml.stringify(example);
  }

  if (format === "json") {
    return JSON.stringify(example, null, 2);
  }

  if (format === "multipart-form") {
    const boundary = "------FormDataBoundary";
    return (
      Object.entries(example)
        .map(([key, value]) => {
          let contentType: string = undefined;
          let valueStr: string = value.toString();

          if (value instanceof Uint8Array) {
            contentType = "image/jpeg";
            valueStr = "[binary file contents]";
          }

          let example =
            boundary +
            "\r\n" +
            `Content-Disposition: form-data; name="${key}"` +
            "\r\n";

          if (contentType) {
            example += `Content-Type: ${contentType}` + "\r\n";
          }

          example += "\r\n" + valueStr + "\r\n";
          return example;
        })
        .join("") +
      boundary +
      "--"
    );
  }

  if (format === "form") {
    return Object.entries(example)
      .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
      .join("&");
  }
}
