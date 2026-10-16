import React, { type ReactNode } from "react";
import clsx from "clsx";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import type { Props } from "@theme/BlogPostItem/Header/Title";
import { Heading } from "@mittwald/flow-react-components";
import { TagBadges } from "@site/src/theme/TagsListInline";
import styles from "./styles.module.css";

/**
 * Title of a changelog entry as Flow heading, with the tags directly below
 * (like on doc pages). In the list it is not linked and sized like any h2
 * (the "Read more" link leads to the entry); on the entry page it is the h1
 * in the default size, like the doc titles. Ejected from
 * @docusaurus/theme-classic.
 */
export default function BlogPostItemHeaderTitle({
  className,
}: Props): ReactNode {
  const { metadata, isBlogPostPage } = useBlogPost();
  return (
    <div className={clsx(styles.title, className)}>
      <Heading level={isBlogPostPage ? 1 : 2}>{metadata.title}</Heading>
      {metadata.tags.length > 0 && <TagBadges tags={metadata.tags} />}
    </div>
  );
}
