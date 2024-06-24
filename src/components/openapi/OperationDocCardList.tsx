import { APIVersion, getOperationByTag, useSpec } from "@site/src/openapi/specs";
import OperationDocCard from "@site/src/components/openapi/OperationDocCard";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";

interface Props {
  apiVersion: APIVersion;
  tag: string;
}

export default function OperationDocCardList(p: Props) {
  const spec = useSpec(p.apiVersion);
  const operations = getOperationByTag(spec, p.tag);

  const cards = operations.map((operation) => {
    return <OperationDocCard
      key={operation.operation.operationId}
      apiVersion={p.apiVersion}
      operation={operation}
    />;
  });

  return <ColumnLayout s={[1]} l={[1,1]}>{cards}</ColumnLayout>;
}