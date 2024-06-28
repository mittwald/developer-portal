import React from "react";
import Translate from "@docusaurus/Translate";
import OperationDocCardById from "@site/src/components/openapi/OperationDocCardById";
import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Content from "@mittwald/flow-react-components/Content";
import Heading from "@mittwald/flow-react-components/Heading";
import styles from "./styles.module.css";

export interface OperationHintProps {
  operation: string | string[];
}

export default function OperationHint({ operation }: OperationHintProps) {
  operation = Array.isArray(operation) ? operation : [operation];

  const heading = operation.length > 1 ?
    <Translate id="components.OperationHint.text.plural" /> :
    <Translate id="components.OperationHint.text" />;

  return (
    <InlineAlert status="info">
      <Heading>{heading}:</Heading>
      <Content>
        <div className={styles.operations}>
          {operation.map((o, idx) => <OperationDocCardById key={idx} apiVersion="v2" operationId={o} variant="compact" />)}
        </div>
      </Content>
    </InlineAlert>
  );
}
