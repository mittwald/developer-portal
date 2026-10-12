import { Fragment } from "react";
import styles from "./OperationPath.module.css";

/**
 * An API path, the same everywhere (running text, links, hints, reference
 * header): monospace like code, path parameters not set apart.
 */
function OperationPath({ path }: { path: string }) {
  // The leading slash yields an empty first part, so a separator is only
  // rendered between parts (and the path keeps its own trailing slash, if any).
  // Lines may break after every slash except the leading one.
  const parts = path.split("/").map((part, index) => (
    <Fragment key={index}>
      {index > 0 && <>/{index > 1 && <wbr />}</>}
      {part}
    </Fragment>
  ));

  return <span className={styles.path}>{parts}</span>;
}

export default OperationPath;
