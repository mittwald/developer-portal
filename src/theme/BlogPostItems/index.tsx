import React, { type ReactNode } from "react";
import { BlogPostProvider } from "@docusaurus/plugin-content-blog/client";
import BlogPostItem from "@theme/BlogPostItem";
import type { Props } from "@theme/BlogPostItems";
import { Section } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Changelog entries in the list, each in a Flow section: Flow separates and
 * spaces the entries. Ejected from @docusaurus/theme-classic.
 */
export default function BlogPostItems({
  items,
  component: BlogPostItemComponent = BlogPostItem,
}: Props): ReactNode {
  return (
    <>
      {items.map(({ content: BlogPostContent }) => (
        <Section
          key={BlogPostContent.metadata.permalink}
          className={styles.entry}
        >
          <BlogPostProvider content={BlogPostContent}>
            <BlogPostItemComponent>
              <BlogPostContent />
            </BlogPostItemComponent>
          </BlogPostProvider>
        </Section>
      ))}
    </>
  );
}
