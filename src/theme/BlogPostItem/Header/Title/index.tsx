import React, { type ReactNode } from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import type { Props } from "@theme/BlogPostItem/Header/Title";
import { Heading } from "@mittwald/flow-react-components";

/**
 * Title of a changelog entry as Flow heading. In the list it is not linked
 * (the "Read more" link leads to the entry); on the entry page it is the h1,
 * sized like the doc titles. Ejected from @docusaurus/theme-classic.
 */
export default function BlogPostItemHeaderTitle({ className }: Props): ReactNode {
  const { metadata, isBlogPostPage } = useBlogPost();
  return (
    <Heading
      level={isBlogPostPage ? 1 : 2}
      size={isBlogPostPage ? "l" : "m"}
      className={className}
    >
      {metadata.title}
    </Heading>
  );
}
