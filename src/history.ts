// This module makes the different routes created with react-chicane listen to the same history instance
import { createBrowserHistory, createPath } from "history";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { decodeLocation } from "./location";
import { Location, Search, Subscription } from "./types";

const subscriptions = new Set<Subscription>();

export const history = createBrowserHistory();

let currentLocation = decodeLocation(history.location, true);
let initialLocationHasChanged = false;

if (currentLocation.raw.toString() !== createPath(history.location)) {
  history.replace(currentLocation.raw.toString()); // URL cleanup
}

history.listen(({ location }) => {
  const nextLocation = decodeLocation(location, false);

  // As the `encodeSearch` function guarantees a stable sorting, we can rely on a simple URL comparison
  if (nextLocation.raw.toString() === currentLocation.raw.toString()) {
    return;
  }

  initialLocationHasChanged = true;

  // We have to create a new location object instance to trigger a location update
  currentLocation = { ...currentLocation };

  if (nextLocation.raw.path !== currentLocation.raw.path) {
    currentLocation.path = nextLocation.path;
  }

  if (nextLocation.raw.search !== currentLocation.raw.search) {
    const nextSearch: Search = {};

    for (const key in nextLocation.search) {
      const prevValue = currentLocation.search[key];
      const value = nextLocation.search[key];

      if (
        value == null ||
        !Object.prototype.hasOwnProperty.call(nextLocation.search, key)
      ) {
        continue;
      }

      if (
        typeof value === "string" ||
        prevValue == null ||
        value.length !== prevValue.length ||
        JSON.stringify(value) !== JSON.stringify(prevValue)
      ) {
        nextSearch[key] = value;
      } else {
        // Reuse array instance if the new content is similar
        nextSearch[key] = prevValue;
      }
    }

    currentLocation.search = nextSearch;
  }

  if (nextLocation.raw.hash !== currentLocation.raw.hash) {
    if (nextLocation.hash != null) {
      currentLocation.hash = nextLocation.hash;
    } else {
      delete currentLocation.hash;
    }
  }

  currentLocation.raw = nextLocation.raw;
  subscriptions.forEach((subscription) => subscription(currentLocation));
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
