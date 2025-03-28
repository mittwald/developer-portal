import { OpenAPIV3 } from "openapi-types";
import OperationPath from "@site/src/components/openapi/OperationPath";
import Markdown from "react-markdown";
import { Content } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";
import { CopyButton } from "@mittwald/flow-react-components";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import styles from "./OperationMetadata.module.css";
import Translate from "@docusaurus/Translate";
import Admonition from "@theme/Admonition";
import isDeprecated from "@site/src/openapi/isDeprecated";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";

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

function OperationPathHeader({
  method,
  path,
  baseURL,
}: {
  method: string;
  path: string;
  baseURL: string;
}) {
  const parsedBaseURL = new URL(baseURL);
  if (path.startsWith(parsedBaseURL.pathname)) {
    path = path.substring(parsedBaseURL.pathname.length);
  }

  return (
    <pre className={styles.meta}>
      <HTTPMethod method={method} />
      <span>
        <OperationPath path={path} />
      </span>
      <CopyButton
        text={baseURL + path}
        size="m"
        variant="plain"
        style={{ marginTop: -8, marginBottom: -8 }}
      />
    </pre>
  );
}

export function OperationMetadata({
  method,
  path,
  spec,
  baseURL,
  withDescription = true,
}: {
  path: string;
  method: string;
  spec: OpenAPIV3.OperationObject;
  baseURL: string;
  withDescription?: boolean;
}) {
  return (
    <>
      <OperationPathHeader method={method} path={path} baseURL={baseURL} />

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
      {spec.description && withDescription ? (
        <Markdown>{spec.description}</Markdown>
      ) : null}
    </>
  );
}
