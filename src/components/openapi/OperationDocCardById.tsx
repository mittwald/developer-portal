import { APIVersion, getOperationById, useSpec } from "@site/src/openapi/specs";
import OperationDocCard from "@site/src/components/openapi/OperationDocCard";

interface Props {
  operationId: string;
  apiVersion?: APIVersion;
}

export default function OperationDocCardById({
  operationId,
  apiVersion = "v2",
}: Props) {
  const spec = useSpec(apiVersion);
  const operation = getOperationById(spec, operationId);

  if (operation) {
    return <OperationDocCard apiVersion={apiVersion} operation={operation} />;
  }

  return (
    <>
      unknown operation <code>{operationId}</code>
    </>
  );
}
