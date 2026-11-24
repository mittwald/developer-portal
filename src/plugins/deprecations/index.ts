import fs from "node:fs/promises";
import path from "node:path";
import { load as loadHtml } from "cheerio";
import { Feed } from "feed";
import { createMDXLoaderRule } from "@docusaurus/mdx-loader";
import type { LoadContext, Plugin, RouteConfig } from "@docusaurus/types";
import type {
  LoadedContent as DocsLoadedContent,
  LoadedVersion,
  PropSidebarItem,
  PropVersionMetadata,
} from "@docusaurus/plugin-content-docs";
import { toVersionMetadataProp } from "@docusaurus/plugin-content-docs/lib/props.js";
import { type APIVersion, getOperationById, specs } from "../../openapi/specs";
import rehypeFlowSections from "../rehypeFlowSections";
import { type DeprecationSource, readDeprecations } from "./load";
import { deprecationMdx, overviewMdx } from "./mdx";
import remarkOperationLinks from "./remarkOperationLinks";
import { scopeLabel } from "./scopes";
import type {
  DeprecationScope,
  DeprecationSummary,
  DeprecationsGlobalData,
} from "./types";

export interface DeprecationsPluginOptions {
  /** Directory of the YAML files, relative to the site directory */
  path?: string;
  /** Path of the pages, relative to the docs version they belong to */
  routeBasePath?: string;
  /** Docs plugin instance and version that the pages are part of */
  docsPluginId?: string;
  docsVersion?: string;
  /** Docs sidebar shown on the pages; see `sidebar.ts` for its entries */
  sidebar?: string;
  title?: string;
  description?: string;
}

const PLUGIN_NAME = "deprecations";
const pageComponent = "@site/src/components/Deprecations/DeprecationMDXPage";

/** Element of the rendered pages whose content is used in the feed */
const FEED_CONTENT_ID = "deprecation-content";

function findOperation(operationId: string, apiVersion: string) {
  const spec = specs[apiVersion as APIVersion];
  const found = spec && getOperationById(spec, operationId);
  if (!found) {
    throw new Error(
      `Unknown API operation "${operationId}" (API ${apiVersion})`,
    );
  }
  return found;
}

/**
 * Deprecation announcements from structured YAML files
 * (`deprecations/<slug>.yaml`, see `./schema.ts`): an overview page and one
 * page per deprecation, both rendered as part of a docs version (docs layout
 * and sidebar), and RSS and Atom feeds.
 *
 * The pages are MDX generated from the YAML files, compiled like docs; the
 * Markdown fields of a deprecation may use MDX.
 */
