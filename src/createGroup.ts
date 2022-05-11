import { concatRoutes, extractRoute } from "./concatRoutes";
import { ConcatRoutes } from "./types";

export const createGroup = <
  GroupName extends string,
  BaseRoute extends string,
  Routes extends Record<string, string>,
>(
  name: GroupName,
  baseRoute: BaseRoute,
  routes: Readonly<Routes>,
): {
  [K in keyof Routes as K extends string
    ? `${GroupName}${K}`
    : never]: ConcatRoutes<BaseRoute, Routes[K]>;
} => {
  const baseRouteObject = extractRoute(baseRoute);
  const output: Record<string, string> = {};

  for (const key in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, key)) {
      output[name + key] = concatRoutes(
        baseRouteObject,
        extractRoute(routes[key]),
      );
    }
  }

  // @ts-expect-error
  return output;
};
