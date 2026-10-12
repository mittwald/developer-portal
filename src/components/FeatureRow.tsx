import React, { Children, type PropsWithChildren, type ReactNode } from "react";
import clsx from "clsx";
import { ColumnLayout, Flex } from "@mittwald/flow-react-components";
import styles from "./FeatureRow.module.css";

interface FeatureRowProps {
  /** Introduction above the cards (see Intro) */
  intro: ReactNode;
  /** Background gradient, to set the row apart from its neighbors */
  variant?: boolean;
}

/**
 * A row on the landing pages: an introduction and the feature cards below it,
 * two per row on larger screens (a single card takes the full width).
 */
export default function FeatureRow({
  intro,
  variant,
  children,
}: PropsWithChildren<FeatureRowProps>) {
  const columns = Children.count(children) > 1 ? [1, 1] : [1];

  return (
    <section
      className={clsx(styles.featureRow, variant ? styles.variant : undefined)}
    >
      <Flex direction="column" align="stretch" gap="xl" className="container">
        {intro}
        <ColumnLayout s={[1]} m={columns} rowGap="m" columnGap="xl">
          {children}
        </ColumnLayout>
      </Flex>
    </section>
  );
}
