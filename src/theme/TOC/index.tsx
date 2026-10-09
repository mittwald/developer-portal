import React, { type ReactNode } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import TOCItems from "@theme/TOCItems";
import type { Props } from "@theme/TOC";
import { Heading } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Desktop table of contents with a heading, like the anchor navigation on
 * flow.mittwald.de. Ejected from @docusaurus/theme-classic.
 */

// A custom class name keeps TOCInline/TOCCollapsible from being highlighted
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight";
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active";

export default function TOC({ className, ...props }: Props): ReactNode {
  return (
    <div className={clsx(styles.tableOfContents, "thin-scrollbar", className)}>
      <Heading level={2} size="xs" className={styles.heading}>
        {translate({
          id: "theme.TOCCollapsible.toggleButtonLabel",
          message: "On this page",
          description:
            "The label used by the button on the collapsible TOC component",
        })}
      </Heading>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
    </div>
  );
}
