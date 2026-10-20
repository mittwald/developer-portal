import React, { ComponentProps } from "react";
import Markdown, { ExtraProps } from "react-markdown";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { APIVersion, getOperationById, useSpec } from "@site/src/openapi/specs";
import { buildOperationUrl } from "@site/src/components/openapi/OperationLink";

const OPERATION_LINK_PREFIX = "#operation/";

/**
 * Determines the API version of the reference page currently being viewed,
 * so that operation links resolve against the same spec.
 */
function useCurrentAPIVersion(): APIVersion {
  const { pathname } = useLocation();
  const match = pathname.match(/\/docs\/(v\d+)\/(reference|preview)\//);
  if (!match) {
    return "v2";
  }

  const [, version, section] = match;
  return (section === "preview" ? `${version}-preview` : version) as APIVersion;
}

function SpecMarkdownLink({
  href,
  children,
  node: _node,
  ...rest
}: ComponentProps<"a"> & ExtraProps) {
  const apiVersion = useCurrentAPIVersion();
  const spec = useSpec(apiVersion);

  if (!href?.startsWith(OPERATION_LINK_PREFIX)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  const operationId = href.slice(OPERATION_LINK_PREFIX.length);
  const operation = spec && getOperationById(spec, operationId);
  if (!operation) {
    console.warn(
      `Unknown operation "${operationId}" linked in ${apiVersion} spec description`,
    );
    return <>{children}</>;
  }

  return (
    <Link to={buildOperationUrl(apiVersion, operation.operation)}>
      {children}
    </Link>
  );
}

/**
 * Renders a Markdown description from the OpenAPI spec.
 *
 * Links of the form `#operation/<operationId>` are resolved to the reference
 * page of that operation (the deep link format also used by Redoc).
 */
export default function SpecMarkdown({ children }: { children?: string }) {
  return <Markdown components={{ a: SpecMarkdownLink }}>{children}</Markdown>;
}
