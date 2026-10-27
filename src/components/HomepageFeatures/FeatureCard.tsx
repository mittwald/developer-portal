import React, { PropsWithChildren } from "react";
import {
  AccentBox,
  LayoutCard,
  Section,
} from "@mittwald/flow-react-components";
import styles from "@site/src/components/HomepageFeatures/styles.module.css";

/**
 * A neutral Flow accent box in a layout card (which pads it like a card) for
 * the feature rows on the landing pages
 */
export default function FeatureCard({ children }: PropsWithChildren<{}>) {
  return (
    <LayoutCard className={styles.feature}>
      <AccentBox backgroundColor="neutral" color="dark">
        <Section>{children}</Section>
      </AccentBox>
    </LayoutCard>
  );
}
