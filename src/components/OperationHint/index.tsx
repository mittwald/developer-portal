import React from "react";
import Translate from "@docusaurus/Translate";
import OperationDocCardById from "@site/src/components/openapi/OperationDocCardById";
import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Content from "@mittwald/flow-react-components/Content";
import Heading from "@mittwald/flow-react-components/Heading";

export interface OperationHintProps {
  tag: string;
  operation: string;
}

export default function OperationHint({ tag, operation }: OperationHintProps) {
  return (
    <InlineAlert status="info">
      <Heading><Translate id="components.OperationHint.text" />: </Heading>
      <Content>
        <OperationDocCardById apiVersion="v2" operationId={operation} />
      </Content>
    </InlineAlert>
  );
}
