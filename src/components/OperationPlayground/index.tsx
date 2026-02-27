import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  ModalTrigger,
  Section,
} from "@mittwald/flow-react-components";
import React, { useState } from "react";
import { OpenAPIV3 } from "openapi-types";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import OperationPath from "./OperationPath";
import QueryParametersSection from "./QueryParametersSection";
import RequestBodySection from "./RequestBodySection";
import ResponseSection from "./ResponseSection";
import styles from "./index.module.css";
import ParameterObject = OpenAPIV3.ParameterObject;
import RequestBodyObject = OpenAPIV3.RequestBodyObject;

export interface OperationPlaygroundProps {
  /** The API endpoint path, may contain path parameters like {id} */
  path: string;
  /** The HTTP method (GET, POST, PUT, DELETE, etc.) */
  method: string;
  /** The OpenAPI operation specification */
  spec: OpenAPIV3.OperationObject;
}

type RequestState = "idle" | "loading" | "success" | "error";

/**
 * Interactive API playground that allows users to test API endpoints directly
 * from the documentation. Renders a modal with request configuration and
 * displays the response.
 */
function OperationPlayground({ path, method, spec }: OperationPlaygroundProps) {
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string>(undefined);
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [response, setResponse] = useState<Response>(null);
  const [responseText, setResponseText] = useState<string>("");

  const reset = () => {
    setPathParams({});
    setQueryParams({});
    setRequestBody(undefined);
    setRequestState("idle");
    setResponse(null);
    setResponseText("");
  };

  const executeRequest = async () => {
    setRequestState("loading");

    let url = "https://api.mittwald.de" + path;
    for (const [param, value] of Object.entries(pathParams)) {
      url = url.replace(`{${param}}`, value);
    }

    const queryString = new URLSearchParams(queryParams).toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    const json = await response.json();
    setResponseText(JSON.stringify(json, null, 2));
    setRequestState(response.ok ? "success" : "error");
    setResponse(response);
  };

  const updatePathParam = (name: string, value: string) => {
    setPathParams((prev) => ({ ...prev, [name]: value }));
  };

  const updateQueryParam = (name: string, value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

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
    <ModalTrigger>
      <Button>Try it out</Button>
      <Modal size="m" offCanvas>
        <Heading>API Playground</Heading>
        <Content>
          <Section>
            <Heading>Request</Heading>
            <div className={styles.operationPath}>
              <HTTPMethod method={method} />
              <OperationPath path={path} onChange={updatePathParam} />
            </div>
          </Section>

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
        <ActionGroup>
          <Action onAction={executeRequest}>
            <Button
              isPending={requestState === "loading"}
              isSucceeded={requestState === "success"}
              isFailed={requestState === "error"}
              color="accent"
            >
              Execute request
            </Button>
          </Action>
          <Action onAction={reset}>
            <Button variant="soft" color="secondary" slot="secondary">
              Reset
            </Button>
          </Action>
          <Action closeModal>
            <Button variant="soft" color="secondary" slot="secondary">
              Cancel
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  );
}

export default OperationPlayground;
