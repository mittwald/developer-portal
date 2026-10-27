import React, { type ReactNode } from "react";
import Translate, { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/DocPaginator";
import PaginatorNavLink from "@theme/PaginatorNavLink";
import { Separator } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Previous/next links below a page, separated from the content like two
 * Flow sections. The `className` prop is not applied: its only caller
 * (DocItem/Paginator) passes Docusaurus' "docusaurus-mt-lg" margin, which the
 * section spacing here replaces. Ejected from @docusaurus/theme-classic.
 */
export default function DocPaginator({ previous, next }: Props): ReactNode {
  return (
    <div className={styles.paginator}>
      <Separator />
      <nav
        className="pagination-nav"
        aria-label={translate({
          id: "theme.docs.paginator.navAriaLabel",
          message: "Docs pages",
          description: "The ARIA label for the docs pagination",
        })}
      >
        {previous && (
          <PaginatorNavLink
            {...previous}
            subLabel={
              <Translate
                id="theme.docs.paginator.previous"
                description="The label used to navigate to the previous doc"
              >
                Previous
              </Translate>
            }
          />
        )}
        {next && (
          <PaginatorNavLink
            {...next}
            subLabel={
              <Translate
                id="theme.docs.paginator.next"
                description="The label used to navigate to the next doc"
              >
                Next
              </Translate>
            }
            isNext
          />
        )}
      </nav>
    </div>
  );
}
