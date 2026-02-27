import { Badge, Label, Text } from "@mittwald/flow-react-components";
import React from "react";

function ResponseStatus({ response }: { response: Response }) {
  return (
    <Badge color={response.ok ? "green" : "red"}>
      <Label>Status</Label>
      <Text>{response.status}</Text>
    </Badge>
  );
}

export default ResponseStatus;
