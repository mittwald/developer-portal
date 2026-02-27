import { APIVersion, OperationWithMeta } from "@site/src/openapi/specs";
import { PropsWithChildren } from "react";
import buildDocumentId from "@site/src/openapi/buildDocumentId";
import Link from "@docusaurus/Link";
import { OpenAPIV3 } from "openapi-types";
import React from "react";

type Props = PropsWithChildren<{
  apiVersion: APIVersion;
  operation: OperationWithMeta;
}>;

export const buildOperationUrl = (
  apiVersion: APIVersion,
  operation: OpenAPIV3.OperationObject,
) => {
  const docId = buildDocumentId(operation);
  return apiVersion.endsWith("-preview")
    ? `/docs/${apiVersion.replace("-preview", "")}/preview/${docId.replace("reference/", "")}`
    : `/docs/${apiVersion}/reference/${docId.replace("reference/", "")}`;
};

export default function OperationLink(p: Props) {
  const { apiVersion } = p;
  const { operation } = p.operation;
  const url = buildOperationUrl(apiVersion, operation);
  return <Link to={url}>{p.children}</Link>;
}
