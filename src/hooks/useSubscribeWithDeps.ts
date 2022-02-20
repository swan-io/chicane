import * as React from "react";
import { useIsUpdate } from "./useIsUpdate";
import { useLazyRef } from "./useLazyRef";

type Subscription = () => void;
type Subscribe = (subscription: Subscription) => () => void;

export const useSubscribeWithDeps = (
  subscribe: Subscribe,
  deps: React.DependencyList,
): Subscribe => {
  const isUpdate = useIsUpdate();
  const subscriptions = useLazyRef(() => new Set<Subscription>());

  React.useEffect(
    () =>
      subscribe(() => {
        subscriptions.current.forEach((subscription) => {
          subscription();
        });
      }),
    [subscribe],
  );

  React.useEffect(() => {
    if (isUpdate) {
      subscriptions.current.forEach((subscription) => {
        subscription();
      });
    }
  }, deps);

  return React.useCallback((subscription) => {
    subscriptions.current.add(subscription);

    return () => {
      subscriptions.current.delete(subscription);
    };
  }, []);
};
