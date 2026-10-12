import { OpenAPIV3 } from "openapi-types";
import OperationPath from "@site/src/components/openapi/OperationPath";
import Description from "@site/src/components/openapi/Description";
import { AccentBox, Content } from "@mittwald/flow-react-components";
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
import { Separator } from "@mittwald/flow-react-components";
import styles from "./OperationMetadata.module.css";
import Translate from "@docusaurus/Translate";
import Admonition from "@theme/Admonition";
import isDeprecated from "@site/src/openapi/isDeprecated";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import React from "react";
import OperationPlayground from "@site/src/components/OperationPlayground";
import OperationObject = OpenAPIV3.OperationObject;

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

/**
 * Warning for deprecated operations; a description that explains the
 * deprecation itself (and usually names the alternative) replaces the
 * generic text
 */
function DeprecationNotice({ description }: { description?: string }) {
  return (
    <Admonition type="warning" title="Deprecated">
      {description ? (
        <Description>{description}</Description>
      ) : (
        <Translate id="openapi.operation.metadata.deprecationnotice.text">
          This operation is deprecated and should not be used anymore. Please
          refer to this operation's description for alternatives.
        </Translate>
      )}
    </Admonition>
  );
}

function OperationPathHeader({
  method,
  path,
  baseURL,
  spec,
}: {
  method: string;
  path: string;
  baseURL: string;
  spec: OperationObject;
}) {
  const parsedBaseURL = new URL(baseURL);
  let pathWithoutBase = path;
  if (path.startsWith(parsedBaseURL.pathname)) {
    pathWithoutBase = path.substring(parsedBaseURL.pathname.length);
  }

  return (
    <AccentBox backgroundColor="neutral" className={styles.meta}>
      <span className={styles.route}>
        <HTTPMethod method={method} className={styles.method} />
        <OperationPath path={path} />
      </span>
      <span className={styles.actions}>
        <CopyButton
          text={baseURL + pathWithoutBase}
          variant="plain"
          color="dark"
        />
        <OperationPlayground path={path} method={method} spec={spec} />
      </span>
    </AccentBox>
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
  // A description about the deprecation is shown in the warning only
  const descriptionIsNotice =
    isDeprecated(spec) && /deprecat/i.test(spec.description ?? "");

  return (
    <>
      <OperationPathHeader
        method={method}
        path={path}
        baseURL={baseURL}
        spec={spec}
      />

      {isDeprecated(spec) && (
        <DeprecationNotice
          description={descriptionIsNotice ? spec.description : undefined}
        />
      )}

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
        <LabeledValue>
          <Label className={styles.labelWithHelp}>
            Operation ID <OperationIdHelp />
          </Label>
          <Content>{spec.operationId}</Content>
          {/* Placed next to the value by the labeled value */}
          <CopyButton text={spec.operationId} />
        </LabeledValue>
      </ColumnLayout>
      {spec.description && withDescription && !descriptionIsNotice ? (
        <>
          {/* Without a description, the next section's separator follows */}
          <Separator />
          <Description>{spec.description}</Description>
        </>
      ) : null}
    </>
  );
}
