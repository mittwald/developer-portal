import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { isActiveSidebarItem } from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/DocSidebarItem/Link";
import HTTPMethod from "@site/src/components/openapi/HTTPMethod";
import styles from "./styles.module.css";

/**
 * Sidebar link; API operations (class `api-operation-<method>`, set by the
 * reference generator) get their HTTP method as Flow badge at the end, like
 * badges in a Flow navigation. Ejected from @docusaurus/theme-classic.
 */

function LinkLabel({ label }: { label: string }) {
  return <span className={styles.linkLabel}>{label}</span>;
}

function apiOperationMethod(className?: string): string | undefined {
  return className?.match(
    /\bapi-operation-(get|post|put|patch|delete)\b/,
  )?.[1];
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const { href, label, className, autoAddBaseUrl } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const method = apiOperationMethod(className);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        "menu__list-item",
        className,
      )}
      key={label}
    >
      <Link
        className={clsx(
          "menu__link",
          !isInternalLink && styles.menuExternalLink,
          method && styles.withBadge,
          {
            "menu__link--active": isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? "page" : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}
      >
        <LinkLabel label={label} />
        {method && (
          <HTTPMethod
            className={styles.badge}
            method={method}
            deprecated={className?.includes("api-operation-deprecated")}
          />
        )}
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
