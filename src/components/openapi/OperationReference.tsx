import styles from "./OperationReference.module.css";
import { Fragment, ReactNode } from "react";
import Markdown from "react-markdown";
import CodeBlock from "@theme/CodeBlock";
import { OpenAPIV3 } from "openapi-types";
import Schema from "@site/src/components/openapi/Schema";
import Type from "@site/src/components/openapi/Type";
import { Optional, Required } from "@site/src/components/openapi/RequiredOptional";
import Translate, { translate } from "@docusaurus/Translate";
import HTTPResponseStatus from "@site/src/components/openapi/HTTPResponseStatus";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import SchemaExample from "@site/src/components/openapi/SchemaExample";
import Accordion from "@mittwald/flow-react-components/Accordion";
import Heading from "@mittwald/flow-react-components/Heading";
import Content from "@mittwald/flow-react-components/Content";
import Text from "@mittwald/flow-react-components/Content";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";
import ParameterObject = OpenAPIV3.ParameterObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;
import ResponseObject = OpenAPIV3.ResponseObject;

function OperationPath({ path }: { path: string }) {
  const components = path.split("/");
  const parts = components.map((part, index) => {
    if (part.startsWith("{")) {
      return <Fragment key={index}><span className={styles.variableLinkParameter}>{part}</span>/</Fragment>;
    }
    return <Fragment key={index}><span>{part}</span>/</Fragment>;
  });

  return <>{parts}</>;
}

function OperationValue({ name, schema, required, body }: {
  name: string,
  schema: OpenAPIV3.SchemaObject,
  required: boolean | undefined,
  body: ReactNode
}) {

  return <li>
    <div className={styles.parameterListHeader}>
      <span className={styles.parameterName}>{name}</span>
      <Type className={styles.parameterType} schema={schema} />
      {required !== undefined && <>
        <div className={styles.parameterListHeaderSpacer} />
        {required ? <Required /> : <Optional />}
      </>}
    </div>
    <div className={styles.parameterListBody}>
      {body}
    </div>
  </li>;
}

function OperationParameter({ param }: { param: ParameterObject }) {
  const body = [];

  if (param.description) {
    body.push(<Markdown>{param.description}</Markdown>);
  }

  if (param.example) {
    body.push(<div><span className={styles.parameterExample}>Example:</span>
      <code>{JSON.stringify(param.example)}</code></div>);
  }

  return <OperationValue name={param.name} schema={param.schema as OpenAPIV3.SchemaObject} required={param.required}
                         body={body} />;
}

function OperationResponseHeader({ name, header }: { name: string; header: OpenAPIV3.HeaderObject }) {
  const body = [];

  if (header.description) {
    body.push(<Markdown>{header.description}</Markdown>);
  }

  return <OperationValue name={name} schema={header.schema as OpenAPIV3.SchemaObject} required={header.required}
                         body={body} />;
}

function OperationParameterList({ title, params }: { title: string, params: ParameterObject[] }) {
  if (params.length === 0) {
    return undefined;
  }

  const hasRequired = params.some((param) => param.required);

  return <Accordion>
    <Heading><div style={{flexGrow: 1}}>{title}</div> {hasRequired ? <Required /> : undefined}</Heading>
    <Content>
    <ul className={styles.parameterList}>
      {params.map((param, idx) => <OperationParameter key={idx} param={param} />)}
    </ul>
    </Content>
  </Accordion>;
}

function OperationResponseHeaderList({ title, headers }: {
  title: string,
  headers: Record<string, OpenAPIV3.HeaderObject>
}) {
  if (Object.keys(headers || {}).length === 0) {
    return undefined;
  }

  return <>
    <h4>{title}</h4>
    <ul className={styles.parameterList}>
      {Object.entries(headers).map(([name, header], idx: number) => <OperationResponseHeader key={idx} name={name}
                                                                                             header={header} />)}
    </ul>
  </>;
}

function isParameterObject(param: ReferenceObject | ParameterObject): param is ParameterObject {
  return (param as ParameterObject).name !== undefined;
}

function OperationRequestBody({ title, spec }: { title: string, spec: OpenAPIV3.RequestBodyObject | undefined }) {
  if (!spec) {
    return null;
  }

  const required = spec.required ? <Required /> : <Optional />;

  if ("application/json" in spec.content) {
    return <Accordion>
      <Heading><div style={{flexGrow: 1}}>{title}</div>{required}</Heading>
      <Content>
      <p>Format: <code>application/json</code></p>
      <Tabs groupId="request-body" defaultValue="schema">
        <TabItem value="schema" label="Schema">
          <Schema schema={spec.content["application/json"].schema} />
        </TabItem>
        <TabItem value="example" label="Example">
          <SchemaExample schema={spec.content["application/json"].schema} />
        </TabItem>
      </Tabs>
      </Content>
    </Accordion>;
  }

}

