import React, { type ComponentProps } from "react";
import { Markdown } from "@mittwald/flow-react-components";
import MDXComponents from "@theme/MDXComponents";
import styles from "./Description.module.css";

/**
 * Links like in the docs (src/theme/MDXComponents): internal ones via the
 * Docusaurus router in the same tab, inline code taking the link color. Flow's
 * Markdown would open every link in a new tab. `node` (the Markdown syntax
 * tree node) is not passed on to the DOM.
 */
function DescriptionLink({
  node: _node,
  ...props
}: ComponentProps<"a"> & { node?: unknown }) {
  return <MDXComponents.a {...props} />;
}

const components = { a: DescriptionLink };

/**
 * A description from the API spec (operation, parameter, response), rendered
 * as Markdown with Flow components. Headings start below the page's section
 * headings.
 */
export default function Description({ children }: { children: string }) {
  return (
    <Markdown
      className={styles.description}
      headingOffset={2}
      components={components}
    >
      {children}
    </Markdown>
  );
}
