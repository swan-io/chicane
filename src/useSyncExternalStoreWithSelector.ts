import { useCallback, useRef, useSyncExternalStore } from "react";

const unset = Symbol.for("unset");

export const useSyncExternalStoreWithSelector = <Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  selector: (snapshot: Snapshot) => Selection,
  isEqual: (prevSelection: Selection, nextSelection: Selection) => boolean,
): Selection => {
  const ref = useRef<Selection | typeof unset>(unset);

  const getSelection = useCallback((): Selection => {
    const selection = selector(getSnapshot());

    if (ref.current === unset || !isEqual(ref.current, selection)) {
      ref.current = selection;
    }

    return ref.current;
  }, [getSnapshot, selector, isEqual]);

  return useSyncExternalStore(subscribe, getSelection, getSelection);
};
