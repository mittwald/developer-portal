import React, { type ReactNode } from "react";
import clsx from "clsx";
import type { Props } from "@theme/TOCItems/Tree";
import { Link, Navigation } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Table of contents as a flat Flow navigation, styled like the anchor
 * navigation on flow.mittwald.de: nested headings are indented instead of
 * nested. Ejected from @docusaurus/theme-classic; Docusaurus' TOCItems still
 * highlights the active link through its class name. Infima's list class
 * (left border, item margins) is not applied.
 */

type TOCItem = Props["toc"][number];

function flatten(toc: readonly TOCItem[], depth = 0): [TOCItem, number][] {
  return toc.flatMap((heading) => [
    [heading, depth] as [TOCItem, number],
    ...flatten(heading.children, depth + 1),
  ]);
}

function TOCItemTree({ toc, linkClassName }: Props): ReactNode {
  if (!toc.length) {
    return null;
  }

  return (
    <Navigation className={styles.navigation}>
      {flatten(toc).map(([heading, depth]) => (
        <Link
          key={heading.id}
          href={`#${heading.id}`}
          className={clsx(linkClassName, styles.link)}
          style={{
            marginInlineStart: depth > 0 ? `${depth * 16}px` : undefined,
          }}
        >
          {/* Developer provided the HTML, so assume it's safe. */}
          <span dangerouslySetInnerHTML={{ __html: heading.value }} />
        </Link>
      ))}
    </Navigation>
  );
}

// Memo only the tree root is enough
export default React.memo(TOCItemTree);
