import React, { PropsWithChildren } from "react";
import { AccentBox, Section } from "@mittwald/flow-react-components";
import styles from "@site/src/components/HomepageFeatures/styles.module.css";

/** A neutral Flow accent box for the feature rows on the landing pages */
export default function FeatureCard({ children }: PropsWithChildren<{}>) {
  return (
    <AccentBox
      backgroundColor="neutral"
      color="dark"
      className={styles.feature}
    >
      <Section>{children}</Section>
    </AccentBox>
  );
}
