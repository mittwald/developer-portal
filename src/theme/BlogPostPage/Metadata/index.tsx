import React from "react";
import Head from "@docusaurus/Head";
import { useLocation } from "@docusaurus/router";
import type { WrapperProps } from "@docusaurus/types";
import BlogPostPageMetadata from "@theme-original/BlogPostPage/Metadata";

type Props = WrapperProps<typeof BlogPostPageMetadata>;

export default function BlogPostPageMetadataWrapper(
  props: Props,
): React.JSX.Element {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const isChangelogPost =
    normalizedPath.startsWith("/changelog/") ||
    normalizedPath.startsWith("/de/changelog/");

  return (
    <>
      <BlogPostPageMetadata {...props} />
      {isChangelogPost && (
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
      )}
    </>
  );
}