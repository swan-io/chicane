const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Chicane",
  tagline: "A safe router for React and TypeScript",
  url: "https://swan-io.github.io",
  baseUrl: "/chicane/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  organizationName: "swan-io", // Usually your GitHub org/user name.
  projectName: "chicane", // Usually your repo name.
  themeConfig: {
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
          href: "https://github.com/zoontek/react-chicane/example",
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
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/swan-io/chicane/edit/main/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
