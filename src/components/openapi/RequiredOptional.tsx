import { Badge } from "@mittwald/flow-react-components";
import React from "react";

// Plain badges in the colors of the former alert badges (warning, info,
// danger), without the status icon

export function Required() {
  return <Badge color="orange">required</Badge>;
}

export function Optional() {
  return <Badge color="blue">optional</Badge>;
}

export function Deprecated() {
  return <Badge color="red">deprecated</Badge>;
}
