import { useEffect } from "react";
import { block } from "./history";

export const useNavigationBlocker = (blocked: boolean, message: string) => {
  useEffect(() => {
    if (blocked) {
      return block(message);
    }
  }, [blocked]); // eslint-disable-line react-hooks/exhaustive-deps
};
