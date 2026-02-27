import {
  Accordion,
  CodeBlock,
  Content,
  Heading,
  Section,
} from "@mittwald/flow-react-components";
import React from "react";
import ResponseStatus from "./ResponseStatus";
import ResponseHeaders from "./ResponseHeaders";

export interface ResponseSectionProps {
  response: Response;
  responseText: string;
}

function ResponseSection({ response, responseText }: ResponseSectionProps) {
  return (
    <Section>
      <Heading>Response</Heading>
      <ResponseStatus response={response} />
      <ResponseHeaders headers={response.headers} />
      <Accordion defaultExpanded={true} variant="outline">
        <Heading>Response body</Heading>
        <Content>
          <CodeBlock code={responseText} copyable={true} />
        </Content>
      </Accordion>
    </Section>
  );
}

export default ResponseSection;
