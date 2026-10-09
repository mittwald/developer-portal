import { PropsWithChildren } from "react";
import { Link } from "@mittwald/flow-react-components";

interface IssueTrackerLinkProps {
  type: "suggestion" | "bug";
  inline?: boolean;
}

export function IssueTrackerLink({
  type,
  inline,
  children,
}: PropsWithChildren<IssueTrackerLinkProps>) {
  return (
    <Link
      inline={inline}
      target="_blank"
      href={`https://github.com/mittwald/developer-portal/issues/new?&labels=${type}&template=${type}.md`}
    >
      {children}
    </Link>
  );
}
