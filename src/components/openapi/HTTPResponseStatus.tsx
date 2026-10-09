import React from "react";
import { Badge, Label, Text } from "@mittwald/flow-react-components";
import type { BadgeProps } from "@mittwald/flow-react-components";
import { statusCodeName } from "@site/src/openapi/statusCodeName";

function getColorByCode(code: string): BadgeProps["color"] {
  if (code.startsWith("2")) {
    return "green";
  } else if (code.startsWith("3")) {
    return "blue";
  } else if (code.startsWith("4")) {
    return "orange";
  } else if (code.startsWith("5")) {
    return "red";
  } else {
    return "neutral";
  }
}

function HTTPResponseStatus({ code }: { code: string }) {
  const name = statusCodeName(code);
  const color = getColorByCode(code);

  // Codes without a known name (e.g. "default") would render an empty value
  // next to the scope, so they are shown as a plain badge instead.
  if (!name) {
    return <Badge color={color}>{code}</Badge>;
  }

  return (
    <Badge color={color}>
      <Label>{code}</Label>
      <Text>{name}</Text>
    </Badge>
  );
}

export default HTTPResponseStatus;
