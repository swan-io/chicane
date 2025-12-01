import {
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type HTMLAttributeAnchorTarget,
  type MouseEvent,
} from "react";
import {
  GetUniversalLocationContext,
  parseRoute,
  pushUnsafe,
  replaceUnsafe,
  subscribeToLocation,
} from "./history";

// Kudos to https://github.com/remix-run/react-router/pull/7998
export const useLinkProps = ({
  href,
  replace = false,
  target,
}: {
  href: string;
  replace?: boolean | undefined;
  target?: HTMLAttributeAnchorTarget | undefined;
}) => {
  const hrefPath = useMemo(() => parseRoute(href).path, [href]);
  const getUniversalLocation = useContext(GetUniversalLocationContext);
  const getPath = () => hrefPath === getUniversalLocation().raw.path;
  const active = useSyncExternalStore(subscribeToLocation, getPath, getPath);

  const shouldReplace = replace || active;
  const shouldIgnoreTarget = target == null || target === "_self";

  return {
    active,
    onClick: useCallback(
      (event: MouseEvent) => {
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
