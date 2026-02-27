import { Fragment } from "react";
import styles from "./OperationPath.module.css";
import React from "react";

function OperationPath({ path }: { path: string }) {
  const components = path.split("/");
  const parts = components.map((part, index) => {
    if (part.startsWith("{")) {
      return (
        <Fragment key={index}>
          <span className={styles.variableLinkParameter}>{part}</span>/<wbr />
        </Fragment>
      );
    }
    return (
      <Fragment key={index}>
        <span>{part}</span>/<wbr />
      </Fragment>
    );
  });

  return <>{parts}</>;
}

export default OperationPath;
