import { Badge, Label, Text } from "@mittwald/flow-react-components";
import React from "react";
import Translate from "@docusaurus/Translate";
import { getColorByCode } from "@site/src/components/openapi/HTTPResponseStatus";

export interface ResponseStatusProps {
  /** The fetch Response object */
  response: Response;
}

/**
 * Displays the HTTP status code as a colored badge, in the same colors as
 * the response codes in the API reference.
 */
function ResponseStatus({ response }: ResponseStatusProps) {
  return (
    <Badge color={getColorByCode(String(response.status))}>
      <Label>
        <Translate id="playground.response.status">Status</Translate>
      </Label>
      <Text>{response.status}</Text>
    </Badge>
  );
}

export default ResponseStatus;
