import { APIVersion, getOperationById, useSpec } from "@site/src/openapi/specs";
import CodeBlock from "@theme/CodeBlock";
import OperationLink from "@site/src/components/OperationLink";
import styles from "./OperationExample.module.css";
import clsx from "clsx";
import React from "react";

interface Props {
  apiVersion?: APIVersion;
  operation: string;
  example: any;
  headers?: Record<string, string>;
  pathParameters?: Record<string, string>;
  withoutLink?: boolean;
}

export default function OperationExample(p: Props) {
  const {
    apiVersion = "v2" as APIVersion,
    withoutLink = false,
    pathParameters = {},
  } = p;
  const spec = useSpec(apiVersion);
  const operation = getOperationById(spec, p.operation);
  const headers: Record<string, string> = {
    Host: "api.mittwald.de",
    ...(p.headers || {}),
  };

  if (p.example) {
    headers["Content-Type"] = "application/json";
  }

  let path = operation.path;
  for (const param of Object.keys(pathParameters)) {
    path = path.replace(`{${param}}`, pathParameters[param]);
  }

  const requestLine = `${operation.method.toUpperCase()} ${path} HTTP/1.1\n`;
  const headerLines = Object.keys(headers)
    .map((key) => `${key}: ${headers[key]}`)
    .join("\n");

  const body = p.example
    ? requestLine + headerLines + `\n\n` + JSON.stringify(p.example, null, 2)
    : requestLine + headerLines;

  const link = (
    <>
      See full request reference at: <OperationLink operation={p.operation} />
    </>
  );

  return (
    <>
      <CodeBlock language="yaml">{body}</CodeBlock>
      {withoutLink || <div className={clsx(styles.reference)}>{link}</div>}
    </>
  );
}
