import { useCallback, useContext, useMemo } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";
import { concatRoutes } from "./concatRoutes";
import { areRouteEqual, first, identity } from "./helpers";
import {
  decodeLocation,
  getLocation,
  GetUniversalLocationContext,
  parseRoute,
  pushUnsafe,
  replaceUnsafe,
  subscribeToLocation,
} from "./history";
import { getMatcher, match, matchToUrl } from "./matcher";
import type {
  GetAreaRoutes,
  GetCreateURLFns,
  GetRoutesParams,
  Matcher,
  Params,
  ParamsArg,
  ParseRoute,
  ParseRoutes,
  PrependBasePath,
  RouteObject,
  UnionToIntersection,
} from "./types";

export const createRouter = <
  Routes extends Record<string, string>,
  BasePath extends string = "",
>(
  routes: Readonly<Routes>,
  options: {
    basePath?: BasePath;
  } = {},
) => {
  type CleanBasePath = ParseRoute<BasePath>["path"];
  type RoutesWithBasePath = PrependBasePath<CleanBasePath, ParseRoutes<Routes>>;
  type AreaRoutes = GetAreaRoutes<RoutesWithBasePath>;
  type AreaRoutesParams = GetRoutesParams<AreaRoutes>;
  type FiniteRoutes = Omit<RoutesWithBasePath, keyof AreaRoutes>;
  type FiniteRoutesParams = GetRoutesParams<FiniteRoutes>;
  type RoutesParams = AreaRoutesParams & FiniteRoutesParams;

  const { basePath = "" } = options;

  const basePathObject: RouteObject = {
    path: parseRoute(basePath).path,
    search: "", // search is not supported in basePath
  };

  const matchers = {} as Record<keyof Routes, Matcher>;
  const rankedMatchers: Matcher[] = []; // higher to lower

  for (const routeName in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, routeName)) {
      const matcher = getMatcher(
        routeName,
        basePath !== ""
          ? concatRoutes(basePathObject, parseRoute(routes[routeName]))
          : routes[routeName],
      );

      matchers[routeName] = matcher;
      rankedMatchers.push(matcher);
    }
  }

  rankedMatchers.sort(
    (matcherA, matcherB) => matcherB.ranking - matcherA.ranking,
  );

  const P = {} as {
    [RouteName in keyof Routes]: <const Params>(params: Params) => {
      readonly name: RouteName;
      readonly params: Params;
    };
  };

  const createURLFns = {} as GetCreateURLFns<FiniteRoutesParams>;

  for (const matcher of rankedMatchers) {
    const name = matcher.name as keyof Routes;
    P[name] = <const Params>(params: Params) => ({ name, params });

    if (!matcher.isArea) {
      const finiteName = name as keyof FiniteRoutes;

      createURLFns[finiteName] = (params?: Params) =>
        matchToUrl(matchers[finiteName], params);
    }
  }

  const useRoute = <RouteName extends keyof FiniteRoutes | keyof AreaRoutes>(
    routeNames: readonly RouteName[],
  ): RouteName extends string
    ?
        | { key: string; name: RouteName; params: RoutesParams[RouteName] }
        | undefined
    : never => {
    const routeNamesKey = routeNames.join(":");

    const matchers = useMemo(() => {
      const routeNamesSet = new Set(routeNames);

      return rankedMatchers.filter(({ name }) =>
        routeNamesSet.has(name as RouteName),
      );
    }, [routeNamesKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const getUniversalLocation = useContext(GetUniversalLocationContext);

    const getMatch = useCallback(
      () => match(getUniversalLocation(), matchers),
      [getUniversalLocation, matchers],
    );

    // @ts-expect-error
    return useSyncExternalStoreWithSelector(
      subscribeToLocation,
      getMatch,
      getMatch,
      identity,
      areRouteEqual,
    );
  };

  const getRoute = <RouteName extends keyof FiniteRoutes | keyof AreaRoutes>(
    routeNames: readonly RouteName[],
    location?: string,
  ): RouteName extends string
    ?
        | { key: string; name: RouteName; params: RoutesParams[RouteName] }
        | undefined
    : never => {
    const locationObject =
      location != null ? decodeLocation(location) : getLocation();

    const routeNamesSet = new Set(routeNames);

    const matchers = rankedMatchers.filter(({ name }) =>
      routeNamesSet.has(name as RouteName),
    );

    // @ts-expect-error
    return match(locationObject, matchers);
  };

  const push = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...params: ParamsArg<UnionToIntersection<FiniteRoutesParams[RouteName]>>
  ): void => pushUnsafe(matchToUrl(matchers[routeName], first(params)));

  const replace = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...params: ParamsArg<UnionToIntersection<FiniteRoutesParams[RouteName]>>
  ): void => replaceUnsafe(matchToUrl(matchers[routeName], first(params)));

  return {
    useRoute,
    getRoute,
    push,
    replace,
    P,
    ...createURLFns,
  };
};
