import { createContext, useContext, useSyncExternalStore } from "react";
import {
  areParamsArrayEqual,
  ensureSlashPrefix,
  isNonEmpty,
  noop,
} from "./helpers";
import { decodeUnprefixedSearch, encodeSearch } from "./search";
import { Listener, Location, RouteObject, Search } from "./types";

let initialLocationHasChanged = false;

export const decodeLocation = (url: string): Location => {
  const route = parseRoute(url);
  const path = route.path.substring(1);

  const parsedPath =
    path !== ""
      ? initialLocationHasChanged
        ? path.split("/").map(decodeURIComponent)
        : path.split("/").filter(isNonEmpty).map(decodeURIComponent)
      : [];

  const parsedSearch =
    route.search !== "" ? decodeUnprefixedSearch(route.search) : {};

  const rawPath = "/" + parsedPath.map(encodeURIComponent).join("/");
  const rawSearch = encodeSearch(parsedSearch);
  const stringifiedLocation = rawPath + rawSearch;

  return {
    path: parsedPath,
    search: parsedSearch,

    raw: {
      path: rawPath,
      search: rawSearch,
    },

    toString() {
      return stringifiedLocation;
    },
  };
};

export const createBrowserHistory = () => {
  const listeners = new Set<Listener>();
  const globalHistory = window.history;
  const globalLocation = window.location;

  let currentLocation = decodeLocation(
    globalLocation.pathname + globalLocation.search,
  );

  const maybeUpdateLocation = (nextLocation: Location) => {
    if (nextLocation.toString() === currentLocation.toString()) {
      return; // As the `encodeSearch` function guarantees a stable sorting, we can rely on a simple URL comparison
    }

    initialLocationHasChanged = true;

    const searchHasChanged =
      nextLocation.raw.search !== currentLocation.raw.search;

    const search: Search = searchHasChanged ? {} : currentLocation.search;

    if (searchHasChanged) {
      for (const key in nextLocation.search) {
        if (Object.prototype.hasOwnProperty.call(nextLocation.search, key)) {
          const value = nextLocation.search[key];

          if (value == null) {
            continue;
          }

          const prevValue = currentLocation.search[key];

          if (
            prevValue == null ||
            typeof prevValue === "string" ||
            typeof value === "string" ||
            !areParamsArrayEqual(value, prevValue)
          ) {
            search[key] = value;
          } else {
            // Reuse array instance if the new content is similar
            search[key] = prevValue;
          }
        }
      }
    }

    // Create a new location object instance
    currentLocation = {
      path:
        nextLocation.raw.path !== currentLocation.raw.path
          ? nextLocation.path
          : currentLocation.path,
      search,
      raw: nextLocation.raw,
      toString: nextLocation.toString,
    };

    listeners.forEach((listener) => listener(currentLocation));
  };

  window.addEventListener("popstate", () => {
    maybeUpdateLocation(
      decodeLocation(globalLocation.pathname + globalLocation.search),
    );
  });

  const push = (url: string): void => {
    const nextLocation = decodeLocation(url);
    const nextUrl = nextLocation.toString();

    try {
      // iOS has a limit of 100 pushState calls / 30 secs
      globalHistory.pushState(null, "", nextUrl);
    } catch {
      globalLocation.assign(nextUrl);
    }

    maybeUpdateLocation(nextLocation);
  };

  const replace = (url: string): void => {
    const nextLocation = decodeLocation(url);
    globalHistory.replaceState(null, "", nextLocation.toString());
    maybeUpdateLocation(nextLocation);
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get location() {
      return currentLocation;
    },

    subscribe,
    push,
    replace,
  };
};

export const parseRoute = (route: string): RouteObject => {
  const hashIndex = route.indexOf("#");

  const cleanRoute = ensureSlashPrefix(
    hashIndex < 0 ? route : route.substring(0, hashIndex),
  );

  const searchIndex = cleanRoute.indexOf("?");

  if (searchIndex < 0) {
    return { path: cleanRoute, search: "" };
  }

  return {
    path: cleanRoute.substring(0, searchIndex),
    search: cleanRoute.substring(searchIndex + 1),
  };
};

const history: ReturnType<typeof createBrowserHistory> =
  typeof window !== "undefined"
    ? createBrowserHistory()
    : {
        location: decodeLocation("/"),
        subscribe: () => noop,
        push: noop,
        replace: noop,
      };

export const getLocation = (): Location => history.location;
export const subscribeToLocation = history.subscribe;
export const pushUnsafe = history.push;
export const replaceUnsafe = history.replace;

const GetUniversalLocationContext = createContext<() => Location>(getLocation);

export const GetUniversalLocationProvider =
  GetUniversalLocationContext.Provider;

export const useGetUniversalLocation = () =>
  useContext(GetUniversalLocationContext);

export const useLocation = (): Location => {
  const getUniversalLocation = useGetUniversalLocation();

  return useSyncExternalStore(
    subscribeToLocation,
    getUniversalLocation,
    getUniversalLocation,
  );
};

export const hasInitialLocationChanged = () => initialLocationHasChanged;

// For testing purposes
export const setInitialHasLocationChanged = (value: boolean) => {
  initialLocationHasChanged = value;
};
