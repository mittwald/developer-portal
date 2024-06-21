import { PropsWithChildren } from "react";
import Link from "@docusaurus/Link";

interface IssueTrackerLinkProps {
  type: "suggestion" | "bug";
}

export function IssueTrackerLink({
  type,
  children,
}: PropsWithChildren<IssueTrackerLinkProps>) {
  return (
    <Link
      href={`https://github.com/mittwald/developer-portal/issues/new?&labels=${type}&template=${type}.md`}
    >
      {children}
    </Link>
  );
}
