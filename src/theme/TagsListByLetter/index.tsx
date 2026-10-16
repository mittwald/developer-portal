import React, { type ReactNode } from "react";
import { listTagsByLetters } from "@docusaurus/theme-common";
import type { Props } from "@theme/TagsListByLetter";
import Tag from "@theme/Tag";
import { Heading, Section } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * The tags grouped by their first letter, each letter as Flow section (with
 * separator) instead of an article with <hr>. Ejected from
 * @docusaurus/theme-classic.
 */
export default function TagsListByLetter({ tags }: Props): ReactNode {
  return (
    <>
      {listTagsByLetters(tags).map((letterEntry) => (
        <Section key={letterEntry.letter}>
          <Heading level={2} id={letterEntry.letter}>
            {letterEntry.letter}
          </Heading>
          <ul className={styles.tags}>
            {letterEntry.tags.map((tag) => (
              <li key={tag.permalink}>
                <Tag {...tag} />
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
