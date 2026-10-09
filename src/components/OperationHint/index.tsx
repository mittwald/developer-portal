import React from "react";
import Translate from "@docusaurus/Translate";
import MDXComponents from "@theme/MDXComponents";
import {
  Alert,
  Content,
  Heading,
  Text,
} from "@mittwald/flow-react-components";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import OperationPath from "@site/src/components/openapi/OperationPath";
import { buildOperationUrl } from "@site/src/components/openapi/OperationLink";
import isDeprecated from "@site/src/openapi/isDeprecated";
import { APIVersion, getOperationById, useSpec } from "@site/src/openapi/specs";
import styles from "./styles.module.css";

// Rendered like any other Markdown link
const MDXLink = MDXComponents.a;

export interface OperationHintProps {
  operation: string | string[];
  apiVersion?: APIVersion;
}

/** One endpoint: method badge, summary as link and the path after it */
function OperationHintItem({
  operationId,
  apiVersion,
}: {
  operationId: string;
  apiVersion: APIVersion;
}) {
  const spec = useSpec(apiVersion);
  const operation = getOperationById(spec, operationId);

  if (!operation) {
    return (
      <li>
        unknown operation <code>{operationId}</code>
      </li>
    );
  }

  // Strip trailing dot from summary, it is used like a title
  const summary =
    operation.operation.summary?.replace(/\.$/, "") ?? operationId;

  return (
    <li className={styles.item}>
      <HTTPMethod
        method={operation.method}
        deprecated={isDeprecated(operation.operation)}
        className={styles.method}
      />
      <span>
        <MDXLink href={buildOperationUrl(apiVersion, operation.operation)}>
          {summary}
        </MDXLink>
        {" – "}
        <span className={styles.path}>
          <OperationPath path={operation.path} />
        </span>
      </span>
    </li>
  );
}

export default function OperationHint({
  operation,
  apiVersion = "v2",
}: OperationHintProps) {
  const operations = Array.isArray(operation) ? operation : [operation];

  return (
    <Alert status="info">
      <Heading>
        <Translate id="index.reference.title">API Reference</Translate>
      </Heading>
      <Content>
        <Text>
          {operations.length > 1 ? (
            <Translate id="components.OperationHint.text.plural" />
          ) : (
            <Translate id="components.OperationHint.text" />
          )}
          :
        </Text>
        <ul className={styles.operations}>
          {operations.map((o) => (
            <OperationHintItem
              key={o}
              operationId={o}
              apiVersion={apiVersion}
            />
          ))}
        </ul>
      </Content>
    </Alert>
  );
}
