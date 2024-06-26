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
import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import styles from "./OperationMetadata.module.css";
import Translate from "@docusaurus/Translate";
import Admonition from "@theme/Admonition";
import isDeprecated from "@site/src/openapi/isDeprecated";

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

function DeprecationNotice() {
  return (
    <Admonition type="warning">
      <Translate id="openapi.operation.metadata.deprecationnotice.text">
        This operation is deprecated and should not be used anymore. Please
        refer to this operation's description for alternatives.
      </Translate>
    </Admonition>
  );
}

export function OperationMetadata({
  method,
  path,
  spec,
  withDescription = true,
}: {
  path: string;
  method: string;
  spec: OpenAPIV3.OperationObject;
  withDescription?: boolean;
}) {
  return (
    <>
      <pre>
        {method.toUpperCase()} <OperationPath path={path} />
      </pre>

      {isDeprecated(spec) && <DeprecationNotice />}

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
            Operation ID <OperationIdHelp />
          </Label>
          <Content>
            <div>{spec.operationId}</div>
            <CopyButton text={spec.operationId} size="s" variant="plain" />
          </Content>
        </LabeledValue>
      </ColumnLayout>
      <hr />
      {spec.description && withDescription ? <Markdown>{spec.description}</Markdown> : null}
    </>
  );
}
