import { APIVersion, OperationWithMeta } from "@site/src/openapi/specs";
import { PropsWithChildren } from "react";
import buildDocumentId from "@site/src/openapi/buildDocumentId";
import Link from "@docusaurus/Link";

type Props = PropsWithChildren<{
  apiVersion: APIVersion;
  operation: OperationWithMeta;
}>;

export default function OperationLink(p: Props) {
  const { apiVersion } = p;
  const { operation } = p.operation;
  const docId = buildDocumentId(operation);
  const url = apiVersion.endsWith("-preview")
    ? `/docs/${apiVersion.replace("-preview", "")}/preview/${docId.replace("reference/", "")}`
    : `/docs/${apiVersion}/reference/${docId.replace("reference/", "")}`;

  return <Link to={url}>{p.children}</Link>;
}
