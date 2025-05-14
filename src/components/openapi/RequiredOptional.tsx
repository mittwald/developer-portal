import { AlertBadge } from "@mittwald/flow-react-components";
import React from "react";

export function Required() {
  return <AlertBadge status="warning">required</AlertBadge>;
}

export function Optional() {
  return <AlertBadge status="info">optional</AlertBadge>;
}

export function Deprecated() {
  return <AlertBadge status="danger">deprecated</AlertBadge>;
}
