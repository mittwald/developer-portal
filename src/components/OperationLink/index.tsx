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
  const url = `/reference/v2/#tag/${tag}/operation/${operation}`;
  return <Link to={url}>{children}</Link>;
}
