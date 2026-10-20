import React, { type ReactNode } from "react";
import { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/TagsListInline";
import Tag from "@theme/Tag";
import { Label, LabeledValue } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/** The tag badges of a page in a row */
export function TagBadges({ tags }: Props): ReactNode {
  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag.permalink}>
          <Tag {...tag} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The tags of a page as Flow labeled value with the tag badges as value.
 * Ejected from @docusaurus/theme-classic.
 */
export default function TagsListInline({ tags }: Props): ReactNode {
  // The existing translation ends with a colon, which Flow labels do not use
  const label = translate({
    id: "theme.tags.tagsListLabel",
    message: "Tags:",
    description: "The label alongside a tag list",
  }).replace(/:\s*$/, "");

  return (
    <LabeledValue>
      <Label>{label}</Label>
      <TagBadges tags={tags} />
    </LabeledValue>
  );
}
