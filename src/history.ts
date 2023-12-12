// This module makes the different routes created with @swan-io/chicane listen to the same history instance
import { createBrowserHistory, createMemoryHistory, parsePath } from "history";
import { createContext, useContext, useSyncExternalStore } from "react";
import { areParamsArrayEqual } from "./helpers";
import { decodeLocation } from "./location";
import { Location, Search, Subscription } from "./types";

const subscriptions = new Set<Subscription>();

// From https://github.com/facebook/fbjs/blob/v2.0.0/packages/fbjs/src/core/ExecutionEnvironment.js
const canUseDOM =
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

export const history = canUseDOM
  ? createBrowserHistory()
  : createMemoryHistory();

let currentLocation = decodeLocation(history.location, true);
let initialLocationHasChanged = false;

history.listen(({ location }) => {
  const nextLocation = decodeLocation(location, false);

  // As the `encodeSearch` function guarantees a stable sorting, we can rely on a simple URL comparison
  if (nextLocation.toString() !== currentLocation.toString()) {
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
      key: nextLocation.key,

      path:
        nextLocation.raw.path !== currentLocation.raw.path
          ? nextLocation.path
          : currentLocation.path,
      search,
      ...(nextLocation.hash != null && {
        hash: nextLocation.hash,
      }),

      raw: nextLocation.raw,
      toString: nextLocation.toString,
    };

    subscriptions.forEach((subscription) => subscription(currentLocation));
  }
});

export const subscribeToLocation = (
  subscription: Subscription,
): (() => void) => {
  subscriptions.add(subscription);

  return () => {
    subscriptions.delete(subscription);
  };
};

export const getLocation = (): Location => currentLocation;
export const hasInitialLocationChanged = () => initialLocationHasChanged;

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

export const pushUnsafe = (url: string): void => {
  const { pathname = "", search = "", hash = "" } = parsePath(url);
  history.push({ pathname, search, hash });
};

export const replaceUnsafe = (url: string) => {
  const { pathname = "", search = "", hash = "" } = parsePath(url);
  history.replace({ pathname, search, hash });
};

// For testing purposes
export const resetInitialHasLocationChanged = () => {
  initialLocationHasChanged = false;
};
