import { concatRouteObjects, extractRoute } from "./concatRouteObjects";
import { ConcatRoutes } from "./types";

export const createGroup = <
  GroupName extends string,
  BaseRoute extends string,
  Routes extends Record<string, string>,
>(
  name: GroupName,
  baseRoute: BaseRoute,
  routes: Readonly<Routes>,
) => {
  const baseRouteObject = extractRoute(baseRoute);
  const output: Record<string, string> = {};

  for (const key in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, key)) {
      output[name + key] = concatRouteObjects(
        baseRouteObject,
        extractRoute(routes[key]),
      );
    }
  }

  return output as {
    [K in keyof Routes as K extends string
      ? `${GroupName}${K}`
      : never]: ConcatRoutes<BaseRoute, Routes[K]>;
  };
};
