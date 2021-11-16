import { createBrowserHistory, createPath, parsePath } from "history";
import * as React from "react";
import { first } from "./helpers";
import { decodeLocation } from "./location";
import { getMatcher, match, matchToHistoryPath } from "./matcher";
import {
  ExtractRoutesParams,
  GetNestedRoutes,
  Location,
  Matcher,
  ParamsArg,
  PrependBasePath,
  Simplify,
  Subscription,
} from "./types";

export { decodeSearch, encodeSearch } from "./search";
export type { Location, Search } from "./types";

export const createRouter = <
  Routes extends Record<string, string>,
  BasePath extends string,
  RoutesWithBasePath extends PrependBasePath<Routes, BasePath>,
  NestedRoutes extends GetNestedRoutes<RoutesWithBasePath>,
  NestedRoutesParams extends ExtractRoutesParams<NestedRoutes>,
  FiniteRoutes extends Omit<RoutesWithBasePath, keyof NestedRoutes>,
  FiniteRoutesParams extends ExtractRoutesParams<FiniteRoutes>,
  RoutesParams extends NestedRoutesParams & FiniteRoutesParams,
>(
  routes: Readonly<Routes>,
  options: { basePath?: BasePath } = {},
) => {
  const { basePath = "" } = options;

  const matchers = {} as Record<keyof Routes, Matcher>;
  const rankedMatchers: Matcher[] = []; // higher to lower
  const subscriptions = new Set<Subscription>();

  for (const routeName in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, routeName)) {
      const matcher = getMatcher(routeName, `${basePath}/${routes[routeName]}`);
      matchers[routeName] = matcher;
      rankedMatchers.push(matcher);
    }
  }

  rankedMatchers.sort(
    (matcherA, matcherB) => matcherB.ranking - matcherA.ranking,
  );

  const history = createBrowserHistory();
  let currentLocation = decodeLocation(history.location, true);

  if (currentLocation.url !== createPath(history.location)) {
    history.replace(currentLocation.url); // URL cleanup
  }

  history.listen(({ location }) => {
    currentLocation = decodeLocation(location, false);
    subscriptions.forEach((subscription) => subscription(currentLocation));
  });

  const goForward = (): void => history.forward();
  const goBack = (): void => history.back();

  const unsafeNavigate = (url: string): void => {
    const { pathname = "/", search = "", hash = "" } = parsePath(url);
    history.push({ pathname, search, hash });
  };

  const unsafeReplace = (url: string) => {
    const { pathname = "/", search = "", hash = "" } = parsePath(url);
    history.replace({ pathname, search, hash });
  };

  const createURL = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): string =>
    createPath(
      matchToHistoryPath(matchers[routeName as keyof Routes], first(args)),
    );

  const navigate = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): void =>
    history.push(
      matchToHistoryPath(matchers[routeName as keyof Routes], first(args)),
    );

  const replace = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): void =>
    history.replace(
      matchToHistoryPath(matchers[routeName as keyof Routes], first(args)),
    );

  const subscribe = (subscription: Subscription): (() => void) => {
    subscriptions.add(subscription);

    return () => {
      subscriptions.delete(subscription);
    };
  };

  const useLocation = (): Location =>
    React.useSyncExternalStore(subscribe, () => currentLocation);

  const useRoute = <RouteName extends keyof FiniteRoutes | keyof NestedRoutes>(
    routeNames: ReadonlyArray<RouteName>,
  ): RouteName extends string
    ? { name: RouteName; params: Simplify<RoutesParams[RouteName]> } | undefined
    : never =>
    // JSON.{stringify,parse} is used to prevent some re-renders,
    // as the params object instance is updated on each one.
    // It seems a useSyncExternalStoreWithSelector hook is planned
    // @see https://github.com/reactwg/react-18/discussions/86
    JSON.parse(
      React.useSyncExternalStore(subscribe, () => {
        const matchers = rankedMatchers.filter(({ name }) =>
          routeNames.includes(name as RouteName),
        );
        return JSON.stringify(match(currentLocation, matchers));
      }),
    );

  // Kudos to https://github.com/remix-run/react-router/pull/7998
  const useLink = ({
    href,
    replace = false,
    target,
  }: {
    href: string;
    replace?: boolean | undefined;
    target?: React.HTMLAttributeAnchorTarget | undefined;
  }) => {
    const active = React.useSyncExternalStore(
      subscribe,
      () => href === currentLocation.url,
    );

    const shouldReplace = replace || active;
    const shouldIgnoreTarget = !target || target === "_self";

    return {
      active,
      onClick: React.useCallback(
        (event: React.MouseEvent) => {
          if (
            !event.defaultPrevented &&
            shouldIgnoreTarget && // Let browser handle "target=_blank" etc.
            event.button === 0 && // Ignore everything but left clicks
            !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) // Ignore clicks with modifier keys
          ) {
            event.preventDefault();

            if (shouldReplace) {
              unsafeReplace(href);
            } else {
              unsafeNavigate(href);
            }
          }
        },
        [shouldReplace, shouldIgnoreTarget, href],
      ),
    };
  };

  return {
    get location() {
      return currentLocation;
    },

    createURL,
    goBack,
    goForward,
    navigate,
    replace,
    subscribe,
    unsafeNavigate,
    unsafeReplace,
    useLink,
    useLocation,
    useRoute,
  };
};
