import React, { PropsWithChildren } from "react";
import {
  AccentBox,
  type AccentBoxProps,
  LayoutCard,
  Section,
} from "@mittwald/flow-react-components";
import styles from "@site/src/components/HomepageFeatures/styles.module.css";

interface FeatureCardProps {
  /** A Flow accent box color, e.g. to tell the cards of a page apart */
  backgroundColor?: AccentBoxProps["backgroundColor"];
}

/**
 * A Flow accent box in a layout card (which pads it like a card) for the
 * feature rows on the landing pages
 */
export default function FeatureCard({
  backgroundColor = "neutral",
  children,
}: PropsWithChildren<FeatureCardProps>) {
  return (
    <LayoutCard className={styles.feature}>
      <AccentBox backgroundColor={backgroundColor} color="dark">
        <Section>{children}</Section>
      </AccentBox>
    </LayoutCard>
  );
}
