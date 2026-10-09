import React from "react";
import { Badge } from "@mittwald/flow-react-components";
import type { BadgeProps } from "@mittwald/flow-react-components";
import { statusCodeName } from "@site/src/openapi/statusCodeName";
import styles from "./HTTPResponseStatus.module.css";

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

/**
 * Response status for an accordion heading: its name as heading text,
 * directly followed by the code as badge (codes without a known name, e.g.
 * "default", are the heading text themselves).
 */
function HTTPResponseStatus({ code }: { code: string }) {
  const name = statusCodeName(code);
  if (!name) {
    return code;
  }

  // One element, so that accordion headers (which space out their children)
  // keep name and badge together
  return (
    <span className={styles.status}>
      {name}
      <Badge color={getColorByCode(code)}>{code}</Badge>
    </span>
  );
}

export default HTTPResponseStatus;
