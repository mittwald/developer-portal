import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  findFirstSidebarItemLink,
  filterDocCardListItems,
  useCurrentSidebarSiblings,
  useDocById,
} from "@docusaurus/plugin-content-docs/client";
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from "@docusaurus/plugin-content-docs";
import { translate } from "@docusaurus/Translate";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { usePluralForm } from "@docusaurus/theme-common";
import type { Props } from "@theme/DocCardList";
import {
  AccentBox,
  Heading,
  Icon,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import {
  IconExternalLink,
  IconFileText,
  IconFolder,
} from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * Cards for sidebar items (e.g. on generated category index pages), rendered
 * as linked neutral Flow accent boxes. Swizzled (ejected) from
 * @docusaurus/theme-classic; replaces DocCard, whose emoji icons are swapped
 * for Flow icons.
 */

interface CardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description?: string;
}

function Card({ href, icon, title, description }: CardProps) {
  return (
    <Link href={href} className={styles.link}>
      <AccentBox backgroundColor="neutral" className={styles.card}>
        <Section>
          <Heading level={2} size="s">
            <Icon>{icon}</Icon>
            {title}
          </Heading>
          {description && (
            <Text className={styles.description}>{description}</Text>
          )}
        </Section>
      </AccentBox>
    </Link>
  );
}

function CategoryCard({ item }: { item: PropSidebarItemCategory }) {
  const href = findFirstSidebarItemLink(item);
  const { selectMessage } = usePluralForm();

  // Categories without a link have been filtered upfront
  if (!href) {
    return null;
  }

  const itemCount = selectMessage(
    item.items.length,
    translate(
      {
        message: "1 item|{count} items",
        id: "theme.docs.DocCard.categoryDescription.plurals",
      },
      { count: item.items.length },
    ),
  );

  return (
    <Card
      href={href}
      icon={<IconFolder />}
      title={item.label}
      description={item.description ?? itemCount}
    />
  );
}

function LinkCard({ item }: { item: PropSidebarItemLink }) {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <Card
      href={item.href}
      icon={isInternalUrl(item.href) ? <IconFileText /> : <IconExternalLink />}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

function DocCardListItem({
  item,
}: {
  item: PropSidebarItemLink | PropSidebarItemCategory;
}) {
  return (
    <article className={clsx(styles.item, "col col--6")}>
      {item.type === "category" ? (
        <CategoryCard item={item} />
      ) : (
        <LinkCard item={item} />
      )}
    </article>
  );
}

function DocCardListForCurrentSidebarCategory({ className }: Props) {
  const items = useCurrentSidebarSiblings();
  return <DocCardList items={items} className={className} />;
}

export default function DocCardList(props: Props): ReactNode {
  const { items, className } = props;
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }
  const filteredItems = filterDocCardListItems(items).filter(
    (item): item is PropSidebarItemLink | PropSidebarItemCategory =>
      item.type === "link" || item.type === "category",
  );
  return (
    <section className={clsx("row", className)}>
      {filteredItems.map((item, index) => (
        <DocCardListItem key={index} item={item} />
      ))}
    </section>
  );
}
