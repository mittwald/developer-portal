import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames, useThemeConfig } from "@docusaurus/theme-common";
import {
  type TOCTreeNode,
  useFilteredAndTreeifiedTOC,
} from "@docusaurus/theme-common/internal";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { translate } from "@docusaurus/Translate";
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Icon,
  MenuItem,
  Text,
} from "@mittwald/flow-react-components";
import { IconChevronDown } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * Table of contents on small screens: a Flow button opening a context menu
 * with the headings of the page. Ejected from @docusaurus/theme-classic
 * (unsafe, uses its internal TOC utilities).
 */

interface Entry {
  id: string;
  label: string;
  depth: number;
}

// TOC values are HTML (e.g. with <code>); menu items need plain text
function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function flatten(nodes: readonly TOCTreeNode[], depth = 0): Entry[] {
  return nodes.flatMap((node) => [
    { id: node.id, label: toPlainText(node.value), depth },
    ...flatten(node.children, depth + 1),
  ]);
}

export default function DocItemTOCMobile(): ReactNode {
  const { toc, frontMatter } = useDoc();
  const themeConfig = useThemeConfig();
  const entries = flatten(
    useFilteredAndTreeifiedTOC({
      toc,
      minHeadingLevel:
        frontMatter.toc_min_heading_level ??
        themeConfig.tableOfContents.minHeadingLevel,
      maxHeadingLevel:
        frontMatter.toc_max_heading_level ??
        themeConfig.tableOfContents.maxHeadingLevel,
    }),
  );

  return (
    <div className={clsx(ThemeClassNames.docs.docTocMobile, styles.tocMobile)}>
      <ContextMenuTrigger>
        <Button variant="soft" color="secondary">
          <Text>
            {translate({
              id: "theme.TOCCollapsible.toggleButtonLabel",
              message: "On this page",
              description:
                "The label used by the button on the collapsible TOC component",
            })}
          </Text>
          <Icon>
            <IconChevronDown />
          </Icon>
        </Button>
        <ContextMenu
          onAction={(id) => {
            // Lets the browser scroll to the heading (respecting the navbar
            // offset of the anchor) and updates the URL
            window.location.hash = String(id);
          }}
        >
          {entries.map((entry) => (
            <MenuItem
              key={entry.id}
              id={entry.id}
              textValue={entry.label}
              className={styles[`depth${Math.min(entry.depth, 3)}`]}
            >
              {entry.label}
            </MenuItem>
          ))}
        </ContextMenu>
      </ContextMenuTrigger>
    </div>
  );
}
