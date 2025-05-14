import styles from "@site/src/components/openapi/OperationReference.module.css";
import { ReactNode } from "react";
import { OpenAPIV3 } from "openapi-types";
import {
  AlternativeValue,
  ArrayValue,
  PropertyValue,
} from "@site/src/components/openapi/OperationInputValue";
import React from "react";

type Props<TSchema = OpenAPIV3.SchemaObject> = {
  schema: TSchema;
};

function isObjectSchema(schema: OpenAPIV3.SchemaObject): boolean {
  return (
    schema.type === "object" ||
    schema.properties !== undefined ||
    schema.additionalProperties !== undefined
  );
}

function ObjectSchema({ schema }: Props) {
  let properties: ReactNode[] = [];

  if (schema.properties) {
    properties.push(
      Object.entries(schema.properties).map(([name, property], idx) => (
        <PropertyValue
          key={idx}
          name={name}
          schema={property}
          required={(schema.required ?? []).indexOf(name) >= 0}
        />
      )),
    );
  }

  if (schema.additionalProperties) {
    properties.push(
      <PropertyValue
        key="additionalProperties"
        name="*"
        schema={schema.additionalProperties}
        required={false}
      />,
    );
  }

  return <ul className={styles.parameterList}>{properties}</ul>;
}

function ArraySchema({ schema }: Props<OpenAPIV3.ArraySchemaObject>) {
  return (
    <ul className={styles.parameterList}>
      <ArrayValue schema={schema.items as OpenAPIV3.SchemaObject} />
    </ul>
  );
}

function OneOfSchema({ schema }: Props) {
  return (
    <ul className={styles.parameterList}>
      {schema.oneOf.map((s: any, idx: number) => (
        <AlternativeValue key={idx} schema={s} />
      ))}
    </ul>
  );
}

/**
 * Renders a graphical representation of an OpenAPI-style JSON schema.
 *
 * @param schema The schema for which a documentation should be rendered
 * @constructor
 */
export default function Schema({ schema }: Props) {
  if (isObjectSchema(schema)) {
    return <ObjectSchema schema={schema} />;
  }

  if (schema.oneOf !== undefined) {
    return <OneOfSchema schema={schema} />;
  }

  if (schema.type === "array") {
    return <ArraySchema schema={schema} />;
  }

  return <PropertyValue name="*" schema={schema} required={false} />;
}
