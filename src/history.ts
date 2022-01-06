/**
 * This module makes the different routes created with react-chicane listen to the same history instance
 */
import { createBrowserHistory, createPath, parsePath } from "history";
import * as React from "react";
import { useSubscription } from "use-subscription";
import { areLocationsEqual, decodeLocation } from "./location";
import { Location, Subscription } from "./types";
const subscriptions = new Set<Subscription>();

export const history = createBrowserHistory();

let currentLocation = decodeLocation(history.location, true);

export const getCurrentLocation = () => {
  return currentLocation;
};

if (currentLocation.url !== createPath(history.location)) {
  history.replace(currentLocation.url); // URL cleanup
}

history.listen(({ location }) => {
  const nextLocation = decodeLocation(location, false);
  if (!areLocationsEqual(nextLocation, currentLocation)) {
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

export const useLocation = (): Location => {
  const subscription = React.useMemo(
    () => ({ getCurrentValue: () => currentLocation, subscribe }),
    [],
  );
  return useSubscription(subscription);
};

export { createPath as createPath };
export { parsePath as parsePath };