function OperationResponseBody({ title, spec }: { title: string, spec: OpenAPIV3.ResponseObject | undefined }) {
  if (!spec) {
    return null;
  }

  if (!spec.content) {
    return <>
      <Text><Translate id={"openapi.operation.response.nocontent"}>No response content specified.</Translate></Text>
    </>;
  }

  if ("application/json" in spec.content) {
    return <>
      <ColumnLayout m={[1, 5]}>
        <LabeledValue>
          <Label>Format</Label>
          <Content>application/json</Content>
        </LabeledValue>
        <LabeledValue>
          <Label><Translate id="openapi.operation.response.description">Description</Translate></Label>
          <Content>
            <Markdown>{spec.description}</Markdown>
          </Content>
        </LabeledValue>
      </ColumnLayout>

      <Tabs groupId="request-body" defaultValue="schema">
        <TabItem value="schema" label="Schema">
          <Schema schema={spec.content["application/json"].schema} />
        </TabItem>
        <TabItem value="example" label="Example">
          <SchemaExample schema={spec.content["application/json"].schema} />
        </TabItem>
      </Tabs>
    </>;
  }

}

export function OperationRequest({ spec }: { spec: OpenAPIV3.OperationObject }) {
  const parameters = (spec.parameters ?? []).filter(isParameterObject);

  const pathParameters = parameters.filter((param) => param.in === "path");
  const queryParameters = parameters.filter((param) => param.in === "query");
  const headerParameters = parameters.filter((param) => param.in === "header");

  if (spec.requestBody === undefined && parameters.length === 0) {
    return <>
      <p><Translate key="openapi.operation.request.empty">No request parameters.</Translate></p>
    </>;
  }

  return <>
    <OperationParameterList
      title={translate({ id: "openapi.operation.request.pathparams", message: "Path parameters" })}
      params={pathParameters} />
    <OperationParameterList
      title={translate({ id: "openapi.operation.request.queryparams", message: "Query parameters" })}
      params={queryParameters} />
    <OperationParameterList
      title={translate({ id: "openapi.operation.request.headerparams", message: "Header parameters" })}
      params={headerParameters} />
    <OperationRequestBody title={translate({ id: "openapi.operation.request.body", message: "Request body" })}
                          spec={spec.requestBody as OpenAPIV3.RequestBodyObject} />
  </>;
}

function OperationResponse({ status, response }: { status: string; response: OpenAPIV3.ResponseObject }) {
  return <>
    <OperationResponseHeaderList
      title={translate({ id: "openapi.operation.response.headers", message: "Response headers" })}
      headers={response.headers as Record<string, OpenAPIV3.HeaderObject>} />
    <OperationResponseBody title={translate({ id: "openapi.operation.response.body", message: "Response body" })}
                           spec={response} code={status} />
  </>;
}

export function OperationResponses({ spec }: { spec: OpenAPIV3.OperationObject }) {
  const responseCodes = Object.keys(spec.responses);
  return <>
    {responseCodes.map((status) => (
      <Accordion key={status} defaultExpanded={status.startsWith("2")}>
        <Heading><HTTPResponseStatus code={status} /></Heading>
        <Content>
          <OperationResponse key={status} status={status}
                             response={spec.responses[status] as ResponseObject} />
        </Content>
      </Accordion>
    ))}
  </>;
}

export function OperationMetadata({ method, path, spec }: {
  path: string,
  method: string,
  spec: OpenAPIV3.OperationObject
}) {
  return <>
    <pre>{method.toUpperCase()} <OperationPath path={path} /></pre>

    <ColumnLayout m={[1, 5]}>
      <LabeledValue>
        <Label>API version</Label>
        <Content>{path.split("/").filter(p => p.startsWith("v"))[0]}</Content>
      </LabeledValue>
      <LabeledValue>
        <Label>Request method</Label>
        <Content>{method.toUpperCase()}</Content>
      </LabeledValue>
    </ColumnLayout>
    <hr />
    {spec.description ? <Markdown>{spec.description}</Markdown> : null}
  </>;
}

function OperationReference({ path, method, spec }: { path: string, method: string, spec: OpenAPIV3.OperationObject }) {
  return <>
    <OperationMetadata path={path} method={method} spec={spec} />
    <OperationRequest spec={spec} />
    <OperationResponses spec={spec} />

    <h2>Complete OpenAPI spec</h2>
    <CodeBlock language="json">{JSON.stringify(spec, null, 2)}</CodeBlock>
  </>;
}

export default OperationReference;