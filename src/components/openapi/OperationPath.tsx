import { Fragment } from "react";
import styles from "./OperationPath.module.css";

function OperationPath({ path }: { path: string }) {
  // The leading slash yields an empty first part, so a separator is only
  // rendered between parts (and the path keeps its own trailing slash, if any).
  // Lines may break after every slash except the leading one.
  const parts = path.split("/").map((part, index) => (
    <Fragment key={index}>
      {index > 0 && <>/{index > 1 && <wbr />}</>}
      {part.startsWith("{") ? (
        <span className={styles.variableLinkParameter}>{part}</span>
      ) : (
        part
      )}
    </Fragment>
  ));

  return <>{parts}</>;
}

export default OperationPath;
