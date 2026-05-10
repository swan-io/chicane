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
    curly: "error",
    "no-implicit-coercion": "error",
    "no-param-reassign": "error",
    "no-shadow": "off",
    "object-shorthand": "error",

    "react/exhaustive-deps": "warn",
    "react/no-children-prop": "off",
    "react/rules-of-hooks": "error",

    "typescript/ban-ts-comment": [
      "error",
      { "ts-check": true, "ts-expect-error": false },
    ],
    "typescript/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", ignoreRestSiblings: true },
    ],

    "typescript/consistent-return": "off",
    "typescript/consistent-type-definitions": ["error", "type"],
    "typescript/no-base-to-string": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-explicit-any": "error",
    "typescript/no-non-null-assertion": "error",
    "typescript/no-unnecessary-boolean-literal-compare": "error",
    "typescript/no-unnecessary-condition": "error",
    "typescript/no-unnecessary-qualifier": "error",
    "typescript/no-unnecessary-type-arguments": "error",
    "typescript/no-unnecessary-type-parameters": "off",
    "typescript/no-unsafe-type-assertion": "off",
    "typescript/prefer-nullish-coalescing": "error",
    "typescript/prefer-optional-chain": "error",
    "typescript/strict-boolean-expressions": "error",
  },
});
