import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["__tests__/**", "docs/**", "example/**"],
  options: { typeAware: true },
  plugins: ["typescript", "react"],
  categories: {
    correctness: "error",
    perf: "error",
    suspicious: "error",
  },
  rules: {
    "no-shadow": "off",

    "react/no-children-prop": "off",

    "typescript/consistent-return": "off",
    "typescript/no-unnecessary-type-parameters": "off",
    "typescript/no-unsafe-type-assertion": "off",
  },
});
