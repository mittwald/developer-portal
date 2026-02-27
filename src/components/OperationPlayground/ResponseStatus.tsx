import { Badge, Label, Text } from "@mittwald/flow-react-components";
import React from "react";

export interface ResponseStatusProps {
  /** The fetch Response object */
  response: Response;
}

/**
 * Displays the HTTP status code as a colored badge.
 * Green for successful responses (2xx), red for errors.
 */
function ResponseStatus({ response }: ResponseStatusProps) {
  return (
    <Badge color={response.ok ? "green" : "red"}>
      <Label>Status</Label>
      <Text>{response.status}</Text>
    </Badge>
  );
}

export default ResponseStatus;
