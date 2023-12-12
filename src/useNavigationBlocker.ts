import { useEffect } from "react";
import { history } from "./history";

export const useNavigationBlocker = (blocked: boolean, message: string) => {
  useEffect(() => {
    if (!blocked) {
      return;
    }

    const unblock = history.block((transition) => {
      if (window.confirm(message)) {
        unblock();
        transition.retry();
      }
    });

    return unblock;
  }, [blocked]); // eslint-disable-line react-hooks/exhaustive-deps
};
