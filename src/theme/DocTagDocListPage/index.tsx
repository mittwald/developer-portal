import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  usePluralForm,
} from "@docusaurus/theme-common";
import Translate, { translate } from "@docusaurus/Translate";
import SearchMetadata from "@theme/SearchMetadata";
import Unlisted from "@theme/ContentVisibility/Unlisted";
import type { Props } from "@theme/DocTagDocListPage";
import { Heading, Link, Section, Text } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * Docs of a tag as Flow sections, each with a "Learn more" link to the doc.
 * Swizzled (ejected) from @docusaurus/theme-classic.
 */

// Very simple pluralization
function useNDocsTaggedPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: "theme.docs.tagDocListPageTitle.nDocsTagged",
          description:
            'Pluralized label for "{count} docs tagged". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "One doc tagged|{count} docs tagged",
        },
        { count },
      ),
    );
}

function usePageTitle(props: Props): string {
  const nDocsTaggedPlural = useNDocsTaggedPlural();
  return translate(
    {
      id: "theme.docs.tagDocListPageTitle",
      description: "The title of the page for a docs tag",
      message: '{nDocsTagged} with "{tagName}"',
    },
    {
      nDocsTagged: nDocsTaggedPlural(props.tag.count),
      tagName: props.tag.label,
    },
  );
}

function DocItem({ doc }: { doc: Props["tag"]["items"][number] }) {
  return (
    <Section>
      <Heading level={2}>{doc.title}</Heading>
      {doc.description && <Text elementType="p">{doc.description}</Text>}
      <Link
        href={doc.permalink}
        className={styles.moreLink}
        aria-label={translate(
          {
            id: "theme.blog.post.readMoreLabel",
            message: "Read more about {title}",
            description:
              "The ARIA label for the link to full blog posts from excerpts",
          },
          { title: doc.title },
        )}
      >
        <Translate id="index.cta.more">Learn more</Translate>
      </Link>
    </Section>
  );
}

function DocTagDocListPageMetadata({
  title,
  tag,
}: Props & { title: string }): ReactNode {
  return (
    <>
      <PageMetadata title={title} description={tag.description} />
      <SearchMetadata tag="doc_tag_doc_list" />
    </>
  );
}

function DocTagDocListPageContent({
  tag,
  title,
}: Props & { title: string }): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.page.docsTagDocListPage)}
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--8 col--offset-2">
            {tag.unlisted && <Unlisted />}
            <Section>
              <Heading level={1}>{title}</Heading>
              {tag.description && (
                <Text elementType="p">{tag.description}</Text>
              )}
              <Link href={tag.allTagsPath}>
                <Translate
                  id="theme.tags.tagsPageLink"
                  description="The label of the link targeting the tag list page"
                >
                  View all tags
                </Translate>
              </Link>
            </Section>
            {tag.items.map((doc) => (
              <DocItem key={doc.id} doc={doc} />
            ))}
          </main>
        </div>
      </div>
    </HtmlClassNameProvider>
  );
}

export default function DocTagDocListPage(props: Props): ReactNode {
  const title = usePageTitle(props);
  return (
    <>
      <DocTagDocListPageMetadata {...props} title={title} />
      <DocTagDocListPageContent {...props} title={title} />
    </>
  );
}
