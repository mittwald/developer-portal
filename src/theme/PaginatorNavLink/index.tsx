import React, { type ReactNode } from "react";
import clsx from "clsx";
import type { Props } from "@theme/PaginatorNavLink";
import { IconBackLink, IconForwardLink } from "@mittwald/flow-react-components";
import NavigationTile from "@site/src/components/NavigationTile";
import styles from "./styles.module.css";

/**
 * Previous/next links below a page as navigation tiles, like the category
 * cards: "Previous"/"Next" as heading with an arrow pointing in its
 * direction, the page title as text. Without such a label (e.g. "Newer
 * entries" in the changelog list), the title is the heading. Swizzled
 * (ejected) from @docusaurus/theme-classic.
 */
export default function PaginatorNavLink(props: Props): ReactNode {
  const { permalink, title, subLabel, isNext } = props;
  const heading = subLabel ?? title;
  return (
    <NavigationTile
      href={permalink}
      title={
        isNext ? (
          <>
            {heading}
            <IconForwardLink className={styles.forwardIcon} />
          </>
        ) : (
          <>
            <IconBackLink />
            {heading}
          </>
        )
      }
      description={subLabel ? title : undefined}
      alignEnd={isNext}
      className={clsx(isNext && styles.next)}
    />
  );
}
