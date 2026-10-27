import React, { type ReactNode } from "react";
import Translate, { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/BlogPostItem/Footer/ReadMoreLink";
import { Link } from "@mittwald/flow-react-components";

/**
 * Link from a changelog excerpt to the full entry as Flow link. Ejected from
 * @docusaurus/theme-classic.
 */
export default function BlogPostItemFooterReadMoreLink({
  blogPostTitle,
  to,
}: Props): ReactNode {
  return (
    <Link
      href={to}
      aria-label={translate(
        {
          message: "Read more about {title}",
          id: "theme.blog.post.readMoreLabel",
          description:
            "The ARIA label for the link to full blog posts from excerpts",
        },
        { title: blogPostTitle },
      )}
    >
      <Translate
        id="theme.blog.post.readMore"
        description="The label used in blog post item excerpts to link to full blog posts"
      >
        Read more
      </Translate>
    </Link>
  );
}
