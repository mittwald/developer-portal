import { Heading, Section } from "@mittwald/flow-react-components";
import Translate from "@docusaurus/Translate";
import React from "react";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import OperationPath from "./OperationPath";
import ApiKeyInfo from "./ApiKeyInfo";
import styles from "./index.module.css";

export interface RequestSectionProps {
  /** The API endpoint path */
  path: string;
  /** The HTTP method */
  method: string;
  /** Current path parameter values */
  pathParams: Record<string, string>;
  /** Callback when a path parameter changes */
  onPathParamChange: (name: string, value: string) => void;
  /** The user's email address */
  userEmail: string;
  /** Whether API key verification is in progress */
  isVerifying: boolean;
  /** Error message from verification */
  verificationError: string | undefined;
  /** Callback to save a new API key */
  onSaveApiKey: (key: string) => Promise<boolean>;
  /** Callback to clear the stored API key */
  onClearApiKey: () => void;
}

/**
 * Displays the request method, path with editable parameters,
 * and the current API key information.
 */
function RequestSection({
  path,
  method,
  pathParams,
  onPathParamChange,
  userEmail,
  isVerifying,
  verificationError,
  onSaveApiKey,
  onClearApiKey,
}: RequestSectionProps) {
  return (
    <Section>
      <Heading>
        <Translate id="playground.request.title">Request</Translate>
      </Heading>
      <div className={styles.operationPath}>
        <HTTPMethod method={method} />
        <OperationPath
          path={path}
          values={pathParams}
          onChange={onPathParamChange}
        />
      </div>
      <ApiKeyInfo
        userEmail={userEmail}
        isVerifying={isVerifying}
        verificationError={verificationError}
        onSaveApiKey={onSaveApiKey}
        onClearApiKey={onClearApiKey}
      />
    </Section>
  );
}

export default RequestSection;
