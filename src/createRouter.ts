import { createPath } from "history";
import * as React from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { areRouteEqual, concatPaths, first, identity } from "./helpers";
import { getLocation, history, subscribeToLocation } from "./history";
import { getMatcher, match, matchToHistoryPath } from "./matcher";
import {
  ExtractRoutesParams,
  GetNestedRoutes,
  Matcher,
  ParamsArg,
  PrependBasePath,
  Simplify,
} from "./types";

export const createRouter = <
  Routes extends Record<string, string>,
  BasePath extends string = string,
>(
  routes: Readonly<Routes>,
  options: {
    basePath?: BasePath;
    blockerMessage?: string;
  } = {},
) => {
  type RoutesWithBasePath = PrependBasePath<Routes, BasePath>;
  type NestedRoutes = GetNestedRoutes<RoutesWithBasePath>;
  type NestedRoutesParams = ExtractRoutesParams<NestedRoutes>;
  type FiniteRoutes = Omit<RoutesWithBasePath, keyof NestedRoutes>;
  type FiniteRoutesParams = ExtractRoutesParams<FiniteRoutes>;
  type RoutesParams = NestedRoutesParams & FiniteRoutesParams;

  // const toto = {} as FiniteRoutes;

  const { basePath = "" } = options;

  const matchers = {} as Record<keyof Routes, Matcher>;
  const rankedMatchers: Matcher[] = []; // higher to lower

  for (const routeName in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, routeName)) {
      const matcher = getMatcher(
        routeName,
        concatPaths(basePath, routes[routeName]),
      );

      matchers[routeName] = matcher;
      rankedMatchers.push(matcher);
    }
  }

  rankedMatchers.sort(
    (matcherA, matcherB) => matcherB.ranking - matcherA.ranking,
  );

  const createURL = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): string => createPath(matchToHistoryPath(matchers[routeName], first(args)));

  const push = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): void => history.push(matchToHistoryPath(matchers[routeName], first(args)));

  const replace = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): void =>
    history.replace(matchToHistoryPath(matchers[routeName], first(args)));

  const useRoute = <RouteName extends keyof FiniteRoutes | keyof NestedRoutes>(
    routeNames: ReadonlyArray<RouteName>,
  ): RouteName extends string
    ?
        | {
            name: RouteName;
            key: string;
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

  return {
    createURL,
    push,
    replace,
    useRoute,
    // ...toto,
  };
};
