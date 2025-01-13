import { OpenAPIV3 } from "openapi-types";
import { ReactNode } from "react";
import styles from "./OperationInputValue.module.css";
import Type from "@site/src/components/openapi/Type";
import {
  Optional,
  Required,
} from "@site/src/components/openapi/RequiredOptional";
import Schema from "@site/src/components/openapi/Schema";
import Markdown from "react-markdown";

export function AlternativeValue({
  schema,
}: {
  schema: OpenAPIV3.SchemaObject;
}) {
  return (
    <li>
      <div className={styles.parameterListHeader}>
        <span className={styles.parameterAlternative}>Alternative</span>
        <Type className={styles.parameterType} schema={schema} />
      </div>
      <Schema schema={schema} />
    </li>
  );
}

export function ArrayValue({ schema }: { schema: OpenAPIV3.SchemaObject }) {
  let body: ReactNode;

  if (schema.description) {
    body = <Markdown>{schema.description}</Markdown>;
  }

  return (
    <li>
      <div className={styles.parameterListHeader}>
        <span className={styles.parameterAlternative}>Array[</span>
      </div>
      <div className={styles.parameterListBody}>{body}</div>
      <PropertyValue name="*" schema={schema} required={false} />
      <div className={styles.parameterListHeader}>
        <span className={styles.parameterAlternative}>]</span>
      </div>
    </li>
  );
}

export function PropertyValue({
  name,
  schema,
  required,
}: {
  name: string;
  schema: any;
  required: boolean;
}) {
  const requiredOrOptional = required ? <Required /> : undefined;
  let body: ReactNode;

  if (schema.description) {
    body = <Markdown>{schema.description}</Markdown>;
  }

  const hasSubSchema =
    schema.properties ||
    schema.additionalProperties ||
    schema.items ||
    schema.oneOf;

  return (
    <li key={name}>
      <div className={styles.parameterListHeader}>
        <span className={styles.parameterName}>{name}</span>
        <Type className={styles.parameterType} schema={schema} />
        <div className={styles.parameterListHeaderSpacer} />
        {requiredOrOptional}
      </div>
      <div className={styles.parameterListBody}>{body}</div>
      {hasSubSchema && <Schema schema={schema} />}
    </li>
  );
}

export function OperationInputValue({
  name,
  schema,
  required,
  body,
}: {
  name: string;
  schema: OpenAPIV3.SchemaObject;
  required: boolean | undefined;
  body: ReactNode;
}) {
  return (
    <li>
      <div className={styles.parameterListHeader}>
        <span className={styles.parameterName}>{name}</span>
        <Type className={styles.parameterType} schema={schema} />
        {required !== undefined && (
          <>
            <div className={styles.parameterListHeaderSpacer} />
            {required ? <Required /> : <Optional />}
          </>
        )}
      </div>
      <div className={styles.parameterListBody}>{body}</div>
    </li>
  );
}

export default OperationInputValue;
