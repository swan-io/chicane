import { parsePath } from "history";
import * as React from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import {
  pushUnsafe,
  replaceUnsafe,
  subscribeToLocation,
  useGetUniversalLocation,
} from "./history";

// Kudos to https://github.com/remix-run/react-router/pull/7998
export const useLinkProps = ({
  href,
  replace = false,
  target,
}: {
  href: string;
  replace?: boolean | undefined;
  target?: React.HTMLAttributeAnchorTarget | undefined;
}) => {
  const getUniversalLocation = useGetUniversalLocation();
  const hrefPath = React.useMemo(() => parsePath(href).pathname, [href]);

  const active = useSyncExternalStore(
    subscribeToLocation,
    () => hrefPath === getUniversalLocation().raw.path,
  );

  const shouldReplace = replace || active;
  const shouldIgnoreTarget = !target || target === "_self";

  return {
    active,
    onClick: React.useCallback(
      (event: React.MouseEvent) => {
        if (
          !event.defaultPrevented &&
          shouldIgnoreTarget && // Let browser handle "target=_blank" etc.
          event.button === 0 && // Ignore everything but left clicks
          !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) // Ignore clicks with modifier keys
        ) {
          event.preventDefault();

          if (shouldReplace) {
            replaceUnsafe(href);
          } else {
            pushUnsafe(href);
          }
        }
      },
      [shouldReplace, shouldIgnoreTarget, href],
    ),
  };
};
