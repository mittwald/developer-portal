import React, { type ReactNode } from "react";
import clsx from "clsx";
import type { Props } from "@theme/PaginatorNavLink";
import { AccentBox, Link, Text } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Previous/next links below a page: a neutral Flow AccentBox with an inline
 * link. Swizzled (ejected) from @docusaurus/theme-classic.
 */
export default function PaginatorNavLink(props: Props): ReactNode {
  const { permalink, title, subLabel, isNext } = props;
  return (
    <AccentBox
      backgroundColor="neutral"
      className={clsx(styles.box, isNext && styles.next)}
    >
      {subLabel && <Text className={styles.subLabel}>{subLabel}</Text>}
      <Link inline color="dark" href={permalink}>
        {title}
      </Link>
    </AccentBox>
  );
}