export default async function deprecationsPlugin(
  context: LoadContext,
  // Docusaurus types plugin options as unknown
  pluginOptions: unknown,
): Promise<Plugin<DeprecationSource[]>> {
  const options = (pluginOptions ?? {}) as DeprecationsPluginOptions;
  const { siteDir, baseUrl, siteConfig, generatedFilesDir } = context;
  const contentPath = path.resolve(siteDir, options.path ?? "deprecations");
  const routeBasePath = options.routeBasePath ?? "deprecations";
  const docsPluginId = options.docsPluginId ?? "default";
  const docsVersion = options.docsVersion ?? "current";
  const sidebar = options.sidebar ?? "apiSidebar";
  const title = options.title ?? "Deprecations";
  const description =
    options.description ??
    "Deprecated APIs and product features of the mittwald platform";

  // Where Docusaurus puts the files of createData (and so the generated MDX)
  const dataDir = path.join(generatedFilesDir, PLUGIN_NAME, "default");

  const mdxLoaderRule = await createMDXLoaderRule({
    include: [dataDir + path.sep],
    options: {
      useCrossCompilerCache: siteConfig.future.faster.mdxCrossCompilerCache,
      admonitions: true,
      remarkPlugins: [
        [remarkOperationLinks, { validateOperation: findOperation }],
      ],
      rehypePlugins: [rehypeFlowSections],
      recmaPlugins: [],
      beforeDefaultRemarkPlugins: [],
      beforeDefaultRehypePlugins: [],
      staticDirs: siteConfig.staticDirectories.map((dir) =>
        path.resolve(siteDir, dir),
      ),
      siteDir,
      markdownConfig: siteConfig.markdown,
    },
  });

  const absoluteUrl = (url: string) =>
    url.startsWith("/") ? siteConfig.url + url : url;

  // Set in allContentLoaded, once the path of the docs version is known
  let basePermalink = "";
  let deprecations: DeprecationSummary[] = [];
  const feeds = () => ({
    rss: `${basePermalink}rss.xml`,
    atom: `${basePermalink}atom.xml`,
  });

  function summarize({ slug, file, input, status }: DeprecationSource) {
    try {
      const operations = input.operations.map((o) => ({
        ...o,
        summary: findOperation(o.operationId, o.apiVersion).operation.summary,
      }));
      const scopes = [
        ...new Set([
          ...input.scope,
          ...operations.map(
            (o) => `api/${o.apiVersion.replace("-preview", "")}`,
          ),
        ]),
      ].sort() as DeprecationScope[];

      const summary: DeprecationSummary = {
        slug,
        permalink: `${basePermalink}${slug}/`,
        title: input.title,
        summary: input.summary,
        scopes,
        status,
        announced: input.announced,
        sunset: input.sunset,
      };
      return { summary, operations };
    } catch (error) {
      throw new Error(
        `Invalid deprecation ${file}: ${(error as Error).message}`,
      );
    }
  }

  /*
   * Version metadata for the route tree of the deprecation pages. In its copy
   * of the sidebars, the entries of the deprecations (see `sidebar.ts`) get
   *  - the base URL (e.g. /de/), which sidebars.js cannot know, so that they
   *    are marked as active in every locale,
   *  - a (pseudo) doc ID for the links, as Docusaurus only takes links to
   *    docs into the breadcrumbs,
   *  - the overview as link of the category (see DocSidebarItem/Category).
   */
  function versionMetadataProp(version: LoadedVersion): PropVersionMetadata {
    const prop = toVersionMetadataProp(docsPluginId, version);
    const linkPrefix = `/${basePermalink.slice(baseUrl.length)}`;
    const withBaseUrl = (href: string) => `${baseUrl}${href.slice(1)}`;

    const tagItems = (items: PropSidebarItem[]): PropSidebarItem[] =>
      items.map((item) => {
        if (item.type === "category") {
          const href = item.customProps?.href;
          return {
            ...item,
            ...(typeof href === "string" && href.startsWith(linkPrefix)
              ? { href: withBaseUrl(href) }
              : {}),
            items: tagItems(item.items),
          };
        }
        if (item.type === "link" && item.href.startsWith(linkPrefix)) {
          const slug = item.href.slice(linkPrefix.length).replace(/\/$/, "");
          return {
            ...item,
            href: withBaseUrl(item.href),
            docId: `${PLUGIN_NAME}/${slug}`,
          };
        }
        return item;
      });

    return {
      ...prop,
      docsSidebars: {
        ...prop.docsSidebars,
        [sidebar]: tagItems(prop.docsSidebars[sidebar] ?? []),
      },
    };
  }

  return {
    name: PLUGIN_NAME,

    getPathsToWatch() {
      return [path.join(contentPath, "*.{yaml,yml}")];
    },

    async loadContent() {
      return readDeprecations(contentPath);
    },

    /*
     * The pages are part of a docs version: they get the same route tree as
     * docs (DocsRoot > DocVersionRoot > DocRoot), so that they are rendered
     * with the docs layout and the docs sidebar given by the `sidebar` route
     * attribute. Being the more specific parent route, this tree is matched
     * before the one of the docs plugin.
     */
    async allContentLoaded({ allContent, actions }) {
      const docs = allContent["docusaurus-plugin-content-docs"]?.[
        docsPluginId
      ] as DocsLoadedContent | undefined;
      const version = docs?.loadedVersions.find(
        (v) => v.versionName === docsVersion,
      );
      if (!version) {
        throw new Error(
          `Deprecations: docs version "${docsVersion}" of docs plugin "${docsPluginId}" not found`,
        );
      }
      if (!version.sidebars[sidebar]) {
        throw new Error(`Deprecations: docs sidebar "${sidebar}" not found`);
      }

      const rootPath = `${version.path.replace(/\/$/, "")}/${routeBasePath}`;
      basePermalink = `${rootPath}/`;

      const sources = allContent[PLUGIN_NAME]?.default as DeprecationSource[];
      const summarized = sources.map(summarize);
      deprecations = summarized.map(({ summary }) => summary);

      const createMdx = async (name: string, mdx: string) => {
        const file = await actions.createData(name, mdx);
        if (!file.startsWith(dataDir + path.sep)) {
          throw new Error(
            `Deprecations: generated ${file} outside of ${dataDir}, where the MDX loader expects it`,
          );
        }
        return file;
      };

      const pageRoutes: RouteConfig[] = [
        {
          path: basePermalink,
          exact: true,
          component: pageComponent,
          sidebar,
          modules: {
            content: await createMdx(
              "overview.mdx",
              overviewMdx({ title, description, feeds: feeds(), deprecations }),
            ),
          },
        },
        ...(await Promise.all(
          summarized.map(async ({ summary, operations }, index) => ({
            path: summary.permalink,
            exact: true,
            component: pageComponent,
            sidebar,
            modules: {
              content: await createMdx(
                `deprecation-${summary.slug}.mdx`,
                deprecationMdx({
                  deprecation: summary,
                  operations,
                  description: sources[index]!.input.description,
                  replacement: sources[index]!.input.replacement,
                }),
              ),
            },
          })),
        )),
      ];

      actions.addRoute({
        path: rootPath,
        exact: false,
        component: "@theme/DocsRoot",
        routes: [
          {
            path: rootPath,
            exact: false,
            component: "@theme/DocVersionRoot",
            props: { version: versionMetadataProp(version) },
            routes: [
              {
                path: rootPath,
                exact: false,
                component: "@theme/DocRoot",
                routes: pageRoutes,
              },
            ],
          },
        ],
      });

      // Lets the navbar mark the section of the sidebar as active
      actions.setGlobalData({
        path: basePermalink,
        sidebar,
      } satisfies DeprecationsGlobalData);
    },

    configureWebpack() {
      return { module: { rules: [mdxLoaderRule] } };
    },

    injectHtmlTags() {
      if (!basePermalink) {
        return {};
      }
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "alternate",
              type: "application/rss+xml",
              href: feeds().rss,
              title: `${siteConfig.title}: ${title} (RSS)`,
            },
          },
          {
            tagName: "link",
            attributes: {
              rel: "alternate",
              type: "application/atom+xml",
              href: feeds().atom,
              title: `${siteConfig.title}: ${title} (Atom)`,
            },
          },
        ],
      };
    },

    /*
     * Feed items contain the rendered page (like the feeds of the blog
     * plugin), without the title, with absolute URLs
     */
    async postBuild({ outDir }) {
      // outDir is the output directory of the current locale, which is
      // served at the base URL
      const outputPath = (permalink: string) =>
        path.join(outDir, permalink.slice(baseUrl.length));

      async function feedContent(d: DeprecationSummary): Promise<string> {
        const html = await fs.readFile(
          path.join(outputPath(d.permalink), "index.html"),
          "utf-8",
        );
        const $ = loadHtml(html);
        const content = $(`#${FEED_CONTENT_ID}`);
        // The title is the title of the feed item; heading anchors are of no
        // use in feed readers
        content.find("h1").closest("header").remove();
        content.find("h1, a.hash-link").remove();

        // Links and images relative to the page, like the blog plugin does
        const pageUrl = absoluteUrl(d.permalink);
        content.find("a[href]").each((_, a) => {
          a.attribs.href = String(new URL(a.attribs.href!, pageUrl));
        });
        content.find("img[src]").each((_, img) => {
          img.attribs.src = String(new URL(img.attribs.src!, pageUrl));
        });
        return content.html() ?? "";
      }

      // Feed items are announcements: newest first
      const items = [...deprecations].sort((a, b) =>
        b.announced.localeCompare(a.announced),
      );

      const feed = new Feed({
        id: absoluteUrl(basePermalink),
        link: absoluteUrl(basePermalink),
        title: `${siteConfig.title}: ${title}`,
        description,
        language: context.i18n.currentLocale,
        copyright: `Copyright © ${new Date().getFullYear()} Mittwald CM Service GmbH & Co. KG`,
        updated: items[0] ? new Date(items[0].announced) : undefined,
        feedLinks: {
          rss: absoluteUrl(feeds().rss),
          atom: absoluteUrl(feeds().atom),
        },
      });

      for (const d of items) {
        feed.addItem({
          id: absoluteUrl(d.permalink),
          link: absoluteUrl(d.permalink),
          title: d.title,
          date: new Date(d.announced),
          description: d.summary,
          content: await feedContent(d),
          category: d.scopes.map((scope) => ({
            name: scopeLabel(scope),
            term: scope,
          })),
        });
      }

      const feedDir = outputPath(basePermalink);
      await fs.mkdir(feedDir, { recursive: true });
      await fs.writeFile(path.join(feedDir, "rss.xml"), feed.rss2());
      await fs.writeFile(path.join(feedDir, "atom.xml"), feed.atom1());
    },
  };
}
