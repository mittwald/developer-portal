// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "mittwald Developer Portal",
  //tagline: 'Dinosaurs are cool',
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://developer.mittwald.de",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "mittwald", // Usually your GitHub org/user name.
  projectName: "developer-portal", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
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

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/mittwald/developer-portal/tree/master/",
          lastVersion: "current",
          versions: {
            current: {
              label: "API v2",
              path: "v2",
            },
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
    [
      "redocusaurus",
      {
        specs: [
          {
            id: "v1",
            spec: "https://api.mittwald.de/v1/swagger/swagger-public.json",
            route: "/reference/v1",
          },
          {
            id: "v2",
            spec: "https://api.mittwald.de/openapi?withRedirects=false",
            route: "/reference/v2",
          },
        ],
        theme: {
          primaryColor: "#27367b",
          primaryColorDark: "#abb9ff",
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      navbar: {
        // style: 'primary',
        title: "Developer Portal",
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
            docId: "/category/technologies",
            position: "left",
            label: "Technologies",
          },
          {
            href: "/reference/v2",
            position: "left",
            label: "Reference",
          },
          //{to: '/blog', label: 'Blog', position: 'left'},
          {
            href: "https://github.com/mittwald/developer-portal",
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
                label: "Technologies",
                to: "/docs/v2/category/technologies",
              },
              {
                label: "SDKs and Libraries",
                to: "/docs/v2/category/sdks-and-libraries",
              },
              {
                label: "Reference",
                to: "/reference/v2",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Feedback",
                href: "https://github.com/mittwald/developer-portal/issues",
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
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
