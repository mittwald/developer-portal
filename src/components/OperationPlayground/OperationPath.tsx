import { TextField } from "@mittwald/flow-react-components";
import React, { Fragment } from "react";
import styles from "./index.module.css";

export interface OperationPathProps {
  path: string;
  onChange: (param: string, value: string) => void;
}

function OperationPath({ path, onChange }: OperationPathProps) {
  const components = path.split("/");
  const parts = components.map((part, idx) => {
    if (part.startsWith("{")) {
      const paramName = part.slice(1, -1);
      return (
        <Fragment key={idx}>
          <TextField
            placeholder={paramName}
            onChange={(e) => onChange(paramName, e)}
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
