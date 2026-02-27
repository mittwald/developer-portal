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
  /** The fetch Response object */
  response: Response;
  /** The formatted JSON response body */
  responseText: string;
}

/**
 * Displays the complete API response including status badge, headers, and
 * formatted response body. Combines ResponseStatus and ResponseHeaders
 * sub-components with a copyable code block for the body.
 */
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
