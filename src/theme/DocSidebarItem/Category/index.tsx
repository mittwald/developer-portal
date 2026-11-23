import React, { type ReactNode } from "react";
import Category from "@theme-original/DocSidebarItem/Category";
import type { Props } from "@theme/DocSidebarItem/Category";

/**
 * Sidebar categories can only link to docs. A category with a string
 * `customProps.href` links there instead, e.g. the deprecations category to
 * the overview page of the deprecations plugin (src/plugins/deprecations).
 * Wraps the original component.
 */
export default function CategoryWrapper(props: Props): ReactNode {
  const { item } = props;
  const customHref = item.customProps?.href;

  if (item.href || typeof customHref !== "string") {
    return <Category {...props} />;
  }
  return <Category {...props} item={{ ...item, href: customHref }} />;
}
