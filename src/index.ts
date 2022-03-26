import { createPath, parsePath } from "history";
import * as React from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { areItemKeysEqual, concatPaths, first, identity } from "./helpers";
import {
  getCurrentLocation,
  hasInitialLocationChanged,
  history,
  subscribe,
  useLocation,
} from "./history";
import { getMatcher, match, matchToHistoryPath } from "./matcher";
import { decodeSearch, encodeSearch } from "./search";
import {
  ConcatPaths,
  ExtractRoutesParams,
  GetNestedRoutes,
  Matcher,
  Params,
  ParamsArg,
  PrependBasePath,
  Simplify,
} from "./types";

export type { Location, Search } from "./types";

const focusableElements: Record<string, true> = {
  A: true,
  INPUT: true,
  SELECT: true,
  TEXTAREA: true,
};

export const createGroup = <
  GroupName extends string,
  BasePath extends string,
  Routes extends Record<string, string>,
>(
  name: GroupName,
  basePath: BasePath,
  routes: Readonly<Routes>,
): {
  [K in keyof Routes as K extends string
    ? `${GroupName}.${K}`
    : never]: ConcatPaths<BasePath, Routes[K]>;
} => {
  const output: Record<string, string> = {};

  for (const key in routes) {
    if (Object.prototype.hasOwnProperty.call(routes, key)) {
      output[`${name}.${key}`] = concatPaths(basePath, routes[key]);
    }
  }

  // @ts-expect-error
  return output;
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

  const forward = (): void => history.forward();
  const back = (): void => history.back();

  const pushUnsafe = (url: string): void => {
    const { pathname = "", search = "", hash = "" } = parsePath(url);
    history.push({ pathname, search, hash });
  };

  const replaceUnsafe = (url: string) => {
    const { pathname = "", search = "", hash = "" } = parsePath(url);
    history.replace({ pathname, search, hash });
  };

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
    ? { name: RouteName; params: Simplify<RoutesParams[RouteName]> } | undefined
    : never => {
    const matchers = React.useMemo(
      () =>
        rankedMatchers.filter(({ name }) =>
          routeNames.includes(name as RouteName),
        ),
      [JSON.stringify(routeNames)],
    );

    const { route } = useSyncExternalStoreWithSelector(
      subscribe,
      () => {
        const route = match(getCurrentLocation(), matchers);

        return {
          key: JSON.stringify(route),
          route,
        };
      },
      undefined,
      identity,
      areItemKeysEqual,
    );

    // @ts-expect-error
    return route;
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
    const hrefPath = React.useMemo(() => parsePath(href).pathname, [href]);

    const active = useSyncExternalStore(subscribe, () => {
      return hrefPath === getCurrentLocation().raw.path;
    });

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
              replaceUnsafe(href);
            } else {
              pushUnsafe(href);
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

  const useRouteFocus = ({
    route,
    containerRef,
  }: {
    route?: { name: string; params: Params } | undefined;
    containerRef: React.RefObject<unknown>;
  }) => {
    const updateKey = React.useMemo((): string | undefined => {
      if (route != null) {
        const matcher = matchers[route.name];

        if (matcher != null) {
          const params: Params = {};

          for (const key of matcher.pathParams) {
            params[key] = route.params[key];
          }

          return JSON.stringify({ name: route.name, params });
        }
      }
    }, [route]);

    React.useEffect(() => {
      const element = containerRef.current as HTMLElement | undefined;

      // Only focus after a history change for UX, so that areas outside routing
      // (e.g. navigation header) are available immediately to keyboard navigation
      if (element && hasInitialLocationChanged()) {
        try {
          // A tabIndex of -1 allows element to be programmatically focused but
          // prevents keyboard focus, so we don't want to set the value on elements
          // that support keyboard focus by default.
          if (
            element.getAttribute("tabIndex") == null &&
            !focusableElements[element.nodeName]
          ) {
            element.setAttribute("tabIndex", "-1");
          }

          element.focus();
        } catch (_error) {}
      }
    }, [containerRef, updateKey]);
  };

  return {
    getLocation: getCurrentLocation,
    back,
    createURL,
    decodeSearch,
    encodeSearch,
    forward,
    push,
    pushUnsafe,
    replace,
    replaceUnsafe,
    subscribe,
    useBlocker,
    useLink,
    useLocation,
    useRoute,
    useRouteFocus,
  };
};
