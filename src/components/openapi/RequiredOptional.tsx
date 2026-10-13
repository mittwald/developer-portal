import { AlertBadge, Badge } from "@mittwald/flow-react-components";
import React from "react";

// Plain badges without status icon; deprecated is a warning alert badge

export function Required() {
  return <Badge color="neutral">required</Badge>;
}

export function Deprecated({ className }: { className?: string }) {
  return (
    <AlertBadge status="warning" className={className}>
      deprecated
    </AlertBadge>
  );
}
