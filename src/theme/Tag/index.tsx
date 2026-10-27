import React, { type ReactNode } from "react";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/Tag";
import { Badge } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * A tag as Flow badge, linked to its tag page; the count (on tag list pages)
 * follows the label in parentheses. Ejected from @docusaurus/theme-classic.
 */
export default function Tag({
  permalink,
  label,
  count,
  description,
}: Props): ReactNode {
  return (
    <Link rel="tag" href={permalink} title={description} className={styles.tag}>
      <Badge>{count ? `${label} (${count})` : label}</Badge>
    </Link>
  );
}
