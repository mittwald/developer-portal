// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { Config } from "@docusaurus/types";
import { themes } from "prism-react-renderer";
import { Options, ThemeConfig } from "@docusaurus/preset-classic";
import { Options as ClientRedirectOptions } from "@docusaurus/plugin-client-redirects";

const lightCodeTheme = themes.oneLight;
const darkCodeTheme = themes.dracula;

const config: Config = {
  title: "mittwald Developer Portal",
  //tagline: 'Dinosaurs are cool',
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://contributor.mittwald.de",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "mittwald", // Usually your GitHub org/user name.
  projectName: "contributor-portal", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  // Broken anchors need to be ignored because of Redocusaurus
  // Reset to "throw" once https://github.com/rohit-gohri/redocusaurus/issues/321 is fixed
  onBrokenAnchors: "ignore",

  trailingSlash: true,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    localeConfigs: {
      en: {
        label: "English",
      },
      de: {
        label: "Deutsch",
      },
    },
  },

  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        createRedirects(path) {
          let newPath = path;
          if (newPath.includes("/platform")) {
            newPath = newPath.replace("/platform", "/technologies");
          }
          if (newPath.includes("/workloads")) {
            newPath = newPath.replace("/workloads", "/languages");
          }

          if (newPath !== path) {
            return newPath;
          }
        },
      } satisfies ClientRedirectOptions,
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "changelog",
        routeBasePath: "changelog",
        path: "./changelog",
        blogTitle: "Changelog",
        blogDescription:
          "Changelog for the mittwald APIs and mittwald cloud platform",
        blogSidebarTitle: "All change notes",
        blogSidebarCount: "ALL",
        showReadingTime: false,
        onInlineTags: "ignore",
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/mittwald/contributor-portal/tree/master/",
          lastVersion: "current",
          versions: {
            current: {
              label: "API v2",
              path: "v2",
              banner: "none",
              badge: false,
            },
            v1: {
              label: "API v1",
              path: "v1",
              banner: "unmaintained",
            },
          },
        },
        blog: {
          showReadingTime: false,
          onInlineTags: "ignore",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Options,
    ],
  ],

  themeConfig: {
    navbar: {
      // style: 'primary',
      title: "Contributor Portal",
      logo: {
        alt: "mittwald",
        src: "img/mittwald-logo.svg",
      },
      items: [
        {
          type: "doc",
          docId: "api/intro",
          position: "left",
          label: "API Docs",
        },
        {
          type: "doc",
          docId: "cli/index",
          position: "left",
          label: "CLI",
        },
        {
          type: "doc",
          docId: "/category/platform",
          position: "left",
          label: "Platform",
        },
        {
          type: "doc",
          docId: "contribution/index",
          position: "left",
          label: "Contribution",
        },
        {
          type: "doc",
          docId: "reference/index",
          position: "left",
          label: "Reference",
        },
        {
          to: "/changelog",
          label: "Changelog",
          position: "left",
        },
        {
          href: "https://github.com/mittwald/contributor-portal",
          label: "GitHub",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "API usage",
              to: "/docs/v2/api/intro",
            },
            {
              label: "Platform",
              to: "/docs/v2/category/platform",
            },
            {
              label: "SDKs and Libraries",
              to: "/docs/v2/category/sdks-and-libraries",
            },
            {
              label: "Reference",
              to: "/docs/v2/reference",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Feedback",
              href: "https://github.com/mittwald/contributor-portal/issues",
            },
            {
              label: "Agency Hub (german)",
              href: "https://agenturen.mittwald.de",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Terms of Service",
              href: "https://www.mittwald.de/agb",
            },
            {
              label: "Privacy Policy",
              href: "https://www.mittwald.de/datenschutz",
            },
            {
              label: "Legal",
              href: "https://www.mittwald.de/impressum",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mittwald CM Service GmbH & Co. KG. Built with Docusaurus.`,
    },
    announcementBar: {
      content: "This site is a <b>private preview</b> for the mittwald contributor portal. The documentation provided on this site is a work in progress and <b>confidential</b>.",
      isCloseable: false,
      backgroundColor: "#ff9343",
      textColor: "#fff"
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ["php", "shell-session"],
    },
  } satisfies ThemeConfig,
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid']
};

module.exports = config;
