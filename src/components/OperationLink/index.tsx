import React, { PropsWithChildren } from "react";
import Link from "@docusaurus/Link";
import { getOperationById, useSpec } from "@site/src/openapi/specs";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import OperationPath from "@site/src/components/openapi/OperationPath";
import styles from "./styles.module.css";

export interface OperationLinkProps {
  operation: string;
}

export default function OperationLink({
                                        operation,
                                        children
                                      }: PropsWithChildren<OperationLinkProps>) {
  const spec = useSpec("v2");
  const operationSpec = getOperationById(spec, operation);

  if (!operationSpec) {
    return <>unknown operation <code>{operation}</code></>;
  }

  const tag = operationSpec.operation.tags[0];
  const summary = operationSpec.operation.summary.replace(/\.$/, "");

  children = children || <span className={styles.operationLink}>
    <HTTPMethod method={operationSpec.method} />
    <code>
      <OperationPath path={operationSpec.path} />
    </code>
  </span>;

  const url = `/docs/v2/reference/${tag.toLowerCase()}/${operation}`;
  return <Link to={url}>{children}</Link>;
}
