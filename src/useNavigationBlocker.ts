import { useEffect } from "react";
import { blockHistory } from "./history";

export const useNavigationBlocker = (blocked: boolean, message: string) => {
  useEffect(() => {
    if (!blocked) {
      return;
    }

    const unblock = blockHistory((retry) => {
      if (window.confirm(message)) {
        unblock();
        retry();
      }
    });

    return unblock;
  }, [blocked]); // eslint-disable-line react-hooks/exhaustive-deps
};
