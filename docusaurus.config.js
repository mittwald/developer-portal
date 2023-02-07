// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'mittwald Developer Portal',
    //tagline: 'Dinosaurs are cool',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://developers.mittwald.de',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'mittwald', // Usually your GitHub org/user name.
    projectName: 'developer-portal', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'throw',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        localeConfigs: {
            en: {
                label: 'English',
            },
            de: {
                label: 'Deutsch',
            }
        }
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                    lastVersion: 'current',
                    versions: {
                        current: {
                            label: 'API v2',
                            path: 'v2',
                        },
                    },
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                style: 'primary',
                title: 'Developer Portal',
                logo: {
                    alt: 'mittwald',
                    src: 'img/mittwald-logo.svg',
                },
                items: [
                    {
                        type: 'doc',
                        docId: '/category/how-tos',
                        position: 'left',
                        label: 'How-Tos',
                    },
                    //{to: '/blog', label: 'Blog', position: 'left'},
                    {
                        href: 'https://github.com/mittwald/developer-portal',
                        label: 'GitHub',
                        position: 'right',
                    },
                    {
                        type: 'localeDropdown',
                        position: 'right',
                    }
                ],
            },
            footer: {
                style: 'dark',
                /*logo: {
                    src: 'img/mittwald-icon-negative.svg',
                },*/
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Tutorial',
                                to: '/docs/v2/intro',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Feedback',
                                href: 'https://github.com/mittwald/developer-portal/issues',
                            },
                            {
                                label: 'Agency Hub (german)',
                                href: 'https://agenturen.mittwald.de',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'Terms of Service',
                                href: 'https://www.mittwald.de/agb',
                            },
                            {
                                label: 'Privacy Policy',
                                href: 'https://www.mittwald.de/datenschutz',
                            },
                            {
                                label: 'Legal',
                                href: 'https://www.mittwald.de/impressum',
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
