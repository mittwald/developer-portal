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
  parameters: ParameterObject[];
  queryParams: Record<string, string>;
  onQueryParamChange: (name: string, value: string) => void;
}

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
