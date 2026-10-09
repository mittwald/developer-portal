import React, { PropsWithChildren } from "react";
import MDXComponents from "@theme/MDXComponents";
import { APIVersion, getOperationById, useSpec } from "@site/src/openapi/specs";
import OperationPath from "@site/src/components/openapi/OperationPath";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import styles from "./styles.module.css";
import { slugFromTagName } from "@site/src/openapi/slugFromTagName";

// Rendered like any other Markdown link
const OperationAnchor = MDXComponents.a;

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
    <>
      <HTTPMethod method={operationSpec.method} className={styles.method} />
      <span className={styles.path}>
        <OperationPath path={operationSpec.path} />
      </span>
    </>
  );

  if (apiVersion.endsWith("-preview")) {
    const url = `/docs/${apiVersion.replace("-preview", "")}/preview/${slugFromTagName(tag)}/${operation}`;
    return <OperationAnchor href={url}>{children}</OperationAnchor>;
  }

  const url = `/docs/${apiVersion}/reference/${slugFromTagName(tag)}/${operation}`;
  return <OperationAnchor href={url}>{children}</OperationAnchor>;
}
