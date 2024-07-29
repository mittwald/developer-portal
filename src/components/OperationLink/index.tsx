import React, { PropsWithChildren } from "react";
import Link from "@docusaurus/Link";
import { APIVersion, getOperationById, useSpec } from "@site/src/openapi/specs";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import OperationPath from "@site/src/components/openapi/OperationPath";
import styles from "./styles.module.css";

export interface OperationLinkProps {
  operation: string;
  apiVersion?: APIVersion;
}

export default function OperationLink({
  operation,
  apiVersion = "v2",
  children,
}: PropsWithChildren<OperationLinkProps>) {
  const spec = useSpec(apiVersion);
  const operationSpec = getOperationById(spec, operation);

  if (!operationSpec) {
    return (
      <>
        unknown operation <code>{operation}</code>
      </>
    );
  }

  const tag = operationSpec.operation.tags[0];
  if (!tag) {
    return (
      <>
        <code>{operation}</code> (untagged)
      </>
    );
  }

  children = children || (
    <span className={styles.operationLink}>
      <HTTPMethod method={operationSpec.method} />
      <code>
        <OperationPath path={operationSpec.path} />
      </code>
    </span>
  );

  const url = `/docs/${apiVersion}/reference/${tag.toLowerCase()}/${operation}`;
  return <Link to={url}>{children}</Link>;
}
