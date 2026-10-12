import React, { type ReactNode } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { useAnchorTargetClassName } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import type { Props } from "@theme/Heading";
import { Heading as FlowHeading } from "@mittwald/flow-react-components";
import "./styles.module.css";

/**
 * Headings rendered by the theme (Markdown via MDXComponents, category
 * indexes, tag and archive pages, 404, …) as Flow headings that keep
 * Docusaurus' anchor id and hash link. Ejected from @docusaurus/theme-classic.
 */
export default function Heading({
  as,
  id,
  className,
  children,
}: Props): ReactNode {
  const level = Number(as.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6;
  const brokenLinks = useBrokenLinks();
  const anchorTargetClassName = useAnchorTargetClassName(id);

  // H1 headings do not need an id because they don't appear in the TOC
  if (level === 1 || !id) {
    return (
      <FlowHeading level={level} className={className}>
        {children}
      </FlowHeading>
    );
  }

  brokenLinks.collectAnchor(id);

  const anchorTitle = translate(
    {
      id: "theme.common.headingLinkTitle",
      message: "Direct link to {heading}",
      description: "Title for link to heading",
    },
    { heading: typeof children === "string" ? children : id },
  );

  return (
    <FlowHeading
      level={level}
      id={id}
      className={clsx("anchor", anchorTargetClassName, className)}
    >
      {children}
      <Link
        className="hash-link"
        to={`#${id}`}
        aria-label={anchorTitle}
        title={anchorTitle}
        translate="no"
      >
        &#8203;
      </Link>
    </FlowHeading>
  );
}
