import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import type { Props } from "@theme/DocItem/Content";
import MDXComponents from "@theme/MDXComponents";
import MDXContent from "@theme/MDXContent";
import EditThisPage from "@theme/EditThisPage";
import { Section } from "@mittwald/flow-react-components";
import { TitleActionsContext } from "@site/src/theme/MDXComponents/titleActions";

/**
 * Doc content with the title from the front matter rendered like a Markdown
 * h1, i.e. as Flow heading; the edit link is shown next to the title (from
 * the front matter or the Markdown). Ejected from @docusaurus/theme-classic.
 */

const MDXH1 = MDXComponents.h1;

/*
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/
function useSyntheticTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === "undefined";
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({ children }: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const { editUrl } = useDoc().metadata;
  return (
    <TitleActionsContext.Provider
      value={editUrl && <EditThisPage editUrl={editUrl} />}
    >
      <div className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}>
        {/* A section of its own (the Markdown title is in the first
            section of the content); no separator below the title */}
        {syntheticTitle && (
          <Section hideSeparator>
            <MDXH1>{syntheticTitle}</MDXH1>
          </Section>
        )}
        <MDXContent>{children}</MDXContent>
      </div>
    </TitleActionsContext.Provider>
  );
}
