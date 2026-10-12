import { PropsWithChildren } from "react";
import { Link } from "@mittwald/flow-react-components";

interface IssueTrackerLinkProps {
  type: "suggestion" | "bug";
}

export function IssueTrackerLink({
  type,
  children,
}: PropsWithChildren<IssueTrackerLinkProps>) {
  return (
    <Link
      target="_blank"
      href={`https://github.com/mittwald/developer-portal/issues/new?&labels=${type}&template=${type}.md`}
    >
      {children}
    </Link>
  );
}
