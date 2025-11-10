import { concatRoutes } from "./concatRoutes";
import { parseRoute } from "./history";
import type { ConcatRoutes } from "./types";

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

  for (const key in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, key)) {
      output[name + key] = concatRoutes(
        baseRouteObject,
        parseRoute(routes[key]),
      );
    }
  }

  return output as {
    [K in keyof Routes as K extends string
      ? `${GroupName}${K}`
      : never]: ConcatRoutes<BaseRoute, Routes[K]>;
  };
};
