import type { OperationReference } from "./schema";
import type { DeprecationSummary } from "./types";

/*
 * MDX for the deprecation pages, compiled by the plugin's mdx-loader rule
 * like docs (MDXComponents, admonitions, Flow sections, …).
 */

const COMPONENTS = "@site/src/components/Deprecations";

/** Escapes text for use in Markdown (titles and summaries are plain text) */
function escapeMarkdown(text: string): string {
  return text.replace(/[\\`*_{}[\]()<>#+\-.!|~]/g, "\\$&");
}

/** A value as JSX attribute expression */
function prop(value: unknown): string {
  return `{${JSON.stringify(value)}}`;
}

function frontMatter(title: string, description: string): string {
  // JSON strings are valid YAML
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---`;
}

export function overviewMdx({
  title,
  description,
  feeds,
  deprecations,
}: {
  title: string;
  description: string;
  feeds: { rss: string; atom: string };
  deprecations: DeprecationSummary[];
}): string {
  const sections = [
    ["upcoming", "Upcoming", deprecations.filter((d) => d.status === "active")],
    ["past", "Past", deprecations.filter((d) => d.status === "past")],
  ] as const;

  return [
    frontMatter(title, description),
    `import { DeprecationFeeds, DeprecationTable } from "${COMPONENTS}";`,
    `# ${escapeMarkdown(title)}`,
    `${escapeMarkdown(description)}. Deprecated APIs and features keep working until their sunset date.`,
    `<DeprecationFeeds rss=${prop(feeds.rss)} atom=${prop(feeds.atom)} />`,
    deprecations.length === 0 && "There are no deprecations at the moment.",
    ...sections
      .filter(([, , items]) => items.length > 0)
      .map(
        ([id, label, items]) =>
          `## ${label} {#${id}}\n\n<DeprecationTable deprecations=${prop(items)} />`,
      ),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function deprecationMdx({
  deprecation: d,
  operations,
  description,
  replacement,
}: {
  deprecation: DeprecationSummary;
  operations: (OperationReference & { summary?: string })[];
  /** MDX */
  description: string;
  /** MDX */
  replacement?: string;
}): string {
  const operationItems = operations.map(
    (o) =>
      `- <OperationLink operation=${prop(o.operationId)} apiVersion=${prop(o.apiVersion)} />` +
      (o.summary ? ` – ${escapeMarkdown(o.summary)}` : ""),
  );

  return [
    frontMatter(d.title, d.summary),
    `import OperationLink from "@site/src/components/OperationLink";`,
    `import { DeprecationBadges, DeprecationFacts } from "${COMPONENTS}";`,
    `<DeprecationBadges status=${prop(d.status)} scopes=${prop(d.scopes)} />`,
    `# ${escapeMarkdown(d.title)}`,
    `<DeprecationFacts announced=${prop(d.announced)} sunset=${prop(d.sunset ?? null)} />`,
    escapeMarkdown(d.summary),
    operationItems.length > 0 &&
      `## Affected API operations {#affected-operations}\n\n${operationItems.join("\n")}`,
    `## Details {#details}\n\n${description.trim()}`,
    replacement && `## Replacement {#replacement}\n\n${replacement.trim()}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
