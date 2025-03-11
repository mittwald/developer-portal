import React from "react";
import Translate from "@docusaurus/Translate";
import OperationDocCardById from "@site/src/components/openapi/OperationDocCardById";
import { Alert } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";
import { APIVersion } from "@site/src/openapi/specs";

export interface OperationHintProps {
  operation: string | string[];
  apiVersion?: APIVersion;
}

export default function OperationHint({
  operation,
  apiVersion = "v2",
}: OperationHintProps) {
  operation = Array.isArray(operation) ? operation : [operation];

  const heading =
    operation.length > 1 ? (
      <Translate id="components.OperationHint.text.plural" />
    ) : (
      <Translate id="components.OperationHint.text" />
    );

  return (
    <Alert status="info">
      <Heading>{heading}:</Heading>
      <Content>
        <div className={styles.operations}>
          {operation.map((o, idx) => (
            <OperationDocCardById
              key={idx}
              apiVersion={apiVersion}
              operationId={o}
              variant="compact"
            />
          ))}
        </div>
      </Content>
    </Alert>
  );
}
