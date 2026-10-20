import React, { type ReactNode } from "react";
import Translate, { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/BlogPostPaginator";
import PaginatorNavLink from "@theme/PaginatorNavLink";
import { Separator } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Newer/older post links below a changelog entry, separated from the entry
 * like two Flow sections. Ejected from @docusaurus/theme-classic.
 */
export default function BlogPostPaginator({
  nextItem,
  prevItem,
}: Props): ReactNode {
  return (
    <div className={styles.paginator}>
      <Separator />
      <nav
        className="pagination-nav"
        aria-label={translate({
          id: "theme.blog.post.paginator.navAriaLabel",
          message: "Blog post page navigation",
          description: "The ARIA label for the blog posts pagination",
        })}
      >
        {prevItem && (
          <PaginatorNavLink
            {...prevItem}
            subLabel={
              <Translate
                id="theme.blog.post.paginator.newerPost"
                description="The blog post button label to navigate to the newer/previous post"
              >
                Newer post
              </Translate>
            }
          />
        )}
        {nextItem && (
          <PaginatorNavLink
            {...nextItem}
            subLabel={
              <Translate
                id="theme.blog.post.paginator.olderPost"
                description="The blog post button label to navigate to the older/next post"
              >
                Older post
              </Translate>
            }
            isNext
          />
        )}
      </nav>
    </div>
  );
}
