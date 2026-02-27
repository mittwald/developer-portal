import { Heading, Section, TextArea } from "@mittwald/flow-react-components";
import React from "react";
import { OpenAPIV3 } from "openapi-types";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";

export interface RequestBodySectionProps {
  requestBody: OpenAPIV3.RequestBodyObject;
  onRequestBodyChange: (value: string) => void;
}

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
