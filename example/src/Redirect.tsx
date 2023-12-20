import { getLocation, replaceUnsafe } from "@swan-io/chicane/src";
import { useLayoutEffect } from "react";

export const Redirect = ({ to }: { to: string }) => {
  useLayoutEffect(() => {
    if (to !== getLocation().toString()) {
      replaceUnsafe(to);
    }
  }, []);

  return null;
};
