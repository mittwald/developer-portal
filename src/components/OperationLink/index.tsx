import React from "react";
import Link from "@docusaurus/Link";

export default function OperationLink({ tag, operation, children }) {
  const url = `/reference/v2/#tag/${tag}/operation/${operation}`;
  return <Link to={url}>{children}</Link>;
}
