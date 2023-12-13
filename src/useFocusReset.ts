import { useEffect } from "react";
import { getLocation, hasInitialLocationChanged } from "./history";
import { Params } from "./types";

const focusableElements: Record<string, true> = {
  A: true,
  INPUT: true,
  SELECT: true,
  TEXTAREA: true,
};

export const useFocusReset = ({
  route,
  containerRef,
}: {
  route?: { name: string; params: Params } | undefined;
  containerRef: React.RefObject<unknown>;
}) => {
  const focusKey =
    (typeof route !== "undefined" ? `${route.name}:` : "") +
    getLocation().raw.path;

  useEffect(() => {
    const element = containerRef.current as HTMLElement | undefined;

    // Only focus after a history change for UX, so that areas outside routing
    // (e.g. navigation header) are available immediately to keyboard navigation
    if (element != null && hasInitialLocationChanged()) {
      try {
        // A tabIndex of -1 allows element to be programmatically focused but
        // prevents keyboard focus, so we don't want to set the value on elements
        // that support keyboard focus by default.
        if (
          element.getAttribute("tabIndex") == null &&
          !focusableElements[element.nodeName]
        ) {
          element.setAttribute("tabIndex", "-1");
        }

        element.focus();
      } catch {} // eslint-disable-line no-empty
    }
  }, [containerRef, focusKey]);
};
