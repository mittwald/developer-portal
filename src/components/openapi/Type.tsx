import { OpenAPIV3 } from "openapi-types";
import React from "react";
import { translate } from "@docusaurus/Translate";

function characters(count: number): string {
  return translate(
    { id: "openapi.schema.characters", message: "{count} characters" },
    { count },
  );
}

function Type({
  schema,
  className,
}: {
  schema: OpenAPIV3.SchemaObject;
  className?: string;
}) {
  if (schema.type === "array") {
    return (
      <span className={className}>
        {"array of "}
        <Type schema={schema.items as OpenAPIV3.SchemaObject} />
      </span>
    );
  }

  if (schema.oneOf !== undefined) {
    return (
      <span className={className}>
        {translate(
          {
            id: "openapi.schema.oneof",
            message: "one of {count} alternatives",
          },
          { count: schema.oneOf.length },
        )}
      </span>
    );
  }

  const addendums = [];
  if (schema.minimum !== undefined) {
    addendums.push(`≥ ${schema.minimum}`);
  }

  if (schema.minLength !== undefined) {
    addendums.push(`≥ ${characters(schema.minLength)}`);
  }

  if (schema.maxLength !== undefined) {
    addendums.push(`≤ ${characters(schema.maxLength)}`);
  }

  if (schema.format !== undefined) {
    addendums.push(schema.format);
  }

  if (schema.enum !== undefined) {
    if (schema.enum.length === 1 && typeof schema.enum[0] === "string") {
      return <span className={className}>{`"${schema.enum[0]}"`}</span>;
    }
    addendums.push(
      translate(
        { id: "openapi.schema.enum", message: "one of: {values}" },
        { values: schema.enum.join(", ") },
      ),
    );
  }

  if (addendums.length > 0) {
    return (
      <span className={className}>
        {`${schema.type} (${addendums.join(", ")})`}
      </span>
    );
  }

  return <span className={className}>{schema.type}</span>;
}

export default Type;
