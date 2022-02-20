import * as React from "react";

const UNSET = Symbol("unset");

export const useLazyRef = <T>(
  getInitialValue: () => T,
): React.MutableRefObject<T> => {
  const ref = React.useRef<T | typeof UNSET>(UNSET);

  if (ref.current === UNSET) {
    ref.current = getInitialValue();
  }

  return ref as React.MutableRefObject<T>;
};
