import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import BlogSidebar from "@theme/BlogSidebar";
import type { Props } from "@theme/BlogLayout";
import styles from "./styles.module.css";

/**
 * Changelog layout like the docs: the sidebar at the left edge, separated by
 * a vertical line, the content (and table of contents) next to it. Ejected
 * from @docusaurus/theme-classic.
 */
export default function BlogLayout(props: Props): ReactNode {
  const { sidebar, toc, children, ...layoutProps } = props;
  const hasSidebar = !!sidebar && sidebar.items.length > 0;

  return (
    <Layout {...layoutProps}>
      <div className={styles.wrapper}>
        {hasSidebar && <BlogSidebar sidebar={sidebar} />}
        <div className={clsx("container margin-vert--lg", styles.content)}>
          <div className="row">
            <main className={clsx("col", toc && "col--9")}>{children}</main>
            {toc && <div className="col col--3">{toc}</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
