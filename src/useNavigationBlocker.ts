import { useEffect } from "react";
import { history } from "./history";

export const useNavigationBlocker = (blocked: boolean, message: string) => {
  useEffect(() => {
    if (!blocked) {
      return;
    }

    const unblock = history.block((retry) => {
      if (window.confirm(message)) {
        unblock();
        retry();
      }
    });

    return unblock;
  }, [blocked]); // eslint-disable-line react-hooks/exhaustive-deps
};
