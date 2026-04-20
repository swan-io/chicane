import { getLocation, replaceUnsafe } from "@zoontek/chicane";
import { useLayoutEffect } from "react";

export const Redirect = ({ to }: { to: string }) => {
  useLayoutEffect(() => {
    if (to !== getLocation().toString()) {
      replaceUnsafe(to);
    }
  }, []);

  return null;
};
