import React, { type ReactNode } from "react";
import clsx from "clsx";
import type { Props } from "@theme/PaginatorNavLink";
import {
  AccentBox,
  Label,
  LabeledValue,
  Link,
  Text,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Previous/next links below a page: a linked neutral Flow AccentBox with a
 * labeled value ("Previous"/"Next" as label, the page title styled as link).
 * Swizzled (ejected) from @docusaurus/theme-classic.
 */
export default function PaginatorNavLink(props: Props): ReactNode {
  const { permalink, title, subLabel, isNext } = props;
  return (
    <Link href={permalink} className={clsx(styles.link, isNext && styles.next)}>
      <AccentBox backgroundColor="neutral" className={styles.box}>
        <LabeledValue className={styles.labeledValue}>
          {subLabel && <Label>{subLabel}</Label>}
          <Text className={styles.title}>{title}</Text>
        </LabeledValue>
      </AccentBox>
    </Link>
  );
}
