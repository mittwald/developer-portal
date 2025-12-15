import styles from "./OperationReference.module.css";
import { PropsWithChildren } from "react";
import Markdown from "react-markdown";
import CodeBlock from "@theme/CodeBlock";
import { OpenAPIV3 } from "openapi-types";
import {
  Optional,
  Required,
} from "@site/src/components/openapi/RequiredOptional";
import Translate, { translate } from "@docusaurus/Translate";
import HTTPResponseStatus from "@site/src/components/openapi/HTTPResponseStatus";
import { Accordion, AlertBadge } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";
import OperationInputValue from "@site/src/components/openapi/OperationInputValue";
import { OperationMetadata } from "@site/src/components/openapi/OperationMetadata";
import ParameterObject = OpenAPIV3.ParameterObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;
import ResponseObject = OpenAPIV3.ResponseObject;
import SchemaWithExample from "@site/src/components/openapi/SchemaWithExample";
import SchemaObject = OpenAPIV3.SchemaObject;
import React from "react";
import ExampleObject = OpenAPIV3.ExampleObject;

function OutlinedAccordion({
  children,
  defaultExpanded,
}: PropsWithChildren<{ defaultExpanded?: boolean }>) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      variant="outline"
      style={{ marginBottom: "1em" }}
    >
      {children}
    </Accordion>
  );
}

function OperationParameter({ param }: { param: ParameterObject }) {
  const body = [];

  if (param.description) {
    body.push(<Markdown key="description">{param.description}</Markdown>);
  }

  if (param.example) {
    body.push(
      <div key="example">
        <span className={styles.parameterExample}>
          <Translate id="openapi.example">Example</Translate>:
        </span>
        <code>{JSON.stringify(param.example)}</code>
      </div>,
    );
  }

  return (
    <OperationInputValue
      name={param.name}
      schema={param.schema as OpenAPIV3.SchemaObject}
      required={param.required}
      deprecated={param.deprecated}
      body={body}
    />
  );
}

function OperationResponseHeader({
  name,
  header,
}: {
  name: string;
  header: OpenAPIV3.HeaderObject;
}) {
  const body = [];

  if (header.description) {
    body.push(<Markdown>{header.description}</Markdown>);
  }

  return (
    <OperationInputValue
      name={name}
      schema={header.schema as OpenAPIV3.SchemaObject}
      required={header.required}
      deprecated={header.deprecated}
      body={body}
    />
  );
}

function OperationParameterList({
  title,
  params,
  expanded,
}: {
  title: string;
  params: ParameterObject[];
  expanded: boolean;
}) {
  if (params.length === 0) {
    return undefined;
  }

  const hasRequired = params.some((param) => param.required);

  return (
    <OutlinedAccordion defaultExpanded={expanded}>
      <Heading>
        <div style={{ flexGrow: 1 }}>{title}</div>{" "}
        {hasRequired ? <Required /> : undefined}
      </Heading>
      <Content>
        <ul className={styles.parameterList} style={{ marginBottom: "1rem" }}>
          {params.map((param, idx) => (
            <OperationParameter key={idx} param={param} />
          ))}
        </ul>
      </Content>
    </OutlinedAccordion>
  );
}

function OperationResponseHeaderList({
  title,
  headers,
}: {
  title: string;
  headers: Record<string, OpenAPIV3.HeaderObject>;
}) {
  if (Object.keys(headers || {}).length === 0) {
    return undefined;
  }

  return (
    <>
      <h4>{title}</h4>
      <ul className={styles.parameterList}>
        {Object.entries(headers).map(([name, header], idx: number) => (
          <OperationResponseHeader key={idx} name={name} header={header} />
        ))}
      </ul>
    </>
  );
}

function isParameterObject(
  param: ReferenceObject | ParameterObject,
): param is ParameterObject {
  return (param as ParameterObject).name !== undefined;
}

function OperationRequestBody({
  title,
  spec,
}: {
  title: string;
  spec: OpenAPIV3.RequestBodyObject | undefined;
}) {
  if (!spec) {
    return null;
  }

  const required = spec.required ? <Required /> : <Optional />;

  if ("multipart/form-data" in spec.content) {
    return (
      <OutlinedAccordion>
        <Heading>
          <div style={{ flexGrow: 1 }}>{title}</div>
          <AlertBadge status={"info"}>multipart/form-data</AlertBadge>
          {required}
        </Heading>
        <Content>
          <SchemaWithExample
            schema={spec.content["multipart/form-data"].schema as SchemaObject}
            format="multipart-form"
            withHeaders
          />
        </Content>
      </OutlinedAccordion>
    );
  }

  if ("application/json" in spec.content) {
    const body = spec.content["application/json"];
    return (
      <OutlinedAccordion>
        <Heading>
          <div style={{ flexGrow: 1 }}>{title}</div>
          <AlertBadge status={"info"}>application/json</AlertBadge>
          {required}
        </Heading>
        <Content>
          <SchemaWithExample
            schema={body.schema as SchemaObject}
            examples={body.examples as Record<string, ExampleObject>}
            withRawJSONSchema
            withHeaders
          />
        </Content>
      </OutlinedAccordion>
    );
  }
}

