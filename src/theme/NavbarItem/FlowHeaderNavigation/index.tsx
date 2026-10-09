import React, { type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  useActiveDocContext,
  useLayoutDoc,
} from "@docusaurus/plugin-content-docs/client";
import NavbarItem, { type Props as NavbarItemProps } from "@theme/NavbarItem";
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  HeaderNavigation,
  Icon,
  Link,
  MenuItem,
  Text,
} from "@mittwald/flow-react-components";
import { IconMenu2 } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * Navbar item type `custom-flowHeaderNavigation`: renders its `items` (doc
 * and link items) as a Flow header navigation. Below 1250px, where the full
 * navigation no longer fits next to the logo, it collapses into a Flow
 * context menu; in Docusaurus' mobile sidebar the regular items are rendered.
 */

type EntryConfig =
  { type: "doc"; docId: string; label: string } | { to: string; label: string };

interface Props {
  label: string;
  items: EntryConfig[];
  mobile?: boolean;
}

interface Entry {
  href: string;
  label: string;
  isActive: boolean;
}

/** Resolves a doc item like Docusaurus' DocNavbarItem does */
function useDocEntry(docId: string, label: string): Entry | null {
  const { activeDoc } = useActiveDocContext(undefined);
  const doc = useLayoutDoc(docId, undefined);
  if (!doc) {
    return null;
  }
  const pageActive = activeDoc?.path === doc.path;
  return {
    href: doc.path,
    label,
    isActive:
      pageActive || (!!activeDoc?.sidebar && activeDoc.sidebar === doc.sidebar),
  };
}

function useLinkEntry(to: string, label: string): Entry {
  const href = useBaseUrl(to);
  const { pathname } = useLocation();
  return { href, label, isActive: pathname.startsWith(href) };
}

function DocEntry({
  config,
  render,
}: {
  config: Extract<EntryConfig, { type: "doc" }>;
  render: (entry: Entry) => ReactNode;
}) {
  const entry = useDocEntry(config.docId, config.label);
  return entry ? render(entry) : null;
}

function LinkEntry({
  config,
  render,
}: {
  config: Extract<EntryConfig, { to: string }>;
  render: (entry: Entry) => ReactNode;
}) {
  return render(useLinkEntry(config.to, config.label));
}

function Entries({
  items,
  render,
}: {
  items: EntryConfig[];
  render: (entry: Entry) => ReactNode;
}) {
  return (
    <>
      {items.map((config) =>
        "docId" in config ? (
          <DocEntry key={config.label} config={config} render={render} />
        ) : (
          <LinkEntry key={config.label} config={config} render={render} />
        ),
      )}
    </>
  );
}

export default function FlowHeaderNavigation({
  label,
  items,
  mobile,
}: Props): ReactNode {
  if (mobile) {
    return (
      <>
        {items.map((item) => (
          <NavbarItem key={item.label} {...(item as NavbarItemProps)} mobile />
        ))}
      </>
    );
  }

  return (
    <>
      <HeaderNavigation aria-label={label} className={styles.full}>
        <Entries
          items={items}
          render={(entry) => (
            <Link
              href={entry.href}
              aria-current={entry.isActive ? "page" : undefined}
            >
              {entry.label}
            </Link>
          )}
        />
      </HeaderNavigation>
      <div className={styles.compact}>
        <ContextMenuTrigger>
          <Button variant="plain" color="secondary" aria-label={label}>
            <Icon>
              <IconMenu2 />
            </Icon>
          </Button>
          <ContextMenu>
            <Entries
              items={items}
              render={(entry) => (
                <MenuItem href={entry.href} id={entry.href}>
                  <Text>{entry.label}</Text>
                </MenuItem>
              )}
            />
          </ContextMenu>
        </ContextMenuTrigger>
      </div>
    </>
  );
}
