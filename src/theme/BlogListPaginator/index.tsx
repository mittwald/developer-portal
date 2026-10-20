import React, { type ReactNode } from "react";
import Translate, { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/BlogListPaginator";
import PaginatorNavLink from "@theme/PaginatorNavLink";
import { Separator } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Newer/older entries links below the changelog list, separated from the
 * entries like two Flow sections. Ejected from @docusaurus/theme-classic.
 */
export default function BlogListPaginator({ metadata }: Props): ReactNode {
  const { previousPage, nextPage } = metadata;
  return (
    <div className={styles.paginator}>
      <Separator />
      <nav
        className="pagination-nav"
        aria-label={translate({
          id: "theme.blog.paginator.navAriaLabel",
          message: "Blog list page navigation",
          description: "The ARIA label for the blog pagination",
        })}
      >
        {previousPage && (
          <PaginatorNavLink
            permalink={previousPage}
            title={
              <Translate
                id="theme.blog.paginator.newerEntries"
                description="The label used to navigate to the newer blog posts page (previous page)"
              >
                Newer entries
              </Translate>
            }
          />
        )}
        {nextPage && (
          <PaginatorNavLink
            permalink={nextPage}
            title={
              <Translate
                id="theme.blog.paginator.olderEntries"
                description="The label used to navigate to the older blog posts page (next page)"
              >
                Older entries
              </Translate>
            }
            isNext
          />
        )}
      </nav>
    </div>
  );
}