function OperationResponseBody({ spec }: { spec?: OpenAPIV3.ResponseObject }) {
  if (!spec) {
    return null;
  }

  if (!spec.content) {
    return (
      <>
        <Text>
          <Translate id={"openapi.operation.response.nocontent"}>
            No response content specified.
          </Translate>
        </Text>
      </>
    );
  }

  if ("application/json" in spec.content) {
    return (
      <>
        <ColumnLayout m={[1, 5]}>
          <LabeledValue>
            <Label>Format</Label>
            <Content>application/json</Content>
          </LabeledValue>
          <LabeledValue>
            <Label>
              <Translate id="openapi.operation.response.description">
                Description
              </Translate>
            </Label>
            <Content>
              <Markdown>{spec.description}</Markdown>
            </Content>
          </LabeledValue>
        </ColumnLayout>

        <SchemaWithExample
          schema={spec.content["application/json"].schema as SchemaObject}
          withRawJSONSchema
          withHeaders
        />
      </>
    );
  }
}

export function OperationRequest({
  spec,
}: {
  spec: OpenAPIV3.OperationObject;
}) {
  const parameters = (spec.parameters ?? []).filter(isParameterObject);

  const pathParameters = parameters.filter((param) => param.in === "path");
  const queryParameters = parameters.filter((param) => param.in === "query");
  const headerParameters = parameters.filter((param) => param.in === "header");

  if (spec.requestBody === undefined && parameters.length === 0) {
    return (
      <>
        <p>
          <Translate key="openapi.operation.request.empty">
            No request parameters.
          </Translate>
        </p>
      </>
    );
  }

  return (
    <>
      <OperationParameterList
        title={translate({
          id: "openapi.operation.request.pathparams",
          message: "Path parameters",
        })}
        params={pathParameters}
        expanded={true}
      />
      <OperationParameterList
        title={translate({
          id: "openapi.operation.request.queryparams",
          message: "Query parameters",
        })}
        params={queryParameters}
        expanded={false}
      />
      <OperationParameterList
        title={translate({
          id: "openapi.operation.request.headerparams",
          message: "Header parameters",
        })}
        params={headerParameters}
        expanded={false}
      />
      <OperationRequestBody
        title={translate({
          id: "openapi.operation.request.body",
          message: "Request body",
        })}
        spec={spec.requestBody as OpenAPIV3.RequestBodyObject}
      />
    </>
  );
}

function OperationResponse({
  response,
}: {
  response: OpenAPIV3.ResponseObject;
}) {
  return (
    <>
      <OperationResponseHeaderList
        title={translate({
          id: "openapi.operation.response.headers",
          message: "Response headers",
        })}
        headers={response.headers as Record<string, OpenAPIV3.HeaderObject>}
      />
      <OperationResponseBody spec={response} />
    </>
  );
}

export function OperationResponses({
  spec,
}: {
  spec: OpenAPIV3.OperationObject;
}) {
  const responseCodes = Object.keys(spec.responses);
  return (
    <>
      {responseCodes.map((status) => (
        <OutlinedAccordion
          key={status}
          defaultExpanded={status.startsWith("2")}
        >
          <Heading>
            <HTTPResponseStatus code={status} />
          </Heading>
          <Content>
            <OperationResponse
              key={status}
              response={spec.responses[status] as ResponseObject}
            />
          </Content>
        </OutlinedAccordion>
      ))}
    </>
  );
}

function OperationReference({
  path,
  method,
  spec,
  baseURL,
}: {
  path: string;
  method: string;
  spec: OpenAPIV3.OperationObject;
  baseURL: string;
}) {
  return (
    <>
      <OperationMetadata
        path={path}
        method={method}
        spec={spec}
        baseURL={baseURL}
      />
      <OperationRequest spec={spec} />
      <OperationResponses spec={spec} />

      <h2>Complete OpenAPI spec</h2>
      <CodeBlock language="json">{JSON.stringify(spec, null, 2)}</CodeBlock>
    </>
  );
}

export default OperationReference;
