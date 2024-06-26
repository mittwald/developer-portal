import { APIVersion, useSpec } from "@site/src/openapi/specs";
import OperationDocCard from "@site/src/components/openapi/OperationDocCard";

interface Props {
  operationId: string;
  apiVersion?: APIVersion;
}

export default function OperationDocCardById({ operationId, apiVersion = "v2"}: Props) {
  const spec = useSpec(apiVersion);

  for (const path of Object.keys(spec.paths)) {
    for (const method of Object.keys(spec.paths[path])) {
      const operation = spec.paths[path][method];

      if (operation.operationId === operationId) {
        return (
          <OperationDocCard apiVersion={apiVersion} operation={{
            operation,
            path,
            method
          }} />
        )
      }
    }
  }

  return <>unknown operation <code>{operationId}</code></>
}