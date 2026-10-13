import React from "react";
import Translate from "@docusaurus/Translate";
import MDXComponents from "@theme/MDXComponents";
import {
  Alert,
  Content,
  Heading,
  InlineCode,
  Text,
} from "@mittwald/flow-react-components";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import OperationPath from "@site/src/components/openapi/OperationPath";
import { buildOperationUrl } from "@site/src/components/openapi/OperationLink";
import { Deprecated } from "@site/src/components/openapi/RequiredOptional";
import isDeprecated from "@site/src/openapi/isDeprecated";
import operationSummary from "@site/src/openapi/operationSummary";
import { APIVersion, getOperationById, useSpec } from "@site/src/openapi/specs";
import styles from "./styles.module.css";

// Rendered like any other Markdown link
const MDXLink = MDXComponents.a;

export interface OperationHintProps {
  operation: string | string[];
  apiVersion?: APIVersion;
}

/**
 * One endpoint: method badge and path (the link), as in running text, with
 * the summary below
 */
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
        unknown operation <InlineCode>{operationId}</InlineCode>
      </li>
    );
  }

  // The same title as in the sidebar and on the operation's page
  const summary = operationSummary(apiVersion, operation.operation);

  return (
    <li className={styles.item}>
      <span className={styles.route}>
        <HTTPMethod method={operation.method} className={styles.method} />
        <MDXLink href={buildOperationUrl(apiVersion, operation.operation)}>
          <OperationPath path={operation.path} />
        </MDXLink>
        {isDeprecated(operation.operation) && (
          <Deprecated className={styles.method} />
        )}
      </span>
      <Text className={styles.summary}>{summary}</Text>
    </li>
  );
}

/** The endpoints as list, without the surrounding alert */
export function OperationList({
  operation,
  apiVersion = "v2",
}: OperationHintProps) {
  const operations = Array.isArray(operation) ? operation : [operation];

  return (
    <ul className={styles.operations}>
      {operations.map((o) => (
        <OperationHintItem key={o} operationId={o} apiVersion={apiVersion} />
      ))}
    </ul>
  );
}

export default function OperationHint({
  operation,
  apiVersion = "v2",
}: OperationHintProps) {
  const isPlural = Array.isArray(operation) && operation.length > 1;

  return (
    <Alert status="info">
      <Heading>
        <Translate id="index.reference.title">API Reference</Translate>
      </Heading>
      <Content>
        <Text>
          {isPlural ? (
            <Translate id="components.OperationHint.text.plural" />
          ) : (
            <Translate id="components.OperationHint.text" />
          )}
          :
        </Text>
        <OperationList operation={operation} apiVersion={apiVersion} />
      </Content>
    </Alert>
  );
}
