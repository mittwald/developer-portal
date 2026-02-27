import {
  Accordion,
  Action,
  ActionGroup,
  Button,
  CodeBlock,
  Content,
  FieldDescription,
  Heading,
  Label,
  Modal,
  ModalTrigger,
  Section,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TextArea,
  TextField,
} from "@mittwald/flow-react-components";
import React, { Fragment, useState } from "react";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import styles from "./index.module.css";
import { OpenAPIV3 } from "openapi-types";
import { generateSchemaExample } from "@site/src/openapi/generateSchemaExample";
import ResponseStatus from "@site/src/components/OperationPlayground/ResponseStatus";
import ParameterObject = OpenAPIV3.ParameterObject;

export interface OperationPlaygroundProps {
  path: string;
  method: string;
  spec: OpenAPIV3.OperationObject;
}

function OperationPath({
  path,
  onChange,
}: {
  path: string;
  onChange: (param: string, value: string) => void;
}) {
  const components = path.split("/");
  const parts = components.map((part, idx) => {
    if (part.startsWith("{")) {
      const paramName = part.slice(1, -1);
      return (
        <Fragment key={idx}>
          <TextField
            placeholder={paramName}
            onChange={(e) => onChange(paramName, e)}
          />
          <span className={styles.operationPathItem}>/</span>
        </Fragment>
      );
    }

    return (
      <Fragment key={idx}>
        <span className={styles.operationPathItem}>{part}</span>
        <span className={styles.operationPathItem}>/</span>
      </Fragment>
    );
  });

  return parts;
}

function OperationPlayground({ path, method, spec }: OperationPlaygroundProps) {
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string>(undefined);
  const [requestState, setRequestState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

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

  const executeRequest = () => {
    setRequestState("loading");

    // Construct the URL with path and query parameters
    let url = "https://api.mittwald.de" + path;
    for (const [param, value] of Object.entries(pathParams)) {
      url = url.replace(`{${param}}`, value);
    }

    const queryString = new URLSearchParams(queryParams).toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    (async () => {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      response.json().then((j) => {
        setResponseText(JSON.stringify(j, null, 2));
        setRequestState(response.ok ? "success" : "error");
        setResponse(response);
      });
    })();
  };

  const updatePathParam = (name: string, value: string) => {
    setPathParams((prev) => ({ ...prev, [name]: value }));
  };

  const updateQueryParam = (name: string, value: string) => {
    if (value === "") {
      value = undefined;
    }
    setQueryParams((prev) => ({ ...prev, [name]: value }));
  };

  const sections = [
    <Section key="request">
      <Heading>Request</Heading>
      <div className={styles.operationPath}>
        <HTTPMethod method={method} />
        <OperationPath path={path} onChange={updatePathParam} />
      </div>
    </Section>,
  ];

  const specQueryParams =
    (spec.parameters?.filter(
      (param) => (param as ParameterObject).in === "query",
    ) as ParameterObject[]) || [];

  if (specQueryParams.length > 0 && requestState === "idle") {
    sections.push(
      <Section key="query">
        <Heading>Query Parameters</Heading>
        {specQueryParams.map((param) => (
          <TextField
            onChange={(v) => updateQueryParam(param.name, v)}
            value={queryParams[param.name] ?? ""}
            placeholder={param.example}
          >
            <Label>{param.name}</Label>
            {param.description ? (
              <FieldDescription>{param.description}</FieldDescription>
            ) : undefined}
          </TextField>
        ))}
      </Section>,
    );
  }

  if (spec.requestBody && requestState === "idle") {
    if (
      "content" in spec.requestBody &&
      spec.requestBody.content["application/json"]?.schema
    ) {
      const schema = spec.requestBody.content["application/json"]
        .schema as OpenAPIV3.SchemaObject;

      const initialBody = JSON.stringify(
        generateSchemaExample(schema),
        null,
        2,
      );
      sections.push(
        <Section key="body">
          <Heading>Request Body</Heading>
          <TextArea
            onChange={setRequestBody}
            placeholder="Request body"
            autoResizeMaxRows={10}
            defaultValue={initialBody}
          />
        </Section>,
      );
    }
  }

  if ((response && requestState === "success") || requestState === "error") {
    const headersAsArray: [string, string][] = [];
    response.headers.forEach((v, k) => {
      headersAsArray.push([k, v]);
    });

    sections.push(
      <Section key="response">
        <Heading>Response</Heading>
        <ResponseStatus response={response} />
        <Accordion defaultExpanded={false} variant="outline">
          <Heading>Headers</Heading>
          <Content>
            <Table aria-label="Response headers">
              <TableHeader>
                <TableColumn>Header</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                {headersAsArray.map(([key, value], idx) => (
                  <TableRow key={idx}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Content>
        </Accordion>
        <Accordion defaultExpanded={true} variant="outline">
          <Heading>Response body</Heading>
          <Content>
            <CodeBlock code={responseText} copyable={true} />
          </Content>
        </Accordion>
      </Section>,
    );
  }

  return (
    <ModalTrigger>
      <Button>Try it out</Button>
      <Modal size="m" offCanvas>
        <Heading>API Playground</Heading>
        <Content>{sections}</Content>
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
