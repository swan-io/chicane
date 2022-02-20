/**
 * This module makes the different routes created with react-chicane listen to the same history instance
 */
import { createBrowserHistory, createPath } from "history";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { areLocationsEqual, decodeLocation } from "./location";
import { Location, Subscription } from "./types";

const subscriptions = new Set<Subscription>();

export const history = createBrowserHistory();

let currentLocation = decodeLocation(history.location, true);
let initialLocationHasChanged = false;

if (currentLocation.url !== createPath(history.location)) {
  history.replace(currentLocation.url); // URL cleanup
}

history.listen(({ location }) => {
  const nextLocation = decodeLocation(location, false);

  if (!areLocationsEqual(nextLocation, currentLocation)) {
    initialLocationHasChanged = true;
    currentLocation = nextLocation;
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
