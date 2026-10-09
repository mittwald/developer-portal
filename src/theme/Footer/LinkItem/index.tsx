import React, { type ReactNode } from "react";
import DocusaurusLink from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import isInternalUrl from "@docusaurus/isInternalUrl";
import type { Props } from "@theme/Footer/LinkItem";
import { Link } from "@mittwald/flow-react-components";

/**
 * Footer link as a dark Flow link, like the footer on flow.mittwald.de.
 * Swizzled (ejected) from @docusaurus/theme-classic; it still renders through
 * Docusaurus' Link for base URL handling and broken link detection.
 */
export default function FooterLinkItem({ item }: Props): ReactNode {
  const { to, href, label, prependBaseUrlToHref } = item;
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const isExternal = !!href && !isInternalUrl(href);

  return (
    <Link
      color="dark"
      linkComponent={DocusaurusLink}
      href={href ? (prependBaseUrlToHref ? normalizedHref : href) : toUrl}
      target={isExternal ? "_blank" : undefined}
    >
      {label}
    </Link>
  );
}
