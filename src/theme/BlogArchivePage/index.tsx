import React, { type ReactNode } from "react";
import DocusaurusLink from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import { useDateTimeFormat } from "@docusaurus/theme-common/internal";
import Layout from "@theme/Layout";
import type { Props } from "@theme/BlogArchivePage";
import { Heading, Link, Section } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * The changelog archive like the tag overview: the title as Flow section
 * (without separator), then one section per year with its entries as dark
 * inline Flow links, newest first. Ejected from @docusaurus/theme-classic.
 */

type Post = Props["archive"]["blogPosts"][number];

function Year({ year, posts }: { year: string; posts: Post[] }) {
  const dateTimeFormat = useDateTimeFormat({
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  return (
    <Section>
      <Heading level={2} id={year}>
        {year}
      </Heading>
      <ul className={styles.posts}>
        {posts.map((post) => (
          <li key={post.metadata.permalink}>
            <Link
              href={post.metadata.permalink}
              color="dark"
              inline
              linkComponent={DocusaurusLink}
            >
              {dateTimeFormat.format(new Date(post.metadata.date))} –{" "}
              {post.metadata.title}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** The posts (newest first) grouped by year, newest year first */
function listPostsByYears(posts: readonly Post[]) {
  const byYear = new Map<string, Post[]>();
  for (const post of posts) {
    const year = post.metadata.date.split("-")[0];
    byYear.set(year, [...(byYear.get(year) ?? []), post]);
  }
  return Array.from(byYear, ([year, yearPosts]) => ({
    year,
    posts: yearPosts,
  }));
}

export default function BlogArchive({ archive }: Props): ReactNode {
  const title = translate({
    id: "theme.blog.archive.title",
    message: "Archive",
    description: "The page & hero title of the blog archive page",
  });
  const description = translate({
    id: "theme.blog.archive.description",
    message: "Archive",
    description: "The page & hero description of the blog archive page",
  });
  const years = listPostsByYears(archive.blogPosts);
  return (
    <>
      <PageMetadata title={title} description={description} />
      <Layout>
        <div className="container margin-vert--lg">
          <div className="row">
            <main className="col col--8 col--offset-2">
              <Section hideSeparator>
                <Heading level={1}>{title}</Heading>
              </Section>
              {years.map((year) => (
                <Year key={year.year} {...year} />
              ))}
            </main>
          </div>
        </div>
      </Layout>
    </>
  );
}
