import { TextField } from "@mittwald/flow-react-components";
import { translate } from "@docusaurus/Translate";
import React from "react";
import styles from "./index.module.css";

export interface OperationPathProps {
  /** The API path template, e.g. "/v2/projects/{projectId}/users/{userId}" */
  path: string;
  /** Current path parameter values */
  values: Record<string, string>;
  /** Callback fired when a path parameter value changes */
  onChange: (param: string, value: string) => void;
}

/**
 * Renders an API path with inline input fields for path parameters, in
 * monospace like the paths elsewhere. Static path segments are displayed as
 * text, while parameters (enclosed in curly braces) become editable text
 * fields.
 */
function OperationPath({ path, values, onChange }: OperationPathProps) {
  // Splitting at the parameters keeps the static text between them (with its
  // slashes) together
  const parts = path
    .split(/(\{[^}]+\})/)
    .filter((part) => part !== "")
    .map((part, idx) => {
      if (part.startsWith("{")) {
        const paramName = part.slice(1, -1);
        return (
          <TextField
            key={idx}
            className={styles.operationPathParam}
            placeholder={paramName}
            value={values[paramName] ?? ""}
            onChange={(e) => onChange(paramName, e)}
            aria-label={translate(
              {
                id: "playground.path-param.aria-label",
                message: "URL path parameter {paramName}",
              },
              { paramName },
            )}
          />
        );
      }

      return (
        <span key={idx} className={styles.operationPathItem}>
          {part}
        </span>
      );
    });

  return <>{parts}</>;
}

export default OperationPath;
