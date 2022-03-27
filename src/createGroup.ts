import { concatPaths } from "./helpers";
import { ConcatPaths } from "./types";

export const createGroup = <
  GroupName extends string,
  BasePath extends string,
  Routes extends Record<string, string>,
>(
  name: GroupName,
  basePath: BasePath,
  routes: Readonly<Routes>,
): {
  [K in keyof Routes as K extends string
    ? `${GroupName}${K}`
    : never]: ConcatPaths<BasePath, Routes[K]>;
} => {
  const output: Record<string, string> = {};

  for (const key in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, key)) {
      output[name + key] = concatPaths(basePath, routes[key]);
    }
  }

  // @ts-expect-error
  return output;
};
