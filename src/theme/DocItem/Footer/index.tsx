import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import LastUpdated from "@theme/LastUpdated";
import { Section, Separator } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Doc footer (last update) as Flow section, separated from the content like
 * two Flow sections; the edit link is next to the title and the tags are
 * below it (see DocItem/Content). Ejected from @docusaurus/theme-classic.
 */
export default function DocItemFooter(): ReactNode {
  const { metadata } = useDoc();
  const { lastUpdatedAt, lastUpdatedBy } = metadata;

  if (!lastUpdatedAt && !lastUpdatedBy) {
    return null;
  }

  return (
    <footer className={clsx(ThemeClassNames.docs.docFooter, styles.footer)}>
      <Separator />
      <Section>
        {/* The last update on the right */}
        <div
          className={clsx(
            ThemeClassNames.docs.docFooterEditMetaRow,
            styles.editMetaRow,
          )}
        >
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        </div>
      </Section>
    </footer>
  );
}
