import { Heading, Section, TextArea } from "@mittwald/flow-react-components";
import React from "react";
import { OpenAPIV3 } from "openapi-types";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";

export interface RequestBodySectionProps {
  /** OpenAPI request body definition */
  requestBody: OpenAPIV3.RequestBodyObject;
  /** Callback fired when the request body content changes */
  onRequestBodyChange: (value: string) => void;
}

/**
 * Renders a text area for editing the JSON request body. Automatically
 * generates an example body from the OpenAPI schema as the initial value.
 */
function RequestBodySection({
  requestBody,
  onRequestBodyChange,
}: RequestBodySectionProps) {
  const jsonContent = requestBody.content?.["application/json"];
  if (!jsonContent?.schema) {
    return null;
  }

  const schema = jsonContent.schema as OpenAPIV3.SchemaObject;
  const initialBody = JSON.stringify(generateSchemaExample(schema), null, 2);

  return (
    <Section>
      <Heading>Request Body</Heading>
      <TextArea
        onChange={onRequestBodyChange}
        placeholder="Request body"
        autoResizeMaxRows={10}
        defaultValue={initialBody}
      />
    </Section>
  );
}

export default RequestBodySection;
