import { createPath } from "history";
import { useMemo } from "react";
import { concatRoutes, parseRoute } from "./concatRoutes";
import { areRouteEqual, first, identity } from "./helpers";
import {
  getLocation,
  history,
  subscribeToLocation,
  useGetUniversalLocation,
} from "./history";
import { getMatcher, match, matchToHistoryPath } from "./matcher";
import {
  GetAreaRoutes,
  GetCreateURLFns,
  GetRoutesParams,
  Matcher,
  Params,
  ParamsArg,
  ParseRoute,
  ParseRoutes,
  ParsedRoute,
  PrependBasePath,
  Simplify,
} from "./types";
import { useSyncExternalStoreWithSelector } from "./useSyncExternalStoreWithSelector";

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

  const basePathObject: ParsedRoute = {
    path: parseRoute(basePath).path,
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

  const createURLFns = {} as GetCreateURLFns<FiniteRoutesParams>;

  for (let index = 0; index < rankedMatchers.length; index++) {
    const matcher = rankedMatchers[index];

    if (matcher != null && !matcher.isArea) {
      const routeName = matcher.name as keyof FiniteRoutes;

      createURLFns[routeName] = (params?: Params) =>
        createPath(matchToHistoryPath(matchers[routeName], params));
    }
  }

  const useRoute = <RouteName extends keyof FiniteRoutes | keyof AreaRoutes>(
    routeNames: ReadonlyArray<RouteName>,
  ): RouteName extends string
    ? { name: RouteName; params: Simplify<RoutesParams[RouteName]> } | undefined
    : never => {
    const matchersKey = JSON.stringify(routeNames);

    const matchers = useMemo(
      () =>
        rankedMatchers.filter(({ name }) =>
          routeNames.includes(name as RouteName),
        ),
      [matchersKey], // eslint-disable-line react-hooks/exhaustive-deps
    );

    const getUniversalLocation = useGetUniversalLocation();
    const getMatch = () => match(getUniversalLocation(), matchers);

    // @ts-expect-error
    return useSyncExternalStoreWithSelector(
      subscribeToLocation,
      getMatch,
      identity,
      areRouteEqual,
    );
  };

  const getRoute = <RouteName extends keyof FiniteRoutes | keyof AreaRoutes>(
    routeNames: ReadonlyArray<RouteName>,
  ): RouteName extends string
    ? { name: RouteName; params: Simplify<RoutesParams[RouteName]> } | undefined
    : never => {
    const location = getLocation();
    const matchers = rankedMatchers.filter(({ name }) =>
      routeNames.includes(name as RouteName),
    );

    // @ts-expect-error
    return match(location, matchers);
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
    getRoute,
    push,
    replace,
    ...createURLFns,
  };
};
