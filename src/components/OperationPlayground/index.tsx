import { Button, ModalTrigger } from "@mittwald/flow-react-components";
import React from "react";
import { OpenAPIV3 } from "openapi-types";
import ApiKeyRequired from "./ApiKeyRequired";
import PlaygroundContent from "./PlaygroundContent";
import { useApiKey } from "./useApiKey";

export interface OperationPlaygroundProps {
  /** The API endpoint path, may contain path parameters like {id} */
  path: string;
  /** The HTTP method (GET, POST, PUT, DELETE, etc.) */
  method: string;
  /** The OpenAPI operation specification */
  spec: OpenAPIV3.OperationObject;
}

/**
 * Interactive API playground that allows users to test API endpoints directly
 * from the documentation. Renders a modal with request configuration and
 * displays the response. Requires an mStudio API key to be configured.
 */
function OperationPlayground({ path, method, spec }: OperationPlaygroundProps) {
  const {
    apiKey,
    userEmail,
    isVerifying,
    verificationError,
    saveApiKey,
    clearApiKey,
  } = useApiKey();

  return (
    <ModalTrigger>
      <Button>Try it out</Button>
      {!apiKey ? (
        <ApiKeyRequired
          isVerifying={isVerifying}
          error={verificationError}
          onSubmit={saveApiKey}
          size="m"
          offCanvas
        />
      ) : (
        <PlaygroundContent
          path={path}
          method={method}
          spec={spec}
          apiKey={apiKey}
          userEmail={userEmail}
          isVerifying={isVerifying}
          verificationError={verificationError}
          onSaveApiKey={saveApiKey}
          onClearApiKey={clearApiKey}
          size="m"
          offCanvas
        />
      )}
    </ModalTrigger>
  );
}

export default OperationPlayground;
