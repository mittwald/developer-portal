import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import LinkItem from "@theme/Footer/LinkItem";
import type { Props } from "@theme/Footer/Links/MultiColumn";
import {
  ColumnLayout,
  Heading,
  Section,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Footer columns as Flow sections in a Flow column layout, with Flow headings
 * as column titles. Swizzled (ejected) from @docusaurus/theme-classic.
 */

type ColumnType = Props["columns"][number];
type ColumnItemType = ColumnType["items"][number];

function ColumnLinkItem({ item }: { item: ColumnItemType }) {
  return item.html ? (
    <li
      className={clsx("footer__item", item.className)}
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: item.html }}
    />
  ) : (
    <li key={item.href ?? item.to} className="footer__item">
      <LinkItem item={item} />
    </li>
  );
}

function Column({ column }: { column: ColumnType }) {
  return (
    <Section
      className={clsx(ThemeClassNames.layout.footer.column, column.className)}
    >
      <Heading level={2} size="xs">
        {column.title}
      </Heading>
      <ul className={styles.items}>
        {column.items.map((item, i) => (
          <ColumnLinkItem key={i} item={item} />
        ))}
      </ul>
    </Section>
  );
}

export default function FooterLinksMultiColumn({ columns }: Props): ReactNode {
  return (
    <ColumnLayout s={[1]} m={[1, 1, 1]} className={styles.links}>
      {columns.map((column, i) => (
        <Column key={i} column={column} />
      ))}
    </ColumnLayout>
  );
}
