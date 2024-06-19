import styles from "@site/src/components/openapi/OperationReference.module.css";
import { ReactNode } from "react";
import { OpenAPIV3 } from "openapi-types";
import {
  AlternativeValue,
  ArrayValue,
  PropertyValue,
} from "@site/src/components/openapi/OperationInputValue";

function Schema({ schema }: { schema: OpenAPIV3.SchemaObject }) {
  if (
    schema.type === "object" ||
    schema.properties !== undefined ||
    schema.additionalProperties !== undefined
  ) {
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

  if (schema.oneOf !== undefined) {
    return (
      <ul className={styles.parameterList}>
        {schema.oneOf.map((s: any, idx: number) => (
          <AlternativeValue key={idx} schema={s} />
        ))}
      </ul>
    );
  }

  if (schema.type === "array") {
    return (
      <ul className={styles.parameterList}>
        <ArrayValue
          schema={schema.items as OpenAPIV3.SchemaObject}
          required={false}
        />
      </ul>
    );
  }
}

export default Schema;
