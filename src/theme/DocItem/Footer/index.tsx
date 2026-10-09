import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import TagsListInline from "@theme/TagsListInline";
import EditThisPage from "@theme/EditThisPage";
import LastUpdated from "@theme/LastUpdated";
import { Section, Separator } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Doc footer (tags, edit link, last update) as Flow section, separated from
 * the content like two Flow sections. Ejected from @docusaurus/theme-classic.
 */
export default function DocItemFooter(): ReactNode {
  const { metadata } = useDoc();
  const { editUrl, lastUpdatedAt, lastUpdatedBy, tags } = metadata;

  const canDisplayTagsRow = tags.length > 0;
  const canDisplayLastUpdated = !!(lastUpdatedAt || lastUpdatedBy);
  if (!canDisplayTagsRow && !editUrl && !canDisplayLastUpdated) {
    return null;
  }

  return (
    <footer className={clsx(ThemeClassNames.docs.docFooter, styles.footer)}>
      <Separator />
      <Section>
        {/* Tags left, edit link right; they wrap below each other when there
            is not enough space */}
        <div className={styles.row}>
          {canDisplayTagsRow && (
            <div className={ThemeClassNames.docs.docFooterTagsRow}>
              <TagsListInline tags={tags} />
            </div>
          )}
          {(editUrl || canDisplayLastUpdated) && (
            <div
              className={clsx(
                ThemeClassNames.docs.docFooterEditMetaRow,
                styles.editMetaRow,
              )}
            >
              {editUrl && <EditThisPage editUrl={editUrl} />}
              {canDisplayLastUpdated && (
                <LastUpdated
                  lastUpdatedAt={lastUpdatedAt}
                  lastUpdatedBy={lastUpdatedBy}
                />
              )}
            </div>
          )}
        </div>
      </Section>
    </footer>
  );
}
