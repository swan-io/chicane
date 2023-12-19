export type Location = {
  pathname: string;
  search: string;
  hash: string;
};

export type Listener = (location: Location) => void;

type Retry = () => void;
type Unblock = () => void;
type Blocker = (retry: Retry) => void;

export type History = {
  readonly location: Location;
  push(to: Location): void;
  replace(to: Location): void;
  listen(listener: Listener): () => void;
  block: (blocker: Blocker) => Unblock;
};

const promptBeforeUnload = (event: BeforeUnloadEvent) => {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = "";
};

export const createBrowserHistory = (): History => {
  const globalHistory = window.history;
  const globalLocation = window.location;

  const getLocation = (): Location => {
    const { pathname, search, hash } = globalLocation;
    return { pathname, search, hash };
  };

  const blockers = new Set<Blocker>();
  const listeners = new Set<Listener>();
  let location = getLocation();
  let isBlockedPopStateEvent = false;

  window.addEventListener("popstate", () => {
    if (blockers.size === 0) {
      location = getLocation();
      return listeners.forEach((fn) => fn(location));
    }

    if (!isBlockedPopStateEvent) {
      isBlockedPopStateEvent = true;
      globalHistory.forward();
    } else {
      isBlockedPopStateEvent = false;
      blockers.forEach((blocker) => blocker(() => globalHistory.back()));
    }
  });

  const push = (to: Location): void => {
    if (blockers.size > 0) {
      return blockers.forEach((blocker) => blocker(() => push(to)));
    }

    location = to;
    const url = createPath(location);

    try {
      // iOS has a limit of 100 pushState calls / 30 secs
      globalHistory.pushState(null, "", url);
    } catch {
      globalLocation.assign(url);
    }

    listeners.forEach((fn) => fn(location));
  };

  const replace = (to: Location): void => {
    if (blockers.size > 0) {
      return blockers.forEach((blocker) => blocker(() => replace(to)));
    }

    location = to;
    const url = createPath(location);

    globalHistory.replaceState(null, "", url);
    listeners.forEach((fn) => fn(location));
  };

  const block = (blocker: Blocker) => {
    blockers.add(blocker);

    if (blockers.size === 1) {
      window.addEventListener("beforeunload", promptBeforeUnload);
    }

    return () => {
      blockers.delete(blocker);

      if (blockers.size === 0) {
        window.removeEventListener("beforeunload", promptBeforeUnload);
      }
    };
  };

  const history: History = {
    get location() {
      return location;
    },
    push,
    replace,
    listen(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    block,
  };

  return history;
};

export const createPath = ({ pathname, search, hash }: Location) => {
  let output = pathname;

  if (search !== "" && search !== "?") {
    output += search.charAt(0) === "?" ? search : "?" + search;
  }
  if (hash !== "" && hash !== "#") {
    output += hash.charAt(0) === "#" ? hash : "#" + hash;
  }

  return output;
};

export const parsePath = (path: string): Location => {
  const output: Location = { pathname: "/", search: "", hash: "" };

  if (path) {
    let mutable = path;

    const hashIndex = mutable.indexOf("#");
    const searchIndex = mutable.indexOf("?");

    if (hashIndex >= 0) {
      output.hash = mutable.substring(hashIndex);
      mutable = mutable.substring(0, hashIndex);
    }
    if (searchIndex >= 0) {
      output.search = mutable.substring(searchIndex);
      mutable = mutable.substring(0, searchIndex);
    }

    if (mutable) {
      output.pathname = mutable;
    }
  }

  return output;
};
