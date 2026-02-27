import React from "react";
import { OpenAPIV3 } from "openapi-types";
import RequestSection from "./RequestSection";
import QueryParametersSection from "./QueryParametersSection";
import RequestBodySection from "./RequestBodySection";
import ResponseSection from "./ResponseSection";
import PlaygroundActions from "./PlaygroundActions";
import { usePlaygroundRequest } from "./usePlaygroundRequest";
import ParameterObject = OpenAPIV3.ParameterObject;
import RequestBodyObject = OpenAPIV3.RequestBodyObject;
import {
  Content,
  Heading,
  Modal,
  ModalProps,
} from "@mittwald/flow-react-components";

export interface PlaygroundContentProps {
  /** The API endpoint path */
  path: string;
  /** The HTTP method */
  method: string;
  /** The OpenAPI operation specification */
  spec: OpenAPIV3.OperationObject;
  /** The API key for authorization */
  apiKey: string;
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
 * Main content area of the playground when an API key is configured.
 * Displays request configuration, parameters, body, and response.
 */
function PlaygroundContent({
  path,
  method,
  spec,
  apiKey,
  userEmail,
  isVerifying,
  verificationError,
  onSaveApiKey,
  onClearApiKey,
  ...modalProps
}: PlaygroundContentProps & ModalProps) {
  const {
    pathParams,
    queryParams,
    requestState,
    response,
    responseText,
    updatePathParam,
    updateQueryParam,
    setRequestBody,
    executeRequest,
    reset,
  } = usePlaygroundRequest({ path, method, apiKey });

  const specQueryParams =
    (spec.parameters?.filter(
      (param) => (param as ParameterObject).in === "query",
    ) as ParameterObject[]) || [];

  const showRequestInputs = requestState === "idle";
  const showResponse =
    response && (requestState === "success" || requestState === "error");

  const hasQueryParams = specQueryParams.length > 0;
  const hasRequestBody = spec.requestBody && "content" in spec.requestBody;

  return (
    <Modal {...modalProps}>
      <Heading>API Playground</Heading>
      <Content>
        <RequestSection
          path={path}
          method={method}
          pathParams={pathParams}
          onPathParamChange={updatePathParam}
          userEmail={userEmail}
          isVerifying={isVerifying}
          verificationError={verificationError}
          onSaveApiKey={onSaveApiKey}
          onClearApiKey={onClearApiKey}
        />

        {showRequestInputs && hasQueryParams && (
          <QueryParametersSection
            parameters={specQueryParams}
            queryParams={queryParams}
            onQueryParamChange={updateQueryParam}
          />
        )}

        {showRequestInputs && hasRequestBody && (
          <RequestBodySection
            requestBody={spec.requestBody as RequestBodyObject}
            onRequestBodyChange={setRequestBody}
          />
        )}

        {showResponse && (
          <ResponseSection response={response} responseText={responseText} />
        )}
      </Content>

      <PlaygroundActions
        requestState={requestState}
        onExecute={executeRequest}
        onReset={reset}
      />
    </Modal>
  );
}

export default PlaygroundContent;
