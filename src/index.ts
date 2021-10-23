import { createBrowserHistory, createPath, parsePath } from "history";
import * as React from "react";
import { useSubscription } from "use-subscription";
import { first } from "./helpers";
import { decodeLocation, encodeLocation } from "./location";
import { getHistoryLocationFromMatcher, getMatcher, match } from "./matcher";
import {
  Arguments,
  ExtractRoutesParams,
  GetNestedRoutes,
  Location,
  Matcher,
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
  let currentURL = encodeLocation(currentLocation);

  if (currentURL !== createPath(history.location)) {
    history.replace(currentURL); // URL cleanup
  }

  history.listen(({ location }) => {
    currentLocation = decodeLocation(location, false);
    currentURL = encodeLocation(currentLocation);
    subscriptions.forEach((subscription) => subscription(currentLocation));
  });

  const subscribe = (subscription: Subscription): (() => void) => {
    subscriptions.add(subscription);

    return () => {
      subscriptions.delete(subscription);
    };
  };

  return {
    get location() {
      return currentLocation;
    },
    get url() {
      return currentURL;
    },

    subscribe,

    goForward: (): void => history.forward(),
    goBack: (): void => history.back(),

    navigate: <FiniteRouteName extends keyof FiniteRoutes>(
      routeName: FiniteRouteName,
      ...args: Arguments<FiniteRoutesParams[FiniteRouteName]>
    ): void => {
      history.push(
        getHistoryLocationFromMatcher(
          matchers[routeName as keyof Routes],
          first(args),
        ),
      );
    },

    replace: <FiniteRouteName extends keyof FiniteRoutes>(
      routeName: FiniteRouteName,
      ...args: Arguments<FiniteRoutesParams[FiniteRouteName]>
    ): void => {
      history.replace(
        getHistoryLocationFromMatcher(
          matchers[routeName as keyof Routes],
          first(args),
        ),
      );
    },

    getURL: <FiniteRouteName extends keyof FiniteRoutes>(
      routeName: FiniteRouteName,
      ...args: Arguments<FiniteRoutesParams[FiniteRouteName]>
    ): string =>
      createPath(
        getHistoryLocationFromMatcher(
          matchers[routeName as keyof Routes],
          first(args),
        ),
      ),

    useLocation: (): Location =>
      useSubscription(
        React.useMemo(
          () => ({ getCurrentValue: () => currentLocation, subscribe }),
          [],
        ),
      ),

    useURL: (): string =>
      useSubscription(
        React.useMemo(
          () => ({ getCurrentValue: () => currentURL, subscribe }),
          [],
        ),
      ),

    useRoute: <RouteName extends keyof FiniteRoutes | keyof NestedRoutes>(
      routeNames: ReadonlyArray<RouteName>,
    ): RouteName extends string
      ?
          | { name: RouteName; params: Simplify<RoutesParams[RouteName]> }
          | undefined
      : never =>
      // @ts-expect-error
      useSubscription(
        React.useMemo(() => {
          const matchers = rankedMatchers.filter(({ name }) =>
            routeNames.includes(name as RouteName),
          );

          return {
            getCurrentValue: () => match(currentLocation, matchers),
            subscribe,
          };
        }, [JSON.stringify(routeNames)]),
      ),

    // Kudos to https://github.com/remix-run/react-router/pull/7998
    useLinkHandler: ({
      href,
      replace = false,
      target,
    }: {
      href: string;
      replace?: boolean | undefined;
      target?: React.HTMLAttributeAnchorTarget | undefined;
    }) => {
      const { active, historyLocation } = useSubscription(
        React.useMemo(
          () => ({
            getCurrentValue: () => {
              const {
                pathname = "/",
                search = "",
                hash = "",
              } = parsePath(href);

              return {
                active: href === currentURL,
                historyLocation: { pathname, search, hash },
              };
            },
            subscribe,
          }),
          [href],
        ),
      );

      const shouldReplace = replace || active;
      const shouldIgnoreTarget = !target || target === "_self";

      return {
        active,
        onClick: React.useCallback(
          (event: React.MouseEvent) => {
            if (
              shouldIgnoreTarget && // Let browser handle "target=_blank" etc.
              event.button === 0 && // Ignore everything but left clicks
              !(
                event.metaKey ||
                event.altKey ||
                event.ctrlKey ||
                event.shiftKey
              ) // Ignore clicks with modifier keys
            ) {
              event.preventDefault();

              shouldReplace
                ? history.replace(historyLocation)
                : history.push(historyLocation);
            }
          },
          [shouldIgnoreTarget, shouldReplace, historyLocation],
        ),
      };
    },
  };
};
