import React, { PropsWithChildren } from "react";
import Link from "@docusaurus/Link";

export interface OperationLinkProps {
  tag: string;
  operation: string;
}

export default function OperationLink({
  tag,
  operation,
  children,
}: PropsWithChildren<OperationLinkProps>) {
  const url = `/docs/v2/reference/${tag.toLowerCase()}/${operation}`;
  return <Link to={url}>{children}</Link>;
}
