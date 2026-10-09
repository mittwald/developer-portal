import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import AuthorSocials from "@theme/Blog/Components/Author/Socials";
import type { Props } from "@theme/Blog/Components/Author";
import {
  Avatar,
  Badge,
  Combine,
  Image,
  Initials,
  Text,
} from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Author of a changelog entry as Flow avatar combined with name and title.
 * Ejected from @docusaurus/theme-classic.
 */
export default function BlogAuthor({
  author,
  className,
  count,
}: Props): ReactNode {
  const { name, title, url, imageURL, email, page } = author;
  const link =
    page?.permalink || url || (email && `mailto:${email}`) || undefined;

  const displayName = name && <strong translate="no">{name}</strong>;

  return (
    <div className={clsx(styles.author, className)}>
      <Combine>
        <Avatar label={name}>
          {imageURL ? (
            <Image src={imageURL} alt={name ?? ""} />
          ) : (
            <Initials>{name ?? ""}</Initials>
          )}
        </Avatar>
        {(name || title) && (
          <Text>
            {displayName && link ? (
              <Link href={link} className={styles.name}>
                {displayName}
              </Link>
            ) : (
              displayName
            )}
            {count !== undefined && (
              <>
                {" "}
                <Badge>{count}</Badge>
              </>
            )}
            {/* Combine stacks name and title, as in Flow's example */}
            {title}
          </Text>
        )}
      </Combine>
      <AuthorSocials author={author} />
    </div>
  );
}
