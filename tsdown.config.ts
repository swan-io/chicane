import { defineConfig, type UserConfig } from "tsdown";

const common: UserConfig = {
  platform: "browser",
  entry: "./src/**",
  outDir: "./dist",
  deps: { skipNodeModulesBundle: true },
  minify: false,
  sourcemap: true,
  target: false,
  treeshake: false,
  unbundle: true,
};

export default defineConfig([
  {
    ...common,
    format: "module",
    clean: true,
    dts: true,
    outExtensions: () => ({
      js: ".mjs",
      dts: ".d.ts",
    }),
  },
  {
    ...common,
    format: "commonjs",
    clean: false,
    dts: false,
    outExtensions: () => ({
      js: ".js",
    }),
  },
]);
