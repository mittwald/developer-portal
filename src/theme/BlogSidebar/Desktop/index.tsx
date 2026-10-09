import React, { memo, type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";
import {
  groupBlogSidebarItemsByYear,
  useVisibleBlogSidebarItems,
} from "@docusaurus/plugin-content-blog/client";
import type { Props } from "@theme/BlogSidebar/Desktop";
import {
  Heading,
  Label,
  Link,
  Navigation,
  NavigationGroup,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Changelog sidebar as Flow navigation: one (collapsable) group per year.
 * The newest year and the year of the current entry are expanded. Ejected
 * from @docusaurus/theme-classic.
 */

function withoutTrailingSlash(path: string): string {
  return path.replace(/\/$/, "");
}

function BlogSidebarDesktop({ sidebar }: Props): ReactNode {
  const items = useVisibleBlogSidebarItems(sidebar.items);
  const { pathname } = useLocation();
  const isActive = (permalink: string) =>
    withoutTrailingSlash(permalink) === withoutTrailingSlash(pathname);

  return (
    <aside className={styles.container}>
      <div className={styles.sidebar}>
        <Heading level={2} size="xs" className={styles.title}>
          {sidebar.title}
        </Heading>
        <Navigation
          aria-label={translate({
            id: "theme.blog.sidebar.navAriaLabel",
            message: "Blog recent posts navigation",
            description: "The ARIA label for recent posts in the blog sidebar",
          })}
        >
          {groupBlogSidebarItemsByYear(items).map(
            ([year, yearItems], index) => (
              <NavigationGroup
                key={year}
                collapsable
                defaultExpanded={
                  index === 0 ||
                  yearItems.some((item) => isActive(item.permalink))
                }
              >
                <Label>{year}</Label>
                {yearItems.map((item) => (
                  <Link
                    key={item.permalink}
                    href={item.permalink}
                    aria-current={isActive(item.permalink) ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                ))}
              </NavigationGroup>
            ),
          )}
        </Navigation>
      </div>
    </aside>
  );
}

export default memo(BlogSidebarDesktop);
