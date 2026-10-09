import React, { type ReactNode } from "react";
import clsx from "clsx";
import Translate, { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/DocPaginator";
import PaginatorNavLink from "@theme/PaginatorNavLink";
import { Separator } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Previous/next links below a page, separated from the content like two
 * Flow sections. Ejected from @docusaurus/theme-classic.
 */
export default function DocPaginator({
  className,
  previous,
  next,
}: Props): ReactNode {
  return (
    <div className={clsx(className, styles.paginator)}>
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
