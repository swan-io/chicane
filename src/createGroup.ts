import { concatRoutes, parseRoute } from "./concatRoutes";
import { ConcatRoutes } from "./types";

const areaParsedRoute = parseRoute("/*");

export const createGroup = <
  GroupName extends string,
  BaseRoute extends string,
  Routes extends Record<string, string>,
>(
  name: GroupName,
  baseRoute: BaseRoute,
  routes: Readonly<Routes>,
) => {
  const baseParsedRoute = parseRoute(baseRoute);
  const output: Record<string, string> = {};

  for (const key in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, key)) {
      output[name + key] = concatRoutes(
        baseParsedRoute,
        parseRoute(routes[key]),
      );
    }
  }

  type WithArea = Omit<{ Area: "/*" }, keyof Routes> & Routes;

  if (!Object.prototype.hasOwnProperty.call(routes, "Area")) {
    output[name + "Area"] = concatRoutes(baseParsedRoute, areaParsedRoute);
  }

  return output as {
    [K in keyof WithArea as K extends string
      ? `${GroupName}${K}`
      : never]: ConcatRoutes<BaseRoute, WithArea[K]>;
  };
};
