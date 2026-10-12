import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  AccentBox,
  Heading,
  Link,
  Text,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

interface NavigationTileProps {
  href: string;
  title: ReactNode;
  description?: ReactNode;
  /** Aligns heading and text at the end, e.g. for a "next" link */
  alignEnd?: boolean;
  className?: string;
}

/**
 * A small navigation tile (category cards, previous/next links): a neutral
 * Flow accent box with heading and text, linked as a whole and darkened on
 * hover
 */
export default function NavigationTile({
  href,
  title,
  description,
  alignEnd = false,
  className,
}: NavigationTileProps) {
  return (
    <Link href={href} className={clsx(styles.link, className)}>
      <AccentBox
        backgroundColor="neutral"
        className={clsx(styles.tile, alignEnd && styles.alignEnd)}
      >
        <div className={styles.content}>
          <Heading level={2} size="xs">
            {title}
          </Heading>
          {description && (
            <Text className={styles.description}>{description}</Text>
          )}
        </div>
      </AccentBox>
    </Link>
  );
}
