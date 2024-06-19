import { Fragment } from "react";
import styles from "@site/src/components/openapi/OperationPath.module.css";

function OperationPath({ path }: { path: string }) {
  const components = path.split("/");
  const parts = components.map((part, index) => {
    if (part.startsWith("{")) {
      return (
        <Fragment key={index}>
          <span className={styles.variableLinkParameter}>{part}</span>/
        </Fragment>
      );
    }
    return (
      <Fragment key={index}>
        <span>{part}</span>/
      </Fragment>
    );
  });

  return <>{parts}</>;
}

export default OperationPath;
