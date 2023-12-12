import { useCallback, useRef, useSyncExternalStore } from "react";

const unset = Symbol.for("unset");

export const useSyncExternalStoreWithCustomEqual = <Snapshot>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  isEqual: (prevSnapshot: Snapshot, nextSnapshot: Snapshot) => boolean,
): Snapshot => {
  const ref = useRef<Snapshot | typeof unset>(unset);

  const getSnapshotProxy = useCallback((): Snapshot => {
    const snapshot = getSnapshot();

    if (ref.current === unset || !isEqual(ref.current, snapshot)) {
      ref.current = snapshot;
    }

    return ref.current;
  }, [getSnapshot, isEqual]);

  return useSyncExternalStore(subscribe, getSnapshotProxy, getSnapshotProxy);
};
