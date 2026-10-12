import React from "react";
import { Markdown } from "@mittwald/flow-react-components";
import styles from "./Description.module.css";

/**
 * A description from the API spec (operation, parameter, response), rendered
 * as Markdown with Flow components. Headings start below the page's section
 * headings.
 */
export default function Description({ children }: { children: string }) {
  return (
    <Markdown className={styles.description} headingOffset={2}>
      {children}
    </Markdown>
  );
}
