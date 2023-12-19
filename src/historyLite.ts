import { ensureSlashPrefix } from "./helpers";

export type Location = {
  pathname: string;
  search: string;
};

export type Listener = (location: Location) => void;

export type History = {
  readonly location: Location;
  push: (url: string) => void;
  replace: (url: string) => void;
  listen: (listener: Listener) => () => void;
};

export const createBrowserHistory = (): History => {
  const globalHistory = window.history;
  const globalLocation = window.location;

  // globalHistory.replaceState(0, ""); // TODO: Clean the url here too

  const getLocation = (): Location => {
    const { pathname, search } = globalLocation;
    return { pathname, search };
  };

  const listeners = new Set<Listener>();
  let location = getLocation();

  window.addEventListener("popstate", () => {
    location = getLocation();
    listeners.forEach((fn) => fn(location));
  });

  const push = (url: string): void => {
    location = parsePath(url);
    const url2 = createPath(location); // TODO: use location.toString()

    try {
      // iOS has a limit of 100 pushState calls / 30 secs
      globalHistory.pushState(null, "", url2);
    } catch {
      globalLocation.assign(url2);
    }

    listeners.forEach((fn) => fn(location));
  };

  const replace = (url: string): void => {
    location = parsePath(url);
    const url2 = createPath(location); // TODO: use location.toString()

    globalHistory.replaceState(null, "", url2);
    listeners.forEach((fn) => fn(location));
  };

  const history: History = {
    get location() {
      return location;
    },
    push,
    replace,
    listen: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };

  return history;
};

export const createPath = ({ pathname, search }: Location) => {
  let output = pathname;

  if (search !== "" && search !== "?") {
    output += search[0] === "?" ? search : "?" + search;
  }

  return output;
};

// rename this decodeRoute (encodeRoute should not exists)
export const parsePath = (path: string): Readonly<Location> => {
  const hashIndex = path.indexOf("#");

  const cleanPath = ensureSlashPrefix(
    hashIndex < 0 ? path : path.substring(0, hashIndex),
  );

  const searchIndex = cleanPath.indexOf("?");

  if (searchIndex < 0) {
    return { pathname: cleanPath, search: "" };
  }

  return {
    pathname: cleanPath.substring(0, searchIndex),
    search: cleanPath.substring(searchIndex + 1),
  };
};
