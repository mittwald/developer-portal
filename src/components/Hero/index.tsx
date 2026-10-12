import React, { type PropsWithChildren, type ReactNode } from "react";
import Translate from "@docusaurus/Translate";
import {
  AccentBox,
  ColumnLayout,
  Flex,
  Heading,
  Icon,
  IllustratedMessage,
  LayoutCard,
  Link,
  Text,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Header of the landing pages on the Flow gradient: its content (title, lead
 * text, image, actions) is centered and stacked.
 */
export default function Hero({ children }: PropsWithChildren<{}>) {
  return (
    <header className={styles.hero}>
      <Flex direction="column" align="center" gap="l" className="container">
        {children}
      </Flex>
    </header>
  );
}

/**
 * Entry points below the title: linked accent boxes, three per row, spaced
 * like the cards of the feature rows
 */
export function HeroEntries({ children }: PropsWithChildren<{}>) {
  return (
    <ColumnLayout
      s={[1]}
      m={[1, 1]}
      l={[1, 1, 1]}
      rowGap="m"
      columnGap="xl"
      className={styles.entries}
    >
      {children}
    </ColumnLayout>
  );
}

interface HeroEntryProps {
  href: string;
  /** e.g. "_blank" for external links */
  target?: string;
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

/** An entry point in the hero: a linked accent box with an illustrated message */
export function HeroEntry({
  href,
  target,
  icon,
  title,
  description,
}: HeroEntryProps) {
  return (
    <Link href={href} target={target} className={styles.entry}>
      <LayoutCard className={styles.entryCard}>
        <AccentBox backgroundColor="neutral">
          <IllustratedMessage className={styles.entryMessage}>
            <Icon>{icon}</Icon>
            <Heading level={2}>{title}</Heading>
            <Text>{description}</Text>
            {/* Looks like a link for those who don't expect the whole box to
              be one; a real link inside the linked box would be invalid */}
            <Text className={styles.entryLink}>
              <Translate id={"index.cta.more"}>Learn more</Translate>
            </Text>
          </IllustratedMessage>
        </AccentBox>
      </LayoutCard>
    </Link>
  );
}
