import { concatRoutes } from "./concatRoutes.ts";
import { forEach } from "./helpers.ts";
import { parseRoute } from "./history.ts";
import type { ConcatRoutes } from "./types.ts";

export const createGroup = <
  GroupName extends string,
  BaseRoute extends string,
  Routes extends Record<string, string>,
>(
  name: GroupName,
  baseRoute: BaseRoute,
  routes: Readonly<Routes>,
) => {
  const baseRouteObject = parseRoute(baseRoute);
  const output: Record<string, string> = {};

  forEach(routes, (key, route) => {
    output[name + key] = concatRoutes(baseRouteObject, parseRoute(route));
  });

  return output as {
    [K in keyof Routes as K extends string
      ? `${GroupName}${K}`
      : never]: ConcatRoutes<BaseRoute, Routes[K]>;
  };
};
