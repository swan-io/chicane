// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: "Chicane",
  tagline: "A safe router for React and TypeScript",
  url: "https://swan-io.github.io",
  baseUrl: "/chicane/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "swan-io", // Usually your GitHub org/user name.
  projectName: "chicane", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/swan-io/chicane/edit/main/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Chicane",
        logo: {
          alt: "Chicane",
          src: "img/logo.svg",
        },
        items: [
          {
            href: "/getting-started",
            label: "Getting started",
            position: "left",
          },
          {
            href: "/top-level-api",
            label: "API",
            position: "left",
          },
          {
            href: "https://github.com/swan-io/chicane/tree/main/example",
            label: "Example app",
            position: "left",
          },
          {
            href: "https://github.com/swan-io/chicane",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        logo: {
          alt: "Swan Open Source",
          src: "img/swan-opensource.svg",
          href: "https://swan.io",
          width: 116,
          height: 43,
        },
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} Swan`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};
