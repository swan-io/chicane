import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    exclude: ["__tests__/utils.ts"],
    include: ["__tests__/**/*.{ts,tsx}"],
  },
});
