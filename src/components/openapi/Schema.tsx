import styles from "@site/src/components/openapi/OperationReference.module.css";
import Type from "@site/src/components/openapi/Type";
import { Optional, Required } from "@site/src/components/openapi/RequiredOptional";
import Markdown from "react-markdown";
import { ReactNode } from "react";
import { OpenAPIV3 } from "openapi-types";

function Alternative({key, schema}: {key: number; schema: any}) {
  const body = [];

  return <li key={key}>
    <div className={styles.parameterListHeader}>
      <span className={styles.parameterAlternative}>Alternative</span>
      <Type className={styles.parameterType} schema={schema} />
    </div>
    <div className={styles.parameterListBody}>
      {body}
    </div>
    <Schema schema={schema} />
  </li>;
}

function Array({key, schema}: {key: number; schema: OpenAPIV3.SchemaObject}) {
  const body = [];

  return <li key={key}>
    <div className={styles.parameterListHeader}>
      <span className={styles.parameterAlternative}>Array[</span>
    </div>
    <div className={styles.parameterListBody}>
      {body}
    </div>
    <Schema schema={schema} />
    <div className={styles.parameterListHeader}>
      <span className={styles.parameterAlternative}>]</span>
    </div>
  </li>;
}

function Property({name, schema, required}: {name: string, schema: any, required: boolean}) {
  const requiredOrOptional = required ? <Required /> : undefined;
  let body: ReactNode;

  if (schema.description) {
    body = <Markdown>{schema.description}</Markdown>;
  }

  return <li key={name}>
    <div className={styles.parameterListHeader}>
      <span className={styles.parameterName}>{name}</span>
      <Type className={styles.parameterType} schema={schema} />
      <div className={styles.parameterListHeaderSpacer} />
      {requiredOrOptional}
    </div>
    <div className={styles.parameterListBody}>
      {body}
    </div>
    <Schema schema={schema} />
  </li>;
}

function Schema({ schema }: { schema: OpenAPIV3.SchemaObject}) {
  if (schema.type === "object" || schema.properties !== undefined || schema.additionalProperties !== undefined) {
    let properties: ReactNode[] = [];

    if (schema.properties) {
      properties.push(Object.entries(schema.properties).map(([name, property], idx) => <Property key={idx} name={name} schema={property} required={(schema.required ?? []).indexOf(name) >= 0} />));
    }

    if (schema.additionalProperties) {
      properties.push(<Property key="additionalProperties" name="*" schema={schema.additionalProperties} required={false} />);
    }

    return <ul className={styles.parameterList}>
      {properties}
    </ul>;
  }

  if (schema.oneOf !== undefined) {
    return <ul className={styles.parameterList}>
      {schema.oneOf.map((s: any, idx: number) => <Alternative key={idx} schema={s} />)}
    </ul>;

  }

  if (schema.type === "array") {
    return <ul className={styles.parameterList}>
      <Array schema={schema.items as OpenAPIV3.SchemaObject} required={false} />
    </ul>;
  }
}

export default Schema;