import { OpenAPIV3 } from "openapi-types";

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
        array of <Type schema={schema.items as OpenAPIV3.SchemaObject} />
      </span>
    );
  }

  if (schema.oneOf !== undefined) {
    return (
      <span className={className}>
        one of {schema.oneOf.length} alternatives
      </span>
    );
  }

  const addendums = [];
  if (schema.minimum !== undefined) {
    addendums.push(`≥ ${schema.minimum}`);
  }

  if (schema.minLength !== undefined) {
    addendums.push(`≥ ${schema.minLength} characters`);
  }

  if (schema.maxLength !== undefined) {
    addendums.push(`≤ ${schema.maxLength} characters`);
  }

  if (schema.format !== undefined) {
    addendums.push(schema.format);
  }

  if (schema.enum !== undefined) {
    if (schema.enum.length === 1 && typeof schema.enum[0] === "string") {
      return <span className={className}>"{schema.enum[0]}"</span>;
    }
    addendums.push(`one of: ${schema.enum.join(", ")}`);
  }

  if (addendums.length > 0) {
    return (
      <span className={className}>
        {schema.type} ({addendums.join(", ")})
      </span>
    );
  }

  return <span className={className}>{schema.type}</span>;
}

export default Type;
