import { createPath } from "history";
import * as React from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { concatRouteObjects, extractRoute } from "./concatRouteObjects";
import { areRouteEqual, first, identity } from "./helpers";
import { getLocation, history, subscribeToLocation } from "./history";
import { getMatcher, match, matchToHistoryPath } from "./matcher";
import {
  ExtractRoutesParams,
  GetAreaRoutes,
  Matcher,
  Params,
  ParamsArg,
  PrependBasePath,
  RouteObject,
  Simplify,
} from "./types";

export const createRouter = <
  Routes extends Record<string, string>,
  BasePath extends string = string,
>(
  routes: Readonly<Routes>,
  options: {
    basePath?: BasePath;
  } = {},
) => {
  type RoutesWithBasePath = PrependBasePath<BasePath, Routes>;
  type AreaRoutes = GetAreaRoutes<RoutesWithBasePath>;
  type AreaRoutesParams = ExtractRoutesParams<AreaRoutes>;
  type FiniteRoutes = Omit<RoutesWithBasePath, keyof AreaRoutes>;
  type FiniteRoutesParams = ExtractRoutesParams<FiniteRoutes>;
  type RoutesParams = AreaRoutesParams & FiniteRoutesParams;

  const { basePath = "" } = options;

  const baseRoute: RouteObject = {
    path: extractRoute(basePath).path,
    search: "", // search and hash are not supported in basePath
    hash: "",
  };

  const matchers = {} as Record<keyof Routes, Matcher>;
  const rankedMatchers: Matcher[] = []; // higher to lower

  for (const routeName in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, routeName)) {
      const matcher = getMatcher(
        routeName,
        basePath !== ""
          ? concatRouteObjects(baseRoute, extractRoute(routes[routeName]))
          : routes[routeName],
      );

      matchers[routeName] = matcher;
      rankedMatchers.push(matcher);
    }
  }

  rankedMatchers.sort(
    (matcherA, matcherB) => matcherB.ranking - matcherA.ranking,
  );

  const createURLFunctions = {} as {
    [RouteName in keyof FiniteRoutes]: (
      ...args: ParamsArg<FiniteRoutesParams[RouteName]>
    ) => string;
  };

  for (let index = 0; index < rankedMatchers.length; index++) {
    const matcher = rankedMatchers[index];

    if (matcher != null && !matcher.isArea) {
      const routeName = matcher.name as keyof FiniteRoutes;

      createURLFunctions[routeName] = (params?: Params) =>
        createPath(matchToHistoryPath(matchers[routeName], params));
    }
  }

  const useRoute = <RouteName extends keyof FiniteRoutes | keyof AreaRoutes>(
    routeNames: ReadonlyArray<RouteName>,
  ): RouteName extends string
    ?
        | {
            key: string;
            name: RouteName;
            params: Simplify<RoutesParams[RouteName]>;
          }
        | undefined
    : never => {
    const matchers = React.useMemo(
      () =>
        rankedMatchers.filter(({ name }) =>
          routeNames.includes(name as RouteName),
        ),
      [JSON.stringify(routeNames)],
    );

    // @ts-expect-error
    return useSyncExternalStoreWithSelector(
      subscribeToLocation,
      () => match(getLocation(), matchers),
      undefined,
      identity,
      areRouteEqual,
    );
  };

  const push = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): void => history.push(matchToHistoryPath(matchers[routeName], first(args)));

  const replace = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): void =>
    history.replace(matchToHistoryPath(matchers[routeName], first(args)));

  return {
    useRoute,
    push,
    replace,
    ...createURLFunctions,
  };
};
