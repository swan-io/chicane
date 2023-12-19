export type Location = {
  pathname: string;
  search: string;
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
    const { pathname, search } = globalLocation;
    return { pathname, search };
  };

  const blockers = new Set<Blocker>();
  const listeners = new Set<Listener>();

  let location = getLocation();
  let isBlockedPopStateEvent = false;

  window.addEventListener("popstate", () => {
    if (blockers.size > 0) {
      if (!isBlockedPopStateEvent) {
        isBlockedPopStateEvent = true;
        globalHistory.go(1);
      } else {
        isBlockedPopStateEvent = false;
        const retry = () => globalHistory.go(-1);
        blockers.forEach((blocker) => blocker(retry));
      }
    } else {
      location = getLocation();
      listeners.forEach((fn) => fn(location));
    }
  });

  const push = (to: Location): void => {
    if (blockers.size > 0) {
      blockers.forEach((blocker) => blocker(() => push(to)));
    } else {
      location = to;
      const url = createPath(location);

      try {
        // iOS has a limit of 100 pushState calls / 30 secs
        globalHistory.pushState(null, "", url);
      } catch {
        globalLocation.assign(url);
      }

      listeners.forEach((fn) => fn(location));
    }
  };

  const replace = (to: Location): void => {
    if (blockers.size > 0) {
      blockers.forEach((blocker) => blocker(() => replace(to)));
    } else {
      location = to;
      const url = createPath(location);

      globalHistory.replaceState(null, "", url);
      listeners.forEach((fn) => fn(location));
    }
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

export const createPath = ({ pathname, search }: Location) => {
  let output = pathname;

  if (search !== "" && search !== "?") {
    output += search[0] === "?" ? search : "?" + search;
  }

  return output;
};

export const parsePath = (path: string): Location => {
  let rest = path;

  const output: Location = { pathname: "", search: "" };
  const hashIndex = rest.indexOf("#");
  const searchIndex = rest.indexOf("?");

  if (hashIndex >= 0) {
    rest = rest.substring(0, hashIndex);
  }
  if (searchIndex >= 0) {
    output.search = rest.substring(searchIndex);
    rest = rest.substring(0, searchIndex);
  }

  output.pathname = rest[0] === "/" ? rest : `/${rest}`;
  return output;
};
