// This module makes the different routes created with react-chicane listen to the same history instance
import { createBrowserHistory, createPath } from "history";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { areArrayDifferent } from "./helpers";
import { decodeLocation } from "./location";
import { Location, Search, Subscription } from "./types";

const subscriptions = new Set<Subscription>();

export const history = createBrowserHistory();

let currentLocation = decodeLocation(history.location, true);
let initialLocationHasChanged = false;

if (currentLocation.toString() !== createPath(history.location)) {
  history.replace(currentLocation.toString()); // URL cleanup
}

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
            areArrayDifferent(value, prevValue)
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
      ...(nextLocation.hash != null && {
        hash: nextLocation.hash,
      }),
      raw: nextLocation.raw,
      toString: nextLocation.toString,
    };

    subscriptions.forEach((subscription) => subscription(currentLocation));
  }
});

export const subscribe = (subscription: Subscription): (() => void) => {
  subscriptions.add(subscription);

  return () => {
    subscriptions.delete(subscription);
  };
};

export const getCurrentLocation = () => currentLocation;
export const hasInitialLocationChanged = () => initialLocationHasChanged;

export const useLocation = (): Location =>
  useSyncExternalStore(subscribe, getCurrentLocation);

// For testing purposes
export const resetInitialHasLocationChanged = () => {
  initialLocationHasChanged = false;
};
