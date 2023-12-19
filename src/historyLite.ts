import { ensureSlashPrefix, isNonEmpty } from "./helpers";
import { decodeUnprefixedSearch, encodeSearch } from "./search";
import { Location, ParsedRoute } from "./types";

export type Listener = (location: Location) => void;

export type History = {
  readonly location: Location;
  listen: (listener: Listener) => () => void;
  push: (url: string) => void;
  replace: (url: string) => void;
};

export const decodeLocation = (
  route: ParsedRoute,
  removeExtraSlashes: boolean,
): Location => {
  const path = route.path.substring(1);

  const parsedPath =
    path !== ""
      ? removeExtraSlashes
        ? path.split("/").filter(isNonEmpty).map(decodeURIComponent)
        : path.split("/").map(decodeURIComponent)
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

export const createBrowserHistory = (): History => {
  const globalHistory = window.history;
  const globalLocation = window.location;

  // globalHistory.replaceState(0, ""); // TODO: Clean the url here too

  const getLocation = (removeExtraSlashes: boolean): Location => {
    const { pathname, search } = globalLocation;
    return decodeLocation({ path: pathname, search }, removeExtraSlashes);
  };

  const listeners = new Set<Listener>();
  let location = getLocation(true);

  window.addEventListener("popstate", () => {
    location = getLocation(false);
    listeners.forEach((fn) => fn(location));
  });

  const push = (url: string): void => {
    location = decodeLocation(parseRoute(url), false);

    try {
      // iOS has a limit of 100 pushState calls / 30 secs
      globalHistory.pushState(null, "", location.toString());
    } catch {
      globalLocation.assign(location.toString());
    }

    listeners.forEach((fn) => fn(location));
  };

  const replace = (url: string): void => {
    location = decodeLocation(parseRoute(url), false);
    globalHistory.replaceState(null, "", location.toString());
    listeners.forEach((fn) => fn(location));
  };

  const listen = (listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get location() {
      return location;
    },

    listen,
    push,
    replace,
  };
};

export const parseRoute = (route: string): ParsedRoute => {
  const hashIndex = route.indexOf("#");

  const cleanPath = ensureSlashPrefix(
    hashIndex < 0 ? route : route.substring(0, hashIndex),
  );

  const searchIndex = cleanPath.indexOf("?");

  if (searchIndex < 0) {
    return { path: cleanPath, search: "" };
  }

  return {
    path: cleanPath.substring(0, searchIndex),
    search: cleanPath.substring(searchIndex + 1),
  };
};
