// This module makes the different routes created with @swan-io/chicane listen to the same history instance
import { createContext, useContext, useSyncExternalStore } from "react";
import { areParamsArrayEqual, noop } from "./helpers";
import { History, createBrowserHistory, parseRoute } from "./historyLite";
import { decodeLocation } from "./location";
import { Location, Search, Subscription } from "./types";

const subscriptions = new Set<Subscription>();

const history: History =
  typeof window !== "undefined"
    ? createBrowserHistory()
    : {
        location: parseRoute("/"),
        listen: () => noop, // TODO: rename this subscribe
        push: noop,
        replace: noop,
      };

let currentLocation = decodeLocation(history.location, true);
let initialLocationHasChanged = false;

history.listen((location) => {
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
      path:
        nextLocation.raw.path !== currentLocation.raw.path
          ? nextLocation.path
          : currentLocation.path,
      search,

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

export const pushUnsafe = history.push;
export const replaceUnsafe = history.replace;

// For testing purposes
export const resetInitialHasLocationChanged = () => {
  initialLocationHasChanged = false;
};
