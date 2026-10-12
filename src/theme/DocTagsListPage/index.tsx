import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  translateTagsPageTitle,
} from "@docusaurus/theme-common";
import TagsListByLetter from "@theme/TagsListByLetter";
import SearchMetadata from "@theme/SearchMetadata";
import type { Props } from "@theme/DocTagsListPage";
import { Heading, Section } from "@mittwald/flow-react-components";

/**
 * The tag overview: the title as Flow section (without separator, like a doc
 * page that starts with its title), followed by the letter sections.
 * Ejected from @docusaurus/theme-classic.
 */
export default function DocTagsListPage({ tags }: Props): ReactNode {
  const title = translateTagsPageTitle();
  return (
    <>
      <PageMetadata title={title} />
      <SearchMetadata tag="doc_tags_list" />
      <HtmlClassNameProvider
        className={clsx(ThemeClassNames.page.docsTagsListPage)}
      >
        <div className="container margin-vert--lg">
          <div className="row">
            <main className="col col--8 col--offset-2">
              <Section hideSeparator>
                <Heading level={1}>{title}</Heading>
              </Section>
              <TagsListByLetter tags={tags} />
            </main>
          </div>
        </div>
      </HtmlClassNameProvider>
    </>
  );
}
