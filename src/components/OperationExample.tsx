import { APIVersion, getOperationById, useSpec } from "@site/src/openapi/specs";
import CodeBlock from "@theme/CodeBlock";
import OperationLink from "@site/src/components/OperationLink";
import styles from "./OperationExample.module.css";
import OperationDocCardById from "@site/src/components/openapi/OperationDocCardById";
import clsx from "clsx";

interface Props {
  apiVersion?: APIVersion;
  operation: string;
  example: any;
  headers?: Record<string, string>;
  withoutLink?: boolean;
}

export default function OperationExample(p: Props) {
  const { apiVersion = "v2" as APIVersion, withoutLink = false } = p;
  const spec = useSpec(apiVersion);
  const operation = getOperationById(spec, p.operation);
  const headers = {
    Host: "api.mittwald.de",
    ...p.headers || {},
  }

  if (p.example) {
    headers["Content-Type"] = "application/json";
  }

  const requestLine = `${operation.method.toUpperCase()} ${operation.path} HTTP/1.1\n`;
  const headerLines = Object.keys(headers).map((key) => `${key}: ${headers[key]}`).join("\n");

  const body = p.example ?
    requestLine + headerLines + `\n\n` + JSON.stringify(p.example, null, 2) :
    requestLine + headerLines;

  const link = <>See full request reference at: <OperationLink operation={p.operation} /></>;

  return <>
    <CodeBlock language="yaml">{body}</CodeBlock>
    {withoutLink || <div className={clsx(styles.reference)}>{link}</div>}
  </>
}