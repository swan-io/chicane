import * as React from "react";
import { useSubscription } from "use-subscription";
import { first } from "./helpers";
import {
  createPath,
  getCurrentLocation,
  hasLocationChanged,
  history,
  parsePath,
  subscribe,
  useLocation,
} from "./history";
import { getMatcher, match, matchAll, matchToHistoryPath } from "./matcher";
import {
  ExtractRoutesParams,
  GetNestedRoutes,
  Matcher,
  ParamsArg,
  PrependBasePath,
  Simplify,
} from "./types";

export { decodeSearch, encodeSearch } from "./search";
export type { Location, Search } from "./types";

const focusableElements: Record<string, boolean> = {
  A: true,
  INPUT: true,
  SELECT: true,
  TEXTAREA: true,
};

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

  const { basePath = "", blockerMessage = "" } = options;

  const matchers = {} as Record<keyof Routes, Matcher>;
  const rankedMatchers: Matcher[] = []; // higher to lower

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
  ): string => createPath(matchToHistoryPath(matchers[routeName], first(args)));

  const navigate = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): void => history.push(matchToHistoryPath(matchers[routeName], first(args)));

  const replace = <RouteName extends keyof FiniteRoutes>(
    routeName: RouteName,
    ...args: ParamsArg<FiniteRoutesParams[RouteName]>
  ): void =>
    history.replace(matchToHistoryPath(matchers[routeName], first(args)));

  const useRoutes = <RouteName extends keyof FiniteRoutes | keyof NestedRoutes>(
    routeNames: ReadonlyArray<RouteName>,
  ): RouteName extends string
    ? { name: RouteName; params: Simplify<RoutesParams[RouteName]> }[]
    : never => {
    const routes = useSubscription(
      React.useMemo(() => {
        const matchers = rankedMatchers.filter(({ name }) =>
          routeNames.includes(name as RouteName),
        );

        return {
          getCurrentValue: () => {
            const routes = matchAll(getCurrentLocation(), matchers).reverse();
            return JSON.stringify(routes);
          },
          subscribe,
        };
      }, [JSON.stringify(routeNames)]),
    );

    return JSON.parse(routes);
  };

  const useRoute = <RouteName extends keyof FiniteRoutes | keyof NestedRoutes>(
    routeNames: ReadonlyArray<RouteName>,
  ): RouteName extends string
    ? { name: RouteName; params: Simplify<RoutesParams[RouteName]> } | undefined
    : never => {
    const route = useSubscription(
      React.useMemo(() => {
        const matchers = rankedMatchers.filter(({ name }) =>
          routeNames.includes(name as RouteName),
        );

        return {
          getCurrentValue: () => {
            const route = match(getCurrentLocation(), matchers);
            return route ? JSON.stringify(route) : route;
          },
          subscribe,
        };
      }, [JSON.stringify(routeNames)]),
    );

    return route ? JSON.parse(route) : route;
  };

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
    const active = useSubscription(
      React.useMemo(
        () => ({
          getCurrentValue: () => href === getCurrentLocation().url,
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

  const useBlocker = (blocked: boolean, message = blockerMessage) => {
    React.useEffect(() => {
      if (!blocked) {
        return;
      }

      const unblock = history.block((transition) => {
        if (window.confirm(message)) {
          unblock();
          transition.retry();
        }
      });

      return unblock;
    }, [blocked]);
  };

  type RouteFocusProps = {
    route?:
      | { name: string; params: Record<string, string | string[] | undefined> }
      | undefined;
    containerRef: React.RefObject<unknown>;
  };

  const useRouteFocus = ({ route, containerRef }: RouteFocusProps) => {
    React.useEffect(() => {
      const element = containerRef.current as HTMLElement | undefined;
      // Only focus after a history change for UX, so that areas outside routing (e.g. navigation header)
      // are available immediately to keyboard navigation
      if (element && hasLocationChanged()) {
        try {
          const name = element.nodeName;
          // A tabIndex of -1 allows element to be programmatically focused but
          // prevents keyboard focus, so we don't want to set the value on elements
          // that support keyboard focus by default.
          if (
            element.getAttribute("tabIndex") == null &&
            focusableElements[name] == null
          ) {
            element.setAttribute("tabIndex", "-1");
          }
          element.focus();
        } catch (err) {}
      }
    }, [route?.name, JSON.stringify(route?.params), containerRef]);
  };

  return {
    getLocation: getCurrentLocation,
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
    useRoutes,
    useRoute,
    useBlocker,
    useRouteFocus,
  };
};
