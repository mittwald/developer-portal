import { TextField } from "@mittwald/flow-react-components";
import { translate } from "@docusaurus/Translate";
import React, { Fragment } from "react";
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
 * Renders an API path with inline input fields for path parameters.
 * Static path segments are displayed as text, while parameters (enclosed in
 * curly braces) become editable text fields.
 */
function OperationPath({ path, values, onChange }: OperationPathProps) {
  const components = path.split("/");
  const parts = components.map((part, idx) => {
    if (part.startsWith("{")) {
      const paramName = part.slice(1, -1);
      return (
        <Fragment key={idx}>
          <TextField
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
          <span className={styles.operationPathItem}>/</span>
        </Fragment>
      );
    }

    return (
      <Fragment key={idx}>
        <span className={styles.operationPathItem}>{part}</span>
        <span className={styles.operationPathItem}>/</span>
      </Fragment>
    );
  });

  return parts;
}

export default OperationPath;
