import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import ts from "typescript-eslint";

const typescriptRules = [
  ts.configs.eslintRecommended,
  ...ts.configs.recommended,
]
  .map((config) => config.rules)
  .reduce((acc, rules) => ({ ...acc, ...rules }), {});

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["dist/**", "docs/**"],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],

    plugins: {
      "@typescript-eslint": ts.plugin,
      "react-hooks": reactHooks,
    },

    languageOptions: {
      sourceType: "module",
      parser: ts.parser,

      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },

    rules: {
      ...js.configs.recommended.rules,
      ...typescriptRules,

      curly: "error",
      "no-implicit-coercion": "error",
      "no-param-reassign": "error",
      "object-shorthand": "error",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-check": true, "ts-expect-error": false },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],

      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-base-to-string": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-unnecessary-type-arguments": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
    },
  },
];
