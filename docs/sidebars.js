/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "doc",
      id: "getting-started",
    },
    {
      type: "category",
      label: "Guide",
      collapsed: false,
      items: [
        "creating-your-router",
        "route-pattern-syntax",
        "matching-some-routes",
        "linking-to-a-route",
        "utility-types",
        "server-side-rendering",
      ],
    },
    {
      type: "category",
      label: "Accessibility",
      collapsed: false,
      items: ["route-focus"],
    },
    {
      type: "category",
      label: "API Reference",
      collapsed: false,
      items: [
        "top-level-api",
        "router",
        "components",
        "hooks",
        "lower-level-api",
      ],
    },
  ],
};

export default sidebars;
