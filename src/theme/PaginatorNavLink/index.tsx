import React, { type ReactNode } from "react";
import clsx from "clsx";
import type { Props } from "@theme/PaginatorNavLink";
import { IconBackLink, IconForwardLink } from "@mittwald/flow-react-components";
import NavigationTile from "@site/src/components/NavigationTile";
import styles from "./styles.module.css";

/**
 * Previous/next links below a page as navigation tiles, like the category
 * cards: "Previous"/"Next" as heading with an arrow pointing in its
 * direction, the page title as text. Swizzled (ejected) from
 * @docusaurus/theme-classic.
 */
export default function PaginatorNavLink(props: Props): ReactNode {
  const { permalink, title, subLabel, isNext } = props;
  return (
    <NavigationTile
      href={permalink}
      title={
        isNext ? (
          <>
            {subLabel}
            <IconForwardLink className={styles.forwardIcon} />
          </>
        ) : (
          <>
            <IconBackLink />
            {subLabel}
          </>
        )
      }
      description={title}
      alignEnd={isNext}
      className={clsx(isNext && styles.next)}
    />
  );
}
