import React, { type ReactNode } from "react";
import clsx from "clsx";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import { ThemeClassNames } from "@docusaurus/theme-common";
import EditThisPage from "@theme/EditThisPage";
import LastUpdated from "@theme/LastUpdated";
import { Section, Separator } from "@mittwald/flow-react-components";
import ReadMoreLink from "@theme/BlogPostItem/Footer/ReadMoreLink";
import styles from "./styles.module.css";

/**
 * Footer of a changelog entry (the tags are below the title, see
 * BlogPostItem/Header/Title). On the entry page it is built like the doc
 * footer; in the list, "Read more" follows the excerpt directly. Ejected from
 * @docusaurus/theme-classic.
 */
export default function BlogPostItemFooter(): ReactNode {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { title, editUrl, hasTruncateMarker, lastUpdatedBy, lastUpdatedAt } =
    metadata;

  // A post is truncated if it's in the "list view" and it has a truncate marker
  const truncatedPost = !isBlogPostPage && hasTruncateMarker;
  const renderFooter = truncatedPost || editUrl;
  if (!renderFooter) {
    return null;
  }

  // BlogPost footer - details view, like the doc footer: separated from the
  // content like two Flow sections, last update right
  if (isBlogPostPage) {
    const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
    return (
      <footer className={styles.pageFooter}>
        <Separator />
        <Section>
          <div className={styles.row}>
            {canDisplayEditMetaRow && (
              <div
                className={clsx(
                  ThemeClassNames.blog.blogFooterEditMetaRow,
                  styles.editMetaRow,
                )}
              >
                {editUrl && <EditThisPage editUrl={editUrl} />}
                <LastUpdated
                  lastUpdatedAt={lastUpdatedAt}
                  lastUpdatedBy={lastUpdatedBy}
                />
              </div>
            )}
          </div>
        </Section>
      </footer>
    );
  }

  // BlogPost footer - list view
  return (
    <footer className={styles.listFooter}>
      {truncatedPost && (
        <div>
          <ReadMoreLink blogPostTitle={title} to={metadata.permalink} />
        </div>
      )}
    </footer>
  );
}
