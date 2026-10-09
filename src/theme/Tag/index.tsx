import React, { type ReactNode } from "react";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/Tag";
import { Badge, Label, Text } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * A tag as Flow badge, linked to its tag page; the count (on tag list pages)
 * is shown as badge scope. Ejected from @docusaurus/theme-classic.
 */
export default function Tag({
  permalink,
  label,
  count,
  description,
}: Props): ReactNode {
  return (
    <Link rel="tag" href={permalink} title={description} className={styles.tag}>
      <Badge>
        {count ? (
          <>
            <Label>{label}</Label>
            <Text>{count}</Text>
          </>
        ) : (
          label
        )}
      </Badge>
    </Link>
  );
}
