import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import { readDeprecations } from "./load";

type SidebarItemConfig = Extract<SidebarsConfig[string], unknown[]>[number];

interface DeprecationSidebarOptions {
  /** Directory of the YAML files */
  contentPath: string;
  /**
   * URL path of the deprecation pages (without base URL), i.e. the path of
   * the docs version plus the plugin's `routeBasePath`
   */
  basePath: string;
  label?: string;
}

/**
 * Sidebar category for `sidebars.js`, linking to the overview, with the
 * active deprecations and the past ones in a collapsed subcategory. The pages
 * themselves are created by the deprecations plugin, so the entries are
 * links; categories can only link to docs, so the overview link is passed in
 * `customProps.href` (see src/theme/DocSidebarItem/Category).
 */
export function deprecationsSidebarCategory({
  contentPath,
  basePath,
  label = "Deprecations",
}: DeprecationSidebarOptions): SidebarItemConfig {
  const deprecations = readDeprecations(contentPath);
  const link = (title: string, slug: string) => ({
    type: "link" as const,
    label: title,
    href: `${basePath}/${slug}/`,
  });

  // Docusaurus rejects categories without items (and without a doc link)
  if (deprecations.length === 0) {
    return { type: "link", label, href: `${basePath}/` };
  }

  const active = deprecations.filter((d) => d.status === "active");
  const past = deprecations.filter((d) => d.status === "past");

  return {
    type: "category",
    label,
    collapsed: true,
    customProps: { href: `${basePath}/` },
    items: [
      ...active.map((d) => link(d.input.title, d.slug)),
      ...(past.length > 0
        ? [
            {
              type: "category" as const,
              label: "Past",
              collapsed: true,
              items: past.map((d) => link(d.input.title, d.slug)),
            },
          ]
        : []),
    ],
  };
}
