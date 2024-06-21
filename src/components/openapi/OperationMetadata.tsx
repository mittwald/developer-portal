import { OpenAPIV3 } from "openapi-types";
import OperationPath from "@site/src/components/openapi/OperationPath";
import Markdown from "react-markdown";
import Content from "@mittwald/flow-react-components/Content";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import CopyButton from "@mittwald/flow-react-components/CopyButton";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@mittwald/flow-react-components/ContextualHelp";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Text } from "@mittwald/flow-react-components/Text";
import { Button } from "@mittwald/flow-react-components/Button";
import styles from "./OperationMetadata.module.css";
import Translate from "@docusaurus/Translate";

function OperationIdHelp() {
  return (
    <ContextualHelpTrigger>
      <Button />

      <ContextualHelp>
        <Heading>
          <Translate id="openapi.operation.metadata.operationidhelp.title">
            Operation IDs
          </Translate>
        </Heading>
        <Text>
          <Translate id="openapi.operation.metadata.operationidhelp.text">
            Operation IDs are used to uniquely identify operations within an
            API, independent of the path or method. They are typically used by
            code generators to generate method names or function calls.
          </Translate>
        </Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  );
}

export function OperationMetadata({
  method,
  path,
  spec,
}: {
  path: string;
  method: string;
  spec: OpenAPIV3.OperationObject;
}) {
  return (
    <>
      <pre>
        {method.toUpperCase()} <OperationPath path={path} />
      </pre>

      <ColumnLayout m={[1, 1, 2]}>
        <LabeledValue>
          <Label>API version</Label>
          <Content>
            {path.split("/").filter((p) => p.startsWith("v"))[0]}
          </Content>
        </LabeledValue>
        <LabeledValue>
          <Label>Request method</Label>
          <Content>{method.toUpperCase()}</Content>
        </LabeledValue>
        <LabeledValue className={styles.operationIdValue}>
          <Label className={styles.labelWithHelp}>
            <OperationIdHelp /> Operation ID
          </Label>
          <Content>
            <div>{spec.operationId}</div>
            <CopyButton text={spec.operationId} size="s" />
          </Content>
        </LabeledValue>
      </ColumnLayout>
      <hr />
      {spec.description ? <Markdown>{spec.description}</Markdown> : null}
    </>
  );
}
