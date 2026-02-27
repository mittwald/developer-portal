import {
  FieldDescription,
  Heading,
  Label,
  Section,
  TextField,
} from "@mittwald/flow-react-components";
import React from "react";
import { OpenAPIV3 } from "openapi-types";
import ParameterObject = OpenAPIV3.ParameterObject;

export interface QueryParametersSectionProps {
  /** OpenAPI parameter definitions for query parameters */
  parameters: ParameterObject[];
  /** Current values of query parameters */
  queryParams: Record<string, string>;
  /** Callback fired when a query parameter value changes */
  onQueryParamChange: (name: string, value: string) => void;
}

/**
 * Renders input fields for all query parameters defined in the OpenAPI spec.
 * Each field displays the parameter name, description (if available), and
 * example value as placeholder text.
 */
function QueryParametersSection({
  parameters,
  queryParams,
  onQueryParamChange,
}: QueryParametersSectionProps) {
  if (parameters.length === 0) {
    return null;
  }

  return (
    <Section>
      <Heading>Query Parameters</Heading>
      {parameters.map((param) => (
        <TextField
          key={param.name}
          onChange={(v) => onQueryParamChange(param.name, v)}
          value={queryParams[param.name] ?? ""}
          placeholder={param.example}
        >
          <Label>{param.name}</Label>
          {param.description ? (
            <FieldDescription>{param.description}</FieldDescription>
          ) : undefined}
        </TextField>
      ))}
    </Section>
  );
}

export default QueryParametersSection;
