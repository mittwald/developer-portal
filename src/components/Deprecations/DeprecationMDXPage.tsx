import React, { type ComponentType } from "react";
import clsx from "clsx";
import { PageMetadata, ThemeClassNames } from "@docusaurus/theme-common";
import type { TOCItem } from "@docusaurus/mdx-loader";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import MDXContent from "@theme/MDXContent";
import TOC from "@theme/TOC";
import styles from "./styles.module.css";

/** The compiled MDX module, with its named exports attached by Docusaurus */
type MDXPage = ComponentType & {
  frontMatter: { title: string; description: string };
  toc: readonly TOCItem[];
};

/**
 * Route component of the deprecations plugin, rendered below DocRoot (which
 * provides navbar, docs sidebar and footer): the MDX the plugin generated, in
 * the structure of a doc page (DocItem/Layout of @docusaurus/theme-classic),
 * without pagination. The feed of the plugin takes the content from the
 * element with the ID `deprecation-content`.
 */
export default function DeprecationMDXPage({
  content: Page,
}: {
  content: MDXPage;
}) {
  const { title, description } = Page.frontMatter;
  const hasToc = Page.toc.length > 0;

  return (
    <>
      <PageMetadata title={title} description={description} />
      <div className="row">
        <div className={clsx("col", hasToc && styles.mainColumn)}>
          <article>
            <DocBreadcrumbs />
            <div
              id="deprecation-content"
              className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}
            >
              <MDXContent>
                <Page />
              </MDXContent>
            </div>
          </article>
        </div>
        {hasToc && (
          <div className="col col--3">
            <TOC
              toc={Page.toc}
              className={ThemeClassNames.docs.docTocDesktop}
            />
          </div>
        )}
      </div>
    </>
  );
}
